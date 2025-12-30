const { Client } = require('@notionhq/client');

// Initialize Notion clients
const personalNotion = new Client({ auth: process.env.PERSONAL_NOTION_TOKEN });
const companyNotion = new Client({ auth: process.env.COMPANY_NOTION_TOKEN });

const PERSONAL_DATABASE_ID = process.env.PERSONAL_DATABASE_ID;
const COMPANY_DATABASE_ID = process.env.COMPANY_DATABASE_ID;

// Configuration: Which multi-select value to filter by
const CATEGORY_PROPERTY_NAME = process.env.CATEGORY_PROPERTY_NAME || 'Category';
const CATEGORY_FILTER_VALUE = process.env.CATEGORY_FILTER_VALUE;

// Helper function to format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString();
  const day = date.getDate().toString();
  const year = date.getFullYear().toString().slice(-2);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} at ${hours}:${minutes} ${ampm}`;
}

async function syncMeetings() {
  try {
    console.log('🚀 Starting meeting sync...');
    console.log(`📌 Filtering by: ${CATEGORY_PROPERTY_NAME} = "${CATEGORY_FILTER_VALUE}"\n`);

    // Get personal database schema
    console.log('📋 Fetching personal database schema...');
    const personalDatabase = await personalNotion.databases.retrieve({
      database_id: PERSONAL_DATABASE_ID
    });

    console.log('\n=== Personal Database Properties ===');
    const personalPropertyNames = Object.keys(personalDatabase.properties);
    personalPropertyNames.forEach(name => {
      console.log(`  - "${name}" (${personalDatabase.properties[name].type})`);
    });

    // Find the category property
    const categoryPropName = personalPropertyNames.find(name =>
      name.toLowerCase() === CATEGORY_PROPERTY_NAME.toLowerCase()
    );

    if (!categoryPropName) {
      console.error(`\n❌ Error: Could not find property "${CATEGORY_PROPERTY_NAME}" in personal database.`);
      console.error('Available properties:', personalPropertyNames.join(', '));
      process.exit(1);
    }

    console.log(`\n✓ Using category property: "${categoryPropName}"`);

    // Query personal database for filtered meetings
    const personalMeetings = await personalNotion.databases.query({
      database_id: PERSONAL_DATABASE_ID,
      filter: {
        property: categoryPropName,
        multi_select: {
          contains: CATEGORY_FILTER_VALUE
        }
      }
    });

    console.log(`\n✓ Found ${personalMeetings.results.length} meetings tagged "${CATEGORY_FILTER_VALUE}"`);

    // Get company database schema
    console.log('\n📋 Fetching company database schema...');
    const companyDatabase = await companyNotion.databases.retrieve({
      database_id: COMPANY_DATABASE_ID
    });

    console.log('\n=== Company Database Properties ===');
    const companyPropertyNames = Object.keys(companyDatabase.properties);
    companyPropertyNames.forEach(name => {
      console.log(`  - "${name}" (${companyDatabase.properties[name].type})`);
    });

    // Find the title property in company database
    const companyTitleProp = companyPropertyNames.find(name =>
      companyDatabase.properties[name].type === 'title'
    );

    if (!companyTitleProp) {
      console.error('\n❌ Error: Could not find a title property in company database.');
      process.exit(1);
    }

    console.log(`\n✓ Using company title property: "${companyTitleProp}"`);

    // Get existing meetings in company database
    const companyMeetings = await companyNotion.databases.query({
      database_id: COMPANY_DATABASE_ID
    });

    const existingMeetingTitles = new Set();
    companyMeetings.results.forEach(meeting => {
      const titleProp = meeting.properties[companyTitleProp];
      if (titleProp && titleProp.title && titleProp.title.length > 0) {
        existingMeetingTitles.add(titleProp.title[0].plain_text);
      }
    });

    console.log(`\n✓ Found ${existingMeetingTitles.size} existing meetings in company database\n`);

    let newMeetingsCount = 0;

    // Process each meeting
    for (const meeting of personalMeetings.results) {
      const properties = meeting.properties;

      // Extract Meeting Date (title) - find the title property
      let meetingTitle = '';
      const personalTitleProp = personalPropertyNames.find(name =>
        personalDatabase.properties[name].type === 'title'
      );

      if (personalTitleProp && properties[personalTitleProp]) {
        const titleProp = properties[personalTitleProp];
        if (titleProp.title && titleProp.title.length > 0) {
          meetingTitle = titleProp.title[0].plain_text;
        }
      }

      // Format the title if it's a timestamp (starts with @)
      let displayTitle = meetingTitle;
      if (meetingTitle.includes('T') && meetingTitle.includes(':')) {
        try {
          displayTitle = formatDate(meetingTitle);
        } catch (e) {
          displayTitle = meetingTitle;
        }
      }

      // Use "Untitled Meeting" if no title
      displayTitle = displayTitle || 'Untitled Meeting';

      // Skip if already exists
      if (existingMeetingTitles.has(displayTitle)) {
        console.log(`⏭️  Skipping existing: ${displayTitle}`);
        continue;
      }

      console.log(`\n📝 Processing: ${displayTitle}`);

      // Create new page properties
      const newPageProperties = {
        [companyTitleProp]: {
          title: [
            {
              text: {
                content: displayTitle
              }
            }
          ]
        }
      };

      // Add URL to original meeting page
      if (companyPropertyNames.includes('URL')) {
        const originalPageUrl = `https://www.notion.so/${meeting.id.replace(/-/g, '')}`;
        newPageProperties['URL'] = {
          url: originalPageUrl
        };
        console.log(`  ✓ Added URL to original meeting`);
      }

      // Copy Transcript property
      if (companyPropertyNames.includes('Transcript') && properties['Transcript']) {
        const transcriptProp = properties['Transcript'];

        if (transcriptProp.rich_text && transcriptProp.rich_text.length > 0) {
          const richTextArray = [];

          // Process each rich_text item and split if too long
          for (const item of transcriptProp.rich_text) {
            if (item.text && item.text.content) {
              const content = item.text.content;

              // Split long content into 2000 char chunks (Notion limit)
              if (content.length > 2000) {
                console.log(`  ✓ Splitting transcript (${content.length} chars) into chunks`);

                for (let i = 0; i < content.length; i += 2000) {
                  const chunk = content.substring(i, i + 2000);
                  richTextArray.push({
                    type: 'text',
                    text: {
                      content: chunk,
                      link: item.text.link || null
                    },
                    annotations: item.annotations || {
                      bold: false,
                      italic: false,
                      strikethrough: false,
                      underline: false,
                      code: false,
                      color: 'default'
                    }
                  });
                }
              } else {
                richTextArray.push(JSON.parse(JSON.stringify(item)));
              }
            } else {
              richTextArray.push(JSON.parse(JSON.stringify(item)));
            }
          }

          newPageProperties['Transcript'] = {
            rich_text: richTextArray
          };
          console.log(`  ✓ Copied transcript`);
        }
      }

      // Create the page
      await companyNotion.pages.create({
        parent: { database_id: COMPANY_DATABASE_ID },
        properties: newPageProperties
      });

      console.log(`  ✅ Created: ${displayTitle}`);
      newMeetingsCount++;
    }

    console.log(`\n🎉 Sync complete! Created ${newMeetingsCount} new meeting(s)\n`);

  } catch (error) {
    console.error('\n❌ Error syncing meetings:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\nTip: Make sure your integrations have access to both databases.');
      console.error('In Notion: Database menu (...) → Add connections → Select your integration');
    }
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

syncMeetings();
