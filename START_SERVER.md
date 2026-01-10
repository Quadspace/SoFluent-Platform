# How to Start the Development Server

## Quick Start

1. Open a terminal in the `client` folder
2. Run: `npm run dev`
3. Open your browser to the URL shown (usually `http://localhost:5173` or similar)

## Access Your Website

The development server should be running. Check your terminal for the exact port number.

**Common URLs:**
- `http://localhost:5173`
- `http://localhost:5174`
- `http://localhost:5175`
- `http://localhost:5176`

## Pages Available

- **Homepage:** `http://localhost:XXXX/`
- **Fluency Fit Academy:** `http://localhost:XXXX/fluency-fit`
- **Courses:** `http://localhost:XXXX/course-list`
- **About:** `http://localhost:XXXX/about`
- **Contact:** `http://localhost:XXXX/contact`

## Troubleshooting

If you see a blank page:
1. Check the browser console for errors (F12)
2. Make sure the server is running
3. Try refreshing the page
4. Check that all dependencies are installed: `npm install`

## Note

The app will show a warning about Clerk API key - this is normal for development. The page should still load and work.
