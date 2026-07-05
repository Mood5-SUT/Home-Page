# Nexus Desktop – Final Documentation

**Version:** 2.0  
**Date:** July 2026  
**Author:** Nexus Team  

---

## 1. Overview

**Nexus Desktop** is a modern, futuristic browser-based homepage / application launcher. It replaces the default new tab page with a visually immersive dashboard that organizes your most-used web apps, AI tools, development resources, and entertainment links into an interactive, dock‑centric interface.

The design philosophy combines **glass‑morphism aesthetics**, **keyboard‑first navigation**, and **responsive layouts** to deliver a fast, pleasant, and highly customizable start page for any device.

---

## 2. Key Features

| Feature | Description |
|---------|-------------|
| **Live Clock** | Real‑time digital clock with 12/24 hour toggle and seconds option |
| **Dual Search System** | • **Web Search** – Google/DuckDuckGo/Bing/Brave search<br>• **Local App Filter** – instantly filter and launch apps from all folders |
| **Folder‑Based App Launcher** | Apps are grouped into logical folders (SUT, AI Cognition, Development, Project I, Media & Utilities, Cyber Labs, Entertainment). Each folder displays a grid of app icons with live favicons. |
| **Persistent Dock** | A fixed bottom bar holding your most frequently used apps for one‑click access |
| **Modal Overlays** | Clicking a folder opens a smooth, blurred modal window showing all apps inside that category |
| **Add/Remove Websites** | Each folder has "+ Add Website" button to add new apps, and hover-based ✕ button to remove them |
| **Settings Panel** | Full configuration panel with tabs for managing categories, favorites, date/time format, themes, background, and search engine preferences |
| **Import/Export CSV** | Backup and restore all your data (apps, dock items, settings) via CSV files |
| **Keyboard Shortcuts** | • `/` or `Ctrl+K` – focus local app search<br>• `Esc` – close any open modal |
| **Theme & Background Separation** | Themes and backgrounds work independently – changing theme doesn't affect custom background |
| **Fully Responsive** | Adapts gracefully to desktops, tablets, and mobile screens |
| **Favicon Automation** | Automatically fetches and displays favicons for every app using Google’s favicon service |

---

## 3. Technology Stack

| Layer | Technology |
|-------|------------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (custom, no frameworks) – uses CSS variables, flexbox, grid, backdrop‑filter, and animations |
| **Fonts** | Google Fonts – *Inter* (300, 400, 500, 600, 700 weights) |
| **Icons** | Font Awesome 6 (free) – used sparingly, mostly SVG inline |
| **JavaScript** | Vanilla JS (ES6) – no external libraries |
| **Persistence** | localStorage for all settings, apps, and preferences |
| **Hosting** | Any static web host (GitHub Pages, Netlify, Vercel, etc.) |

---

## 4. Architecture & Structure

### 4.1 File Structure

```
nexus-desktop/
├── index.html          # Main HTML file
├── style.css           # All styles
├── script.js           # All JavaScript
└── README.md           # Project documentation
```

### 4.2 Layout Hierarchy

```
<body>
├── .top-section
│   ├── .clock-widget
│   │   ├── .time-display
│   │   └── .date-display
│   ├── .search-system
│   │   ├── #web-search  (Google search)
│   │   └── #app-search  (local filter)
│   └── .top-spacer
├── #workspace
│   └── .large-folder (×7)
│       ├── .folder-box (3×3 grid of favicon previews)
│       └── .folder-label
├── #search-results (dynamic grid for local search)
├── .dock (fixed bottom toolbar)
│   ├── .dock-item (×4)
│   └── .dock-divider
├── .settings-btn (fixed gear icon)
└── #modal-container
    ├── #modal-settings (settings panel)
    └── .overlay (×8 folder modals)
        └── .folder-window
            ├── .window-title
            ├── .folder-grid
            │   └── .app-item (×N)
            │       ├── .app-icon
            │       │   └── img[data-domain]
            │       ├── .app-title
            │       └── .remove-app-btn (hover only)
            └── .add-website-btn
```

---

## 5. Data Persistence

### 5.1 localStorage Keys

| Key | Description |
|-----|-------------|
| `nexusSettings` | All user settings (theme, background, search engine, time format, hidden dock items) |
| `nexusCategoryApps` | All custom apps added to folders |
| `nexusCustomBg` | Custom background image URL |

### 5.2 Settings Object Structure

```json
{
  "showSeconds": false,
  "use24Hour": true,
  "theme": "dark",
  "backgroundType": "gradient",
  "customBackgroundUrl": "",
  "searchEngine": "google",
  "hiddenDockItems": ["YouTube", "Translate"]
}
```

### 5.3 Category Apps Object Structure

```json
{
  "modal-ai": [
    { "appName": "ChatGPT", "url": "https://chatgpt.com/", "domain": "chatgpt.com" }
  ]
}
```

---

## 6. Features Guide

### 6.1 Adding Websites to Categories

1. Click any folder to open it
2. Scroll to the bottom
3. Click the **"+ Add Website"** button
4. Enter the app name and URL
5. The website appears in the folder and the folder preview updates automatically

### 6.2 Removing Websites from Categories

1. Open any folder
2. Hover over any app icon
3. Click the **✕** button that appears in the top-right corner
4. Confirm the removal
5. The app is removed and the folder preview updates

### 6.3 Setting a Custom Background

1. Click the Settings button (gear icon)
2. Go to the **Background** tab
3. Click **"Set URL"**
4. Enter an image URL (e.g., `https://example.com/background.jpg`)
5. The background updates immediately and persists after refresh

### 6.4 Changing Theme

1. Click the Settings button (gear icon)
2. Go to the **Themes** tab
3. Click **Apply** on any theme (Dark, Light, Neon Cyber)
4. The theme changes without affecting your background

### 6.5 Import/Export CSV

1. Click the Settings button (gear icon)
2. Go to the **Search** tab
3. Click **"📤 Export CSV"** to backup all data
4. Click **"📥 Import CSV"** to restore data from a backup

---

## 7. Customization Guide

### 7.1 Adding a New Folder

1. In `index.html`, add a new `<button class="large-folder">` in `#workspace`
2. Add a corresponding modal in `#modal-container`
3. The folder will appear with "Add Website" functionality automatically

### 7.2 Modifying the Dock

Edit the `<nav class="dock">` section in `index.html` – add or remove `.dock-item` elements.

### 7.3 Changing Colors & Sizes

All design tokens are defined in the `:root` CSS block. Adjust these variables:

```css
:root {
  --bg-color: #0b1016;
  --accent: #58a6ff;
  --text-main: #f0f6fc;
  --radius-lg: 28px;
}
```

### 7.4 Adding a New Theme

Add a new theme object in `applyThemeOnly()` function in `script.js`:

```javascript
newtheme: {
  '--bg-color': '#your-color',
  '--text-main': '#your-color',
  // ... all CSS variables
}
```

---

## 8. Performance Considerations

- **Favicon requests** – Each domain triggers a request to Google's favicon service. Consider self‑hosting icons for production.
- **Backdrop‑filter** – Uses GPU acceleration; consider a fallback for low‑end devices.
- **Search filtering** – Iterates over all `.local-app` elements on each keystroke. Instant for ~100 apps.

---

## 9. Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Opera | 76+ | ✅ Full |

---

## 10. License

MIT License – free for personal and commercial use, with attribution appreciated.

---

## 11. Credits

- **Favicons:** Google’s `s2/favicons` service
- **Fonts:** Inter by Rasmus Andersson via Google Fonts
- **Icons:** Font Awesome (free version)
- **Inspiration:** Modern OS launchers, macOS Dock, and Chrome OS app drawer

---

## 12. Support & Contact

For questions, feature requests, or bug reports, please open an issue on the project repository.

---

*Documentation generated July 2026*
