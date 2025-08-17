**web**

**web/index.html**

<!DOCTYPE html>
<!-- Tell the browser this is an HTML5 document -->

<html lang="en">
<!-- Root HTML element; set language to English -->

  <head>
    <!-- Metadata and resources for the page -->

    <meta charset="UTF-8" />
    <!-- Set character encoding to UTF-8 -->

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Make the page responsive on mobile devices -->

    <title>LearnLite</title>
    <!-- Page title shown in browser tab -->

    <link rel="manifest" href="/manifest.webmanifest" />
    <!-- Link to PWA manifest (app info for offline/installable app) -->

    <meta name="theme-color" content="#2563eb" />
    <!-- Set browser toolbar color on supported devices -->
  </head>

  <body class="bg-gray-50 text-gray-900">
    <!-- Body of page; Tailwind classes: light gray background, dark text -->

    <div id="root"></div>
    <!-- React will render the app into this div -->

    <script type="module" src="/src/main.tsx"></script>
    <!-- Load main React/TypeScript entry point as a module -->
  </body>

</html>



**web/package.json**

{
  "name": "learnlite-web",          // project name (frontend)
  "version": "1.0.0",               // project version
  "private": true,                  // prevents accidental publishing to npm
  "type": "module",                 // use modern ES module syntax (import/export)

  "scripts": {                      // shortcut commands you can run with npm
    "dev": "vite",                  // start development server
    "build": "vite build",          // build production-ready files
    "preview": "vite preview",      // preview the production build locally
    "lint": "eslint src --ext ts,tsx" // check code style and errors for TS/TSX files
  },

  "dependencies": {                 // packages needed to run the app in browser
    "i18next": "^23.10.1",          // main library for internationalization (multilingual)
    "react": "^18.3.1",             // React library for UI components
    "react-dom": "^18.3.1",         // React library for rendering to the browser
    "react-i18next": "^13.5.0",     // React integration for i18next (translations)
    "react-router-dom": "^6.26.1"   // routing/navigation for React apps
  },

  "devDependencies": {               // packages only needed during development
    "@types/react": "^18.3.5",      // TypeScript types for React
    "@types/react-dom": "^18.3.2",  // TypeScript types for React DOM
    "@vitejs/plugin-react": "^4.3.1", // Vite plugin to support React JSX/TSX
    "autoprefixer": "^10.4.20",     // automatically add CSS vendor prefixes for browser support
    "eslint": "^9.10.0",            // code linter to catch errors and enforce style
    "eslint-plugin-react": "^7.35.0", // plugin for ESLint to check React-specific rules
    "postcss": "^8.4.41",           // process CSS with plugins (like Tailwind)
    "tailwindcss": "^3.4.10",       // utility-first CSS framework for styling
    "typescript": "^5.6.2",         // TypeScript compiler
    "vite": "^5.4.8"                // Vite build tool for frontend dev + build
  }
}


**web/postcss.config.cjs**

module.exports = {
  plugins: {
    tailwindcss: {},    // use Tailwind CSS to process your styles
    autoprefixer: {}    // automatically add vendor prefixes for better browser support
  }
}


**web/tailwind.config.cjs**

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],  
  // Tell Tailwind which files to scan for class names (HTML, JS, TS, React files)

  theme: {
    extend: {}  
    // Extend or customize the default Tailwind theme (colors, spacing, etc.); empty means no changes
  },

  plugins: []  
  // Add Tailwind plugins here (like forms, typography); empty array = no extra plugins
}


**web/tsconfig.json**

{
  "compilerOptions": {
    "target": "ESNext",                     // output modern JavaScript (latest features)
    "useDefineForClassFields": true,       // use proper JavaScript class field behavior
    "lib": ["DOM", "DOM.Iterable", "ESNext"], // include browser APIs + latest JS features
    "allowJs": false,                       // do NOT allow regular JS files (only TS)
    "skipLibCheck": true,                   // skip checking types of library files (faster compile)
    "esModuleInterop": false,               // do not auto-convert CommonJS imports (use native ES modules)
    "allowSyntheticDefaultImports": true,  // allow default import even if module has no default export
    "strict": true,                         // enable strict type checking (catch more errors)
    "forceConsistentCasingInFileNames": true, // ensure import paths match file casing
    "module": "ESNext",                     // use modern ES module system (import/export)
    "moduleResolution": "Node",             // find modules the same way Node.js does
    "resolveJsonModule": true,              // allow importing JSON files directly
    "isolatedModules": true,                // each file can be compiled independently
    "noEmit": true,                          // don’t output compiled JS (for tools like Vite)
    "jsx": "react-jsx"                      // compile JSX using React 17+ JSX transform
  },
  "include": ["src"]                         // only compile files inside the src folder
}


**web/vite.config.ts**

import { defineConfig } from 'vite'  
// Import Vite helper to define configuration

import react from '@vitejs/plugin-react'  
// Import React plugin so Vite can handle JSX/TSX files

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],  
  // Tell Vite to use the React plugin for compiling React components

  server: {
    port: 5173  
    // Set the dev server to run on port 5173 (you can open localhost:5173)
  }
})


**web/public**

**web/public/manifest.webmanifest**

{
  "name": "LearnLite",                 // Full name of the app
  "short_name": "LearnLite",           // Short name used on home screen or icons
  "start_url": "/",                     // URL the app opens to when launched
  "display": "standalone",             // Makes app look like a native app (no browser UI)
  "background_color": "#ffffff",       // Background color shown while app is loading
  "theme_color": "#2563eb",            // Theme color for the browser toolbar or status bar
  "icons": [                           // App icons in different sizes
    {
      "src": "/icon-192.png",          // Path to 192x192 icon
      "sizes": "192x192",              // Icon size
      "type": "image/png"              // Icon file type
    },
    {
      "src": "/icon-512.png",          // Path to 512x512 icon (for high-res screens)
      "sizes": "512x512",              // Icon size
      "type": "image/png"              // Icon file type
    }
  ]
}


**web/public/sw.js**

// Listen for the 'install' event when the service worker is installed
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("learnlite-cache-v1").then((cache) => {
      // Open a cache named "learnlite-cache-v1" and add these files to it
      return cache.addAll([
        "/",                   // cache the root page
        "/index.html",         // cache the main HTML file
        "/manifest.webmanifest"// cache the web app manifest
      ]);
    })
  );
});

// Listen for all network requests (fetch events)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // If the request is in cache, return it
      return (
        cached ||
        fetch(event.request).catch(() =>
          // If not in cache and network fails, return a simple offline message
          new Response("You are offline", { status: 503 })
        )
      );
    })
  );
});



