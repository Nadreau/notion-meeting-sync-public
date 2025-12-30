# Notion Meeting Sync

Automatically sync meetings from your personal Notion workspace to a company/team workspace every day at 7 AM.

## What This Does

- 📋 Finds meetings in your personal Notion tagged for your company
- 📝 Copies the meeting title, transcript, and URL back to original
- ⏰ Runs automatically every day at 7 AM
- ✅ Never creates duplicates

## Requirements

**Before you start, you need:**
1. A GitHub account (free - sign up at https://github.com)
2. Two Notion workspaces (personal + company)
3. A computer with Terminal/Command Prompt
4. 10 minutes

## Step-by-Step Setup Guide

### Step 1: Create Your Own Copy

1. **Click the green "Use this template" button** at the top of this page
2. A menu will appear - **click "Create a new repository"** (NOT "Open in a codespace")
3. Give it a name like `my-meeting-sync`
4. Make sure it's set to **Private** (recommended)
5. **Leave "Include all branches" unchecked** (you only need the main branch)
6. Click **"Create repository"**

✅ You now have your own copy!

### Step 2: Download to Your Computer

1. On your new repository page, click the green **"Code"** button
2. Click **"Download ZIP"**
3. Unzip the downloaded file
4. Open Terminal (Mac) or Command Prompt (Windows)
5. Type `cd ` (with a space after cd)
6. Drag the unzipped folder into the Terminal window (this auto-fills the path)
7. Press Enter

You're now inside the project folder!

### Step 3: Install Node.js (If You Don't Have It)

1. Go to https://nodejs.org
2. Download and install the LTS version
3. Restart Terminal/Command Prompt

### Step 4: Install Dependencies

In Terminal, type:
```bash
npm install
```

Press Enter and wait for it to finish (30 seconds).

### Step 5: Run the Setup Wizard

In Terminal, type:
```bash
npm run setup
```

The wizard will ask you 6 questions. Here's what to have ready:

#### Question 1: Personal Notion Token
1. Go to https://www.notion.so/my-integrations
2. Click **"New integration"**
3. Name: `Personal Meeting Sync`
4. Select your personal workspace
5. Click **"Submit"**
6. Copy the token (starts with `secret_...`)
7. Paste it when the wizard asks

#### Question 2: Personal Database URL
1. Open your meetings database in Notion
2. Copy the URL from your browser
3. Paste it when the wizard asks
4. **Then:** Click the `...` menu in your database → **"Add connections"** → Select your integration

#### Question 3: Category Property Name
- If you have a property called "Category" or "Tags" that you use to label meetings, enter that name
- Just press Enter to use the default: `Category`

#### Question 4: Filter Value
- Enter what you tag company meetings with (like "Acme Corp" or "Company Name")

#### Question 5: Company Notion Token
1. **Switch to your company Notion workspace**
2. Go to https://www.notion.so/my-integrations (in company workspace)
3. Click **"New integration"**
4. Name: `Meeting Sync`
5. Select your company workspace
6. Click **"Submit"**
7. Copy the token
8. Paste it when the wizard asks

#### Question 6: Company Database URL
1. Open (or create) your meetings database in company workspace
2. **Make sure it has these 3 properties:**
   - A title property (can be named anything)
   - **URL** (type: URL)
   - **Transcript** (type: Text)
3. Click the `...` menu → **"Add connections"** → Select your integration
4. Copy the database URL
5. Paste it when the wizard asks

✅ The wizard creates two files: `.env` and `GITHUB_SECRETS.md`

### Step 6: Test It Locally

In Terminal, type:
```bash
npm start
```

You should see meetings being copied! If it works, move to Step 7.

### Step 7: Put It on GitHub

#### A. Upload Your Changes

**Option 1: Using GitHub Desktop (Easier)**
1. Download GitHub Desktop: https://desktop.github.com
2. Open it and sign in
3. Click **File → Add Local Repository**
4. Choose your project folder
5. Click **"Publish repository"**

**Option 2: Using Terminal**
```bash
git add .
git commit -m "Add my configuration"
git push
```

If `git push` asks for credentials, you need to set up authentication first.

#### B. Add Secrets to GitHub

1. Go to your repository on GitHub (e.g., `github.com/YOUR_USERNAME/my-meeting-sync`)
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click the green **"New repository secret"** button

Now open the `GITHUB_SECRETS.md` file on your computer (it was created by the wizard).

For each secret listed in that file:
1. Click **"New repository secret"**
2. Copy the name from GITHUB_SECRETS.md into the "Name" field
3. Copy the value from GITHUB_SECRETS.md into the "Secret" field (the part in the code block)
4. Click **"Add secret"**

Repeat for all 6 secrets:
- `PERSONAL_NOTION_TOKEN`
- `COMPANY_NOTION_TOKEN`
- `PERSONAL_DATABASE_ID`
- `COMPANY_DATABASE_ID`
- `CATEGORY_PROPERTY_NAME`
- `CATEGORY_FILTER_VALUE`

### Step 8: You're Done!

The sync will now run automatically every day at 7 AM!

**To test it immediately:**
1. Go to your GitHub repository
2. Click the **"Actions"** tab (top menu)
3. Click **"Sync Notion Meetings"** in the left sidebar
4. Click the **"Run workflow"** button on the right
5. Click the green **"Run workflow"** button in the dropdown
6. Wait 30 seconds, then refresh the page to see results

## Troubleshooting

### "Command not found: npm"
You need to install Node.js (see Step 3).

### "Could not find property..."
Make sure the property name matches exactly in your Notion database (case-sensitive).

### "object_not_found"
You forgot to share the database with your integration:
1. Open the database in Notion
2. Click `...` menu → "Add connections"
3. Select your integration

### Transcripts aren't copying
Make sure:
1. You have a "Transcript" property in both databases
2. It's a Text type (not Rich Text, not Formula)
3. The transcript is actually in that property (not in the AI Meeting Notes block)

### Need to test again?
Run `npm start` in Terminal to test locally anytime.

### Want to change when it runs?
Edit `.github/workflows/sync-meetings.yml` and change the cron schedule.

## How to Update Your Configuration Later

If you need to change your tokens, database IDs, or filter:

1. Edit the `.env` file on your computer
2. Update the matching secrets on GitHub (Settings → Secrets → Actions)
3. Done!

## Questions?

Open an issue on GitHub and I'll help you out!

## License

MIT - Use freely!
