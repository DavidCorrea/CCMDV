# Manantial de Vida - Website

Static website for Manantial de Vida church, built with Astro, TypeScript, and Tailwind CSS.

## Features

- ✅ **Static Site Generation** - Fast, SEO-friendly static site
- ✅ **i18n Ready** - Currently in Spanish, easy to add more languages
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Hot Reload** - Fast development with instant updates
- ✅ **TypeScript** - Type-safe development
- ✅ **YouTube Integration** - Live stream detection and recent videos display

## 🚀 Getting Started

### Install Dependencies

```sh
npm install
```

### Development

You have two options for local development:

**Option 1: Standard Astro Dev (without Edge Functions)**
```sh
npm run dev
```
- Site available at `http://localhost:4321`
- **Note**: The `/vivo` page won't work in this mode since it requires Edge Functions

**Option 2: Netlify Dev (with Edge Functions) - Recommended**
```sh
npm run dev:netlify
```
- Runs both Astro and Edge Functions **locally** (no connection to Netlify servers)
- Uses local Deno runtime to execute Edge Functions
- Site available at `http://localhost:8888` (default Netlify dev port)
- The `/vivo` page will work and fetch YouTube data from the local Edge Function
- Reads environment variables from `.env` file automatically
- **Note**: This is completely local - no interaction with Netlify servers required

**Option 3: Test Edge Function Directly (Standalone)**
```sh
npm run test:edge
```
- Tests the Edge Function logic directly using Deno (no Netlify CLI needed)
- Useful for debugging YouTube API calls in isolation
- Requires Deno to be installed: `brew install deno` (macOS) or [download](https://deno.land/)

### YouTube Integration Setup

To enable the live stream and videos page, you need to configure YouTube API credentials:

1. **Get a YouTube Data API v3 Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "YouTube Data API v3"
   - Create credentials (API Key)
   - Copy your API key

2. **Get your YouTube Channel ID:**
   - Go to your YouTube channel
   - The Channel ID is in the URL or you can find it in your channel settings

3. **For Local Development** - Create a `.env` file in the project root:
   ```env
   YOUTUBE_API_KEY=your_api_key_here
   YOUTUBE_CHANNEL_ID=your_channel_id_here
   ```
   - **Alternative**: You can also use `PUBLIC_YOUTUBE_API_KEY` and `PUBLIC_YOUTUBE_CHANNEL_ID` (the Edge Function will check both)
   - **Important**: Use `npm run dev:netlify` (not `npm run dev`) to test the `/vivo` page locally, as it requires Edge Functions

4. **For Production on Netlify**: Use `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` (without `PUBLIC_`) in Netlify's environment variables to keep the API key secure server-side

The `/vivo` page will automatically:
- Show a live stream if one is currently active
- Display recent videos (always shown, even when live stream is active)
- Fetch fresh data on each page load (when deployed to Netlify)

### Google Calendar Integration Setup

To enable the calendar events on the activities page, you need to configure Google Calendar API credentials:

1. **Get a Google Calendar API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Google Calendar API"
   - Create credentials (API Key)
   - Copy your API key

2. **Get your Calendar ID:**
   - Go to [Google Calendar](https://calendar.google.com/)
   - Find the calendar you want to use
   - Go to Calendar settings → Integrate calendar
   - Copy the "Calendar ID" (usually in format `xxxxx@group.calendar.google.com` or your email)
   - **Important**: The calendar must be public or you need to share it publicly

3. **For Local Development** - Add to your `.env` file:
   ```env
   GOOGLE_CALENDAR_API_KEY=your_api_key_here
   GOOGLE_CALENDAR_ID=your_calendar_id_here
   ```
   - **Alternative**: You can also use `PUBLIC_GOOGLE_CALENDAR_API_KEY` and `PUBLIC_GOOGLE_CALENDAR_ID` (the Edge Function will check both)
   - **Important**: Use `npm run dev:netlify` (not `npm run dev`) to test the `/actividades` page locally, as it requires Edge Functions

4. **For Production on Netlify**: Use `GOOGLE_CALENDAR_API_KEY` and `GOOGLE_CALENDAR_ID` (without `PUBLIC_`) in Netlify's environment variables to keep the API key secure server-side

The `/actividades` page will automatically:
- Display upcoming events from your Google Calendar
- Show event details including date, time, location, and description
- Link to the event in Google Calendar
- Fall back to static activities if calendar is not configured

### Build

Build the production site:

```sh
npm run build
```

### Preview

Preview the production build locally:

```sh
npm run preview
```

## 🌍 Adding More Languages

The site is currently set up for Spanish (`es`). To add more languages:

1. **Add the language definition** in `src/i18n/languages.ts`:
   ```typescript
   en: {
     code: 'en',
     name: 'English',
     flag: '🇺🇸',
   },
   ```

2. **Add translations** in `src/i18n/translations.ts`:
   ```typescript
   en: {
     site: {
       name: 'Manantial de Vida',
       description: 'Manantial de Vida Church',
     },
     nav: {
       home: 'Home',
       about: 'About',
       services: 'Services',
       contact: 'Contact',
     },
     // ... more translations
   },
   ```

3. **Create localized pages** in `src/pages/[lang]/` directory (optional, or use the same pages with language detection)

The language switcher in the header will automatically show all supported languages.

## 📁 Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── i18n/       # Internationalization
│   │   ├── languages.ts      # Language definitions
│   │   ├── translations.ts   # Translation strings
│   │   └── utils.ts         # i18n utilities
│   ├── layouts/    # Layout components
│   │   └── BaseLayout.astro
│   ├── pages/      # Pages (routes)
│   │   ├── index.astro
│   │   └── live.astro
│   ├── utils/      # Utility functions
│   │   └── youtube.ts  # YouTube API integration
│   └── styles/     # Global styles
│       └── global.css
└── package.json
```

## 🧞 Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 🚀 Deployment

### Deployment to Netlify (Recommended)

This project is configured for Netlify hosting with Edge Functions for dynamic YouTube data fetching.

#### Setup Instructions

1. **Create a Netlify Account**:
   - Go to [Netlify](https://www.netlify.com/) and sign up (free tier available)

2. **Connect Your Repository**:
   - In Netlify dashboard, click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will automatically detect the build settings from `netlify.toml`

3. **Configure Environment Variables**:
   - In Netlify dashboard, go to **Site settings** → **Environment variables**
   - Add the following variables:
     - `YOUTUBE_API_KEY`: Your YouTube Data API v3 key (keep this secret!)
     - `YOUTUBE_CHANNEL_ID`: Your YouTube Channel ID
     - `GOOGLE_CALENDAR_API_KEY`: Your Google Calendar API key (keep this secret!)
     - `GOOGLE_CALENDAR_ID`: Your Google Calendar ID
   - **Important**: Use keys without `PUBLIC_` prefix so they stay server-side

4. **Deploy**:
   - Netlify will automatically build and deploy when you push to your connected branch
   - Or trigger a deploy manually from the Netlify dashboard

5. **Connect Your GoDaddy Domain** (Optional):
   - In Netlify dashboard, go to **Site settings** → **Domain management**
   - Click **Add custom domain**
   - Enter your domain (e.g., `ccmdv.com` or `www.ccmdv.com`)
   - Netlify will provide DNS instructions
   - **In GoDaddy**:
     - Go to your GoDaddy account → **My Products** → **DNS**
     - For **root domain** (ccmdv.com):
       - Add an **A Record**: 
         - Type: `A`
         - Name: `@` (or leave blank)
         - Value: Netlify's IP (Netlify will show this, typically `75.2.60.5`)
         - TTL: `600` (or default)
     - For **www subdomain** (www.ccmdv.com):
       - Add a **CNAME Record**:
         - Type: `CNAME`
         - Name: `www`
         - Value: Your Netlify site URL (e.g., `your-site-name.netlify.app`)
         - TTL: `600` (or default)
   - **Wait for DNS propagation** (can take a few minutes to 48 hours)
   - Netlify will automatically provision an SSL certificate (HTTPS)

#### Benefits of Netlify Deployment

- ✅ **Dynamic Content**: YouTube data is fetched fresh on each request (no rebuilds needed)
- ✅ **Secure API Keys**: API keys stay server-side in Edge Functions
- ✅ **Free Tier**: 100GB bandwidth, 300 build minutes per month
- ✅ **Automatic Deploys**: Deploys automatically on git push
- ✅ **Edge Functions**: Fast, serverless functions at the edge

### Deployment to GoDaddy (Alternative)

This project can also be deployed to GoDaddy via GitHub Actions.

#### Setup Instructions

1. **Initialize Git Repository** (if not already done):
   ```sh
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub Repository**:
   - Go to GitHub and create a new repository
   - Push your code:
     ```sh
     git remote add origin https://github.com/yourusername/your-repo-name.git
     git branch -M main
     git push -u origin main
     ```

3. **Configure GitHub Secrets**:
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Add the following secrets:
     - `FTP_SERVER`: Your GoDaddy FTP server (e.g., `ftp.yourdomain.com`)
     - `FTP_USERNAME`: Your GoDaddy FTP username
     - `FTP_PASSWORD`: Your GoDaddy FTP password
     - `PUBLIC_YOUTUBE_API_KEY`: Your YouTube API key (for build-time)
     - `PUBLIC_YOUTUBE_CHANNEL_ID`: Your YouTube Channel ID (for build-time)

4. **Deploy**:
   - Push to the `main` branch, and GitHub Actions will automatically:
     - Build your Astro site
     - Deploy it to GoDaddy via FTP
   - **Note**: With GoDaddy, you'll need to rebuild to get fresh YouTube data

### Manual Deployment

If you prefer to deploy manually:

```sh
npm run build
# Then upload the contents of the dist/ folder to your hosting provider
```

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com)
