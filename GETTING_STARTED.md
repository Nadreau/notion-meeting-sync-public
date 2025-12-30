# Getting Started - Super Simple Guide

## What You Need

1. **Personal Notion workspace** with a meetings database
2. **Company Notion workspace** where you want to sync meetings
3. **GitHub account** (free)
4. **5-10 minutes**

## Step-by-Step Setup

### 1. Click "Use This Template"
At the top of this GitHub page, click the green "Use this template" button → "Create a new repository". This creates your own copy.

### 2. Open in Browser (No Downloads!)
1. Click the **"Code"** button
2. Click the **"Codespaces"** tab
3. Click **"Create codespace on main"**
4. Wait 30 seconds - you now have a browser-based coding environment!

### 3. Install
```bash
npm install
```

### 4. Run Setup Wizard
```bash
npm run setup
```

The wizard will ask you simple questions. Have these ready:
- Personal Notion integration token
- Company Notion integration token
- Your database URLs
- What tag/category identifies company meetings

### 5. Test It
```bash
npm start
```

If it works, you'll see meetings being copied!

### 6. Make It Automatic

1. Push your code: `git add . && git commit -m "Add config" && git push`
2. Add the secrets from `GITHUB_SECRETS.md` to GitHub (Settings → Secrets → Actions)
3. Done! It runs every morning at 7 AM

## Database Setup

### Your Personal Database
Make sure you have:
- ✅ A "Transcript" property (text) with the meeting transcript
- ✅ A tag/category to identify company meetings (like "Bluon" or "Acme Corp")

### Company Database
Create a new database with exactly 3 properties:
- ✅ **Title** (any name)
- ✅ **URL** (type: URL)
- ✅ **Transcript** (type: Text)

## That's It!

The script will:
- Find meetings tagged for your company
- Copy the title, transcript, and a link to original
- Skip duplicates
- Run every morning at 7 AM
