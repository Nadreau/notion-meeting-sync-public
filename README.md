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

### Step 2: Edit in the Browser (No Downloads Needed!)

1. In your new repository, click the **"Code"** button
2. Click the **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait 30 seconds for it to load

✅ You now have a browser-based coding environment! (It looks like VS Code)

### Step 3: Install Dependencies

In the Terminal at the bottom of your codespace, type:
```bash
npm install
```

Press Enter and wait for it to finish (30 seconds).

### Step 4: Run the Setup Wizard

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
4. **Then:** In Notion, go to **Settings → Connections** → Find your **"Personal Meeting Sync"** integration → Click it → Select your meetings database to give it access

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
3. In Notion, go to **Settings → Connections** → Find your **"Meeting Sync"** integration → Click it → Select your company meetings database to give it access
4. Copy the database URL
5. Paste it when the wizard asks

✅ The wizard creates two files: `.env` and `GITHUB_SECRETS.md`

### Step 6: Test It Locally

In Terminal, type:
```bash
npm start
```

You should see meetings being copied! If it works, move to Step 7.

### Step 7: Save Your Configuration to GitHub

In the Terminal in your codespace, run these commands:

```bash
git add .
git commit -m "Add my configuration"
git push
```

✅ Your configuration is now saved to GitHub!

### Step 8: Add Secrets to GitHub

1. Go to your repository on GitHub (e.g., `github.com/YOUR_USERNAME/my-meeting-sync`)
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click the green **"New repository secret"** button

Now open the `GITHUB_SECRETS.md` file in your codespace (it was created by the wizard).

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

### Step 9: You're Done!

The sync will now run automatically every day at 7 AM!

**To test it immediately:**
1. Go to your GitHub repository
2. Click the **"Actions"** tab (top menu)
3. Click **"Sync Notion Meetings"** in the left sidebar
4. Click the **"Run workflow"** button on the right
5. Click the green **"Run workflow"** button in the dropdown
6. Wait 30 seconds, then refresh the page to see results
