# Notion Meeting Sync

Automatically sync meetings from your personal Notion workspace to a company/team workspace every day at 7 AM.

## What It Does

- 📋 Finds meetings in your personal Notion tagged for your company
- 📝 Copies the meeting title, transcript, and URL to original meeting
- 🔗 Adds a clickable link back to the full meeting in your personal workspace
- ⏰ Runs automatically every day at 7 AM
- ✅ Never creates duplicates

## Quick Start

### 1. Use This Template

Click the green "Use this template" button at the top of this page to create your own copy.

### 2. Clone Your New Repository

```bash
git clone https://github.com/YOUR_USERNAME/notion-meeting-sync.git
cd notion-meeting-sync
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Setup Wizard

```bash
npm run setup
```

The wizard will walk you through:
- Creating Notion integrations (personal + company)
- Finding your database IDs
- Configuring which meetings to sync

### 5. Test Locally

```bash
npm start
```

### 6. Deploy to GitHub

The setup wizard generates a file called `GITHUB_SECRETS.md` with all your secrets.

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret from the `GITHUB_SECRETS.md` file

That's it! It will now run automatically every day at 7 AM.

## Requirements

### Personal Notion Database

Your personal meetings database needs:
- A title property (any name)
- A "Transcript" text property with the full transcript
- A multi-select property to tag meetings (default: "Category")

### Company Notion Database

Create a database in your company workspace with these 3 properties:
- A title property (any name) - **REQUIRED**
- URL (type: URL) - **REQUIRED**
- Transcript (type: Text) - **REQUIRED**

## How It Works

1. **7 AM Daily**: GitHub Actions triggers automatically
2. **Query**: Finds meetings in your personal database tagged with your company name
3. **Check**: Sees which meetings already exist in company database (by title)
4. **Sync**: For each new meeting:
   - Copies the title (formatted nicely if it's a timestamp)
   - Adds URL back to original meeting
   - Copies the full transcript
5. **Skip Duplicates**: Never creates the same meeting twice

## Customization

### Change the Schedule

Edit `.github/workflows/sync-meetings.yml`:

```yaml
schedule:
  - cron: '0 12 * * *'  # 12:00 PM UTC = 7:00 AM EST
```

Use [crontab.guru](https://crontab.guru) to create custom schedules.

### Change Category Property

By default, it looks for a multi-select property called "Category". To use a different property:

1. Edit your `.env` file (or GitHub secret):
```env
CATEGORY_PROPERTY_NAME=Tags
```

2. Update the filter value to match your company name:
```env
CATEGORY_FILTER_VALUE=YourCompanyName
```

## Troubleshooting

### "Could not find property..."

Make sure the property exists in your database and the name matches exactly (case-sensitive).

### "object_not_found" Error

Your integrations don't have access to the databases:
1. Open the database in Notion
2. Click "..." menu → "Add connections"
3. Select your integration

### Transcripts Not Copying

Make sure you have a "Transcript" text property in **both** databases with the actual transcript text. The AI Meeting Notes block itself cannot be copied via the API.

### Manual Trigger

Don't want to wait until 7 AM? Trigger it manually:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select "Sync Notion Meetings"
4. Click **Run workflow**

## Support

Questions? Issues? Open an issue on GitHub!

## License

MIT - Use freely!
