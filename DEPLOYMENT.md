# Deployment Guide

This guide will help you deploy your Student Attendance Tracker to GitHub and make it accessible via a website link.

## Table of Contents

1. [Upload to GitHub](#upload-to-github)
2. [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
3. [Deploy to Netlify](#deploy-to-netlify)
4. [Deploy to GitHub Pages](#deploy-to-github-pages)
5. [Custom Domain Setup](#custom-domain-setup)

---

## Upload to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `student-attendance-tracker` (or your preferred name)
   - **Description**: "A modern web-based attendance tracking system"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 2: Initialize Git (if not already done)

Open your terminal in the project directory and run:

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### Step 3: Add Files and Commit

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Student Attendance Tracker"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/student-attendance-tracker.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

1. Go to your GitHub repository page
2. Verify all files are uploaded correctly
3. Check that the README.md displays properly

---

## Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Next.js applications.

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. In Vercel dashboard, click "Add New..." → "Project"
2. Find your `student-attendance-tracker` repository
3. Click "Import"

### Step 3: Configure Project

Vercel will auto-detect Next.js settings:
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

### Step 5: Custom Domain (Optional)

1. In your project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

**Advantages of Vercel:**
- ✅ Automatic deployments on every push to main branch
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Preview deployments for pull requests
- ✅ Zero configuration needed

---

## Deploy to Netlify

### Step 1: Sign Up for Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" and choose "GitHub"
3. Authorize Netlify to access your GitHub account

### Step 2: Import Your Repository

1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub" and find your repository
3. Click "Import"

### Step 3: Configure Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Base directory**: `./` (leave empty)

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your app will be live at: `https://random-name.netlify.app`

### Step 5: Update Netlify Configuration

Since Next.js requires server-side rendering, you need to add a configuration file:

Create `netlify.toml` in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Then redeploy your site.

---

## Deploy to GitHub Pages

⚠️ **Note**: GitHub Pages serves static files only. Next.js requires server-side rendering, so you'll need to export as a static site.

### Step 1: Configure Next.js for Static Export

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
```

### Step 2: Update package.json

Add a script for static export:

```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

### Step 3: Build and Export

```bash
npm run build
```

This will create an `out` directory with static files.

### Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Choose `main` branch and `/out` folder
5. Click "Save"

### Step 5: Update .gitignore

Make sure `out/` is NOT in .gitignore, or remove it:

```bash
# Remove out/ from .gitignore if present
```

### Step 6: Commit and Push

```bash
git add .
git commit -m "Configure for GitHub Pages"
git push
```

Your site will be available at: `https://YOUR_USERNAME.github.io/student-attendance-tracker`

---

## Custom Domain Setup

### For Vercel:

1. Go to your project → Settings → Domains
2. Add your custom domain
3. Update your DNS records:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record with Vercel's IP addresses
4. Wait for DNS propagation (can take up to 48 hours)

### For Netlify:

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain
4. Follow Netlify's DNS configuration instructions

### For GitHub Pages:

1. Go to repository Settings → Pages
2. Enter your custom domain
3. Add a CNAME file in your repository root with your domain name
4. Update your DNS records with your domain provider

---

## Post-Deployment Checklist

- [ ] Test all features on the live site
- [ ] Verify Excel export works
- [ ] Check mobile responsiveness
- [ ] Test attendance posting and editing
- [ ] Verify data persistence (localStorage)
- [ ] Share the link with users

---

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18+
- Review build logs for specific errors

### Site Shows 404

- Verify the build completed successfully
- Check that the correct directory is set as publish directory
- For GitHub Pages, ensure `/out` folder is committed

### localStorage Not Working

- This is expected - localStorage is browser-specific
- Users need to use the same browser/device
- Consider adding a data export/import feature for backup

### Performance Issues

- Enable Vercel/Netlify's CDN
- Optimize images if using any
- Consider adding loading states

---

## Need Help?

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages Documentation](https://docs.github.com/pages)

---

**Recommended**: Use **Vercel** for the easiest deployment experience with Next.js!

