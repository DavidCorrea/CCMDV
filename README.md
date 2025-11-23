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

Start the development server with hot-reload:

```sh
npm run dev
```

The site will be available at `http://localhost:4321`

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

3. **Create a `.env` file** in the project root:
   ```env
   PUBLIC_YOUTUBE_API_KEY=your_api_key_here
   PUBLIC_YOUTUBE_CHANNEL_ID=your_channel_id_here
   ```

4. **Restart the dev server** after adding the `.env` file

The `/live` page will automatically:
- Show a live stream if one is currently active
- Display recent videos if no live stream is available

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

## 🚀 Deployment to GoDaddy

This project is set up with GitHub Actions to automatically build and deploy to GoDaddy when you push to the `main` branch.

### Setup Instructions

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

### Manual Deployment

If you prefer to deploy manually:

```sh
npm run build
# Then upload the contents of the dist/ folder to your GoDaddy hosting
```

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com)
