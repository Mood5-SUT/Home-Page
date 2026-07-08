(function() {
    'use strict';

    /* ============================
       1. CLOCK
    ============================ */
    const clockTime = document.getElementById('clock-time');
    const clockDate = document.getElementById('clock-date');
    let showSeconds = false;
    let use24Hour = true;

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = '';

        if (!use24Hour) {
            ampm = hours >= 12 ? ' PM' : ' AM';
            hours = hours % 12 || 12;
        }

        const timeStr = (use24Hour ? 
            String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') :
            hours + ':' + String(minutes).padStart(2, '0')) +
            (showSeconds ? ':' + String(seconds).padStart(2, '0') : '') +
            (!use24Hour ? ampm : '');

        clockTime.textContent = timeStr;
        clockDate.textContent = now.toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
    updateClock();
    setInterval(updateClock, 1000);

    /* ============================
       2. FAVICON INJECTION
    ============================ */
    function injectFavicons() {
        document.querySelectorAll('img[data-domain]').forEach(img => {
            const domain = img.getAttribute('data-domain');
            if (domain && !img.src) {
                img.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
                img.setAttribute('loading', 'lazy');
                img.setAttribute('alt', '');
            }
        });
    }
    injectFavicons();

    /* ============================
       3. MODAL LOGIC
    ============================ */
    window.openModal = function(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
        setTimeout(() => {
            addAddWebsiteButtons();
            addRemoveButtonsToApps();
        }, 100);
    };

    window.closeModal = function(e) {
        if (e && e.target && e.target.classList && e.target.classList.contains('overlay')) {
            e.target.classList.remove('active');
        }
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.overlay.active').forEach(f => f.classList.remove('active'));
        }
    });

    /* ============================
       4. SETTINGS TAB SWITCHING
    ============================ */
    const settingContents = {
        cat: 'set-cat',
        fav: 'set-fav',
        time: 'set-time',
        theme: 'set-theme',
        bg: 'set-bg',
        search: 'set-search'
    };

    window.switchSetting = function(tabId, btn) {
        document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');

        Object.values(settingContents).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        const target = document.getElementById(settingContents[tabId]);
        if (target) target.classList.remove('hidden');
    };

    /* ============================
       5. WEB SEARCH
    ============================ */
    const webSearch = document.getElementById('web-search');
    let currentSearchEngine = 'google';

    webSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const q = this.value.trim();
            if (q) {
                const searchUrls = {
                    google: 'https://www.google.com/search?q=',
                    duckduckgo: 'https://duckduckgo.com/?q=',
                    bing: 'https://www.bing.com/search?q=',
                    brave: 'https://search.brave.com/search?q='
                };
                const url = (searchUrls[currentSearchEngine] || searchUrls.google) + encodeURIComponent(q);
                window.location.href = url;
            }
        }
    });

    /* ============================
       6. LOCAL APP FILTER
    ============================ */
    const appSearch = document.getElementById('app-search');
    const workspace = document.getElementById('workspace');
    const resultsContainer = document.getElementById('search-results');
    let allApps = document.querySelectorAll('.local-app');

    function updateAllApps() {
        allApps = document.querySelectorAll('.local-app');
    }

    appSearch.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';
        updateAllApps();

        if (!query) {
            workspace.style.display = 'grid';
            resultsContainer.style.display = 'none';
            return;
        }

        workspace.style.display = 'none';
        resultsContainer.style.display = 'grid';

        document.querySelectorAll('.overlay.active').forEach(f => f.classList.remove('active'));

        let found = false;
        allApps.forEach(app => {
            const label = app.querySelector('.app-title');
            if (label && label.textContent.toLowerCase().includes(query)) {
                const clone = app.cloneNode(true);
                clone.classList.remove('local-app');
                resultsContainer.appendChild(clone);
                found = true;
            }
        });

        if (found) {
            const first = resultsContainer.querySelector('.app-item');
            if (first) first.classList.add('selected');
        }
    });

    appSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const selected = resultsContainer.querySelector('.app-item.selected');
            if (selected && selected.href) {
                window.location.href = selected.href;
            }
        }
    });

    /* ============================
       7. KEYBOARD SHORTCUTS
    ============================ */
    document.addEventListener('keydown', function(e) {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
            e.preventDefault();
            appSearch.focus();
            appSearch.select();
        }
    });

    /* ============================
       8. ADD "ADD WEBSITE" BUTTON TO ALL FOLDERS
    ============================ */
    function addAddWebsiteButtons() {
        document.querySelectorAll('.folder-window').forEach(window => {
            if (window.querySelector('.add-website-btn')) return;
            
            const modal = window.closest('.overlay');
            if (!modal) return;
            
            const modalId = modal.id;
            
            const addBtn = document.createElement('button');
            addBtn.className = 'add-website-btn';
            addBtn.textContent = '+ Add Website';
            addBtn.style.cssText = `
                display: block;
                margin: 20px auto 10px;
                padding: 10px 24px;
                background: rgba(88, 166, 255, 0.15);
                border: 1px dashed rgba(88, 166, 255, 0.3);
                border-radius: 12px;
                color: var(--text-main);
                cursor: pointer;
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                width: fit-content;
            `;
            
            addBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(88, 166, 255, 0.25)';
                this.style.borderColor = 'rgba(88, 166, 255, 0.5)';
            });
            
            addBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(88, 166, 255, 0.15)';
                this.style.borderColor = 'rgba(88, 166, 255, 0.3)';
            });
            
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                addWebsiteToCategory(modalId);
            });
            
            window.appendChild(addBtn);
        });
    }

    /* ============================
       9. ADD REMOVE BUTTONS TO APPS
    ============================ */
    function addRemoveButtonsToApps() {
        document.querySelectorAll('.folder-window').forEach(window => {
            const modal = window.closest('.overlay');
            if (!modal) return;
            
            const appItems = window.querySelectorAll('.app-item');
            appItems.forEach(item => {
                if (item.querySelector('.remove-app-btn')) return;
                
                const title = item.querySelector('.app-title');
                if (title && title.textContent === 'Example') return;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-app-btn';
                removeBtn.textContent = '✕';
                removeBtn.style.cssText = `
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255, 50, 50, 0.8);
                    border: none;
                    color: white;
                    font-size: 12px;
                    cursor: pointer;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    padding: 0;
                    line-height: 1;
                    z-index: 10;
                `;
                
                removeBtn.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(255, 0, 0, 1)';
                    this.style.transform = 'scale(1.1)';
                });
                
                removeBtn.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(255, 50, 50, 0.8)';
                    this.style.transform = 'scale(1)';
                });
                
                item.style.position = 'relative';
                item.addEventListener('mouseenter', function() {
                    const btn = this.querySelector('.remove-app-btn');
                    if (btn) btn.style.display = 'flex';
                });
                
                item.addEventListener('mouseleave', function() {
                    const btn = this.querySelector('.remove-app-btn');
                    if (btn) btn.style.display = 'none';
                });
                
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    const appItem = this.closest('.app-item');
                    const appName = appItem.querySelector('.app-title')?.textContent || 'Untitled';
                    const modalId = appItem.closest('.overlay')?.id || '';
                    
                    if (confirm(`Remove "${appName}" from this category?`)) {
                        removeAppFromCategory(appItem, modalId);
                    }
                });
                
                item.appendChild(removeBtn);
            });
        });
    }

    /* ============================
       10. REMOVE APP FROM CATEGORY
    ============================ */
    function removeAppFromCategory(appItem, categoryId) {
        const appName = appItem.querySelector('.app-title')?.textContent || '';
        const modal = document.getElementById(categoryId);
        if (!modal) return;
        
        appItem.remove();
        
        const saved = localStorage.getItem('nexusCategoryApps');
        if (saved) {
            try {
                const categoryData = JSON.parse(saved);
                if (categoryData[categoryId]) {
                    categoryData[categoryId] = categoryData[categoryId].filter(app => app.appName !== appName);
                    if (categoryData[categoryId].length === 0) {
                        delete categoryData[categoryId];
                    }
                    localStorage.setItem('nexusCategoryApps', JSON.stringify(categoryData));
                }
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
            }
        }
        
        updateFolderPreview(modal);
        updateAllApps();
        addRemoveButtonsToApps();
        
        alert(`✅ "${appName}" removed successfully!`);
    }

    /* ============================
       11. UPDATE FOLDER PREVIEW
    ============================ */
    function updateFolderPreview(modal) {
        const categoryName = modal.querySelector('.window-title')?.textContent?.replace(/[📁🎓🧠💻🚀🛠🛡🎬⭐]/g, '').trim() || '';
        const folderBoxes = document.querySelectorAll('.folder-box');
        
        folderBoxes.forEach(box => {
            const parent = box.closest('.large-folder');
            if (parent) {
                const label = parent.querySelector('.folder-label');
                if (label && label.textContent === categoryName) {
                    const apps = modal.querySelectorAll('.app-item');
                    const domains = [];
                    
                    apps.forEach(app => {
                        const img = app.querySelector('img[data-domain]');
                        if (img) {
                            const domain = img.getAttribute('data-domain');
                            if (domain) domains.push(domain);
                        }
                    });
                    
                    const currentIcons = box.querySelectorAll('img');
                    currentIcons.forEach(img => img.remove());
                    
                    const maxIcons = Math.min(domains.length, 9);
                    for (let i = 0; i < maxIcons; i++) {
                        const newImg = document.createElement('img');
                        newImg.setAttribute('data-domain', domains[i]);
                        newImg.src = 'https://www.google.com/s2/favicons?domain=' + domains[i] + '&sz=64';
                        newImg.setAttribute('loading', 'lazy');
                        newImg.setAttribute('alt', '');
                        box.appendChild(newImg);
                    }
                    
                    if (domains.length === 0) {
                        const placeholderDomains = ['github.com', 'google.com', 'youtube.com'];
                        placeholderDomains.forEach(domain => {
                            const newImg = document.createElement('img');
                            newImg.setAttribute('data-domain', domain);
                            newImg.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
                            newImg.setAttribute('loading', 'lazy');
                            newImg.setAttribute('alt', '');
                            box.appendChild(newImg);
                        });
                    }
                }
            }
        });
    }

    /* ============================
       12. ADD WEBSITE TO CATEGORY
    ============================ */
    function addWebsiteToCategory(categoryId) {
        const appName = prompt('Enter the app name:');
        if (!appName || !appName.trim()) return;
        
        const url = prompt('Enter the URL (e.g., https://example.com):');
        if (!url || !url.trim()) return;
        
        try {
            const domain = new URL(url).hostname;
            
            const modal = document.getElementById(categoryId);
            if (!modal) {
                alert('Category not found!');
                return;
            }
            
            const folderGrid = modal.querySelector('.folder-grid');
            if (!folderGrid) {
                alert('Folder grid not found!');
                return;
            }
            
            const appItem = document.createElement('a');
            appItem.href = url;
            appItem.className = 'app-item local-app';
            appItem.style.position = 'relative';
            appItem.innerHTML = `
                <span class="app-icon"><img data-domain="${domain}" alt="" /></span>
                <span class="app-title">${appName}</span>
            `;
            folderGrid.appendChild(appItem);
            
            const img = appItem.querySelector('img');
            if (img) {
                img.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
            }
            
            updateFolderPreview(modal);
            updateAllApps();
            saveCategoryData(categoryId, appName, url, domain);
            addRemoveButtonsToApps();
            
            alert(`✅ "${appName}" added successfully!`);
            
        } catch (e) {
            alert('Invalid URL. Please enter a valid URL (e.g., https://example.com)');
        }
    }

    function saveCategoryData(categoryId, appName, url, domain) {
        const saved = localStorage.getItem('nexusCategoryApps');
        let categoryData = saved ? JSON.parse(saved) : {};
        
        if (!categoryData[categoryId]) {
            categoryData[categoryId] = [];
        }
        
        const exists = categoryData[categoryId].some(app => app.appName === appName);
        if (!exists) {
            categoryData[categoryId].push({ appName, url, domain });
            localStorage.setItem('nexusCategoryApps', JSON.stringify(categoryData));
        }
    }

    function loadCategoryApps() {
        const saved = localStorage.getItem('nexusCategoryApps');
        if (!saved) return;
        
        try {
            const categoryData = JSON.parse(saved);
            Object.keys(categoryData).forEach(categoryId => {
                const modal = document.getElementById(categoryId);
                if (!modal) return;
                
                const folderGrid = modal.querySelector('.folder-grid');
                if (!folderGrid) return;
                
                categoryData[categoryId].forEach(item => {
                    const existing = folderGrid.querySelectorAll('.app-title');
                    let exists = false;
                    existing.forEach(el => {
                        if (el.textContent === item.appName) {
                            exists = true;
                        }
                    });
                    
                    if (!exists) {
                        const appItem = document.createElement('a');
                        appItem.href = item.url;
                        appItem.className = 'app-item local-app';
                        appItem.style.position = 'relative';
                        appItem.innerHTML = `
                            <span class="app-icon"><img data-domain="${item.domain}" alt="" /></span>
                            <span class="app-title">${item.appName}</span>
                        `;
                        folderGrid.appendChild(appItem);
                    }
                });
                
                updateFolderPreview(modal);
            });
            
            injectFavicons();
            updateAllApps();
        } catch (e) {
            console.warn('Failed to load category apps:', e);
        }
    }

    /* ============================
       13. SETTINGS FUNCTIONALITY - WITH LOCAL WALLPAPER SUPPORT
    ============================ */

    // Store background state globally
    let currentBackground = {
        type: 'gradient', // 'gradient', 'dark', 'darkblue', 'purple', 'custom'
        url: ''
    };

    function loadSettings() {
        const saved = localStorage.getItem('nexusSettings');
        
        // Check for locally stored wallpaper
        const localWallpaper = localStorage.getItem('nexusCustomBgDataUrl');
        const localWallpaperType = localStorage.getItem('nexusCustomBgType');
        
        if (localWallpaper && localWallpaperType === 'local') {
            currentBackground.type = 'custom';
            currentBackground.url = localWallpaper;
        }
        
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                showSeconds = settings.showSeconds || false;
                use24Hour = settings.use24Hour !== undefined ? settings.use24Hour : true;
                currentSearchEngine = settings.searchEngine || 'google';
                
                // Load theme first
                if (settings.theme) {
                    applyThemeOnly(settings.theme);
                }
                
                // Load background state (but don't override local wallpaper if present)
                if (settings.backgroundType && !localWallpaper) {
                    currentBackground.type = settings.backgroundType;
                    currentBackground.url = settings.customBackgroundUrl || '';
                    applyBackgroundOnly();
                } else if (localWallpaper) {
                    // Apply local wallpaper
                    applyBackgroundOnly();
                } else {
                    // Default background
                    currentBackground.type = 'gradient';
                    currentBackground.url = '';
                    applyBackgroundOnly();
                }
                
                applySearchEngine(currentSearchEngine);
                updateClock();
                updateSettingUI();
                
                if (settings.hiddenDockItems) {
                    settings.hiddenDockItems.forEach(item => {
                        const dockItems = document.querySelectorAll('.dock-item');
                        dockItems.forEach(dockItem => {
                            const label = dockItem.querySelector('.dock-label');
                            if (label && label.textContent === item) {
                                dockItem.style.display = 'none';
                            }
                        });
                    });
                }
            } catch (e) {
                console.warn('Failed to load settings:', e);
                if (!localWallpaper) {
                    applyBackgroundOnly();
                }
            }
        } else if (!localWallpaper) {
            // Default settings
            currentBackground.type = 'gradient';
            currentBackground.url = '';
            applyBackgroundOnly();
        }
    }

    function saveSettings() {
        const settings = {
            showSeconds: showSeconds,
            use24Hour: use24Hour,
            theme: document.querySelector('.setting-control.primary[data-theme]')?.getAttribute('data-theme') || 'dark',
            backgroundType: currentBackground.type,
            customBackgroundUrl: currentBackground.type === 'custom' && !currentBackground.url.startsWith('data:') ? currentBackground.url : '',
            searchEngine: currentSearchEngine,
            hiddenDockItems: getHiddenDockItems()
        };
        localStorage.setItem('nexusSettings', JSON.stringify(settings));
        
        // Save custom background URL separately for easy access (only for URL-based, not data URLs)
        if (currentBackground.type === 'custom' && currentBackground.url && !currentBackground.url.startsWith('data:')) {
            localStorage.setItem('nexusCustomBg', currentBackground.url);
        }
        // Data URLs are already saved in nexusCustomBgDataUrl
    }

    function getHiddenDockItems() {
        const hidden = [];
        document.querySelectorAll('.dock-item').forEach(item => {
            if (item.style.display === 'none') {
                const label = item.querySelector('.dock-label');
                if (label) hidden.push(label.textContent);
            }
        });
        return hidden;
    }

    // Apply theme ONLY - no background changes
    function applyThemeOnly(theme) {
        const root = document.documentElement;
        const themes = {
            dark: {
                '--bg-color': '#0b1016',
                '--text-main': '#f0f6fc',
                '--text-dim': '#8b949e',
                '--panel-bg': 'rgba(22, 27, 34, 0.55)',
                '--folder-bg': 'rgba(255, 255, 255, 0.05)',
                '--hover-bg': 'rgba(255, 255, 255, 0.10)',
                '--glass-border': 'rgba(255, 255, 255, 0.07)',
                '--dock-bg': 'rgba(13, 17, 23, 0.75)',
                '--accent': '#58a6ff',
                '--accent-glow': 'rgba(88, 166, 255, 0.25)'
            },
            light: {
                '--bg-color': '#f0f4f8',
                '--text-main': '#1a2332',
                '--text-dim': '#4a5568',
                '--panel-bg': 'rgba(255, 255, 255, 0.7)',
                '--folder-bg': 'rgba(0, 0, 0, 0.04)',
                '--hover-bg': 'rgba(0, 0, 0, 0.06)',
                '--glass-border': 'rgba(0, 0, 0, 0.08)',
                '--dock-bg': 'rgba(255, 255, 255, 0.85)',
                '--accent': '#2563eb',
                '--accent-glow': 'rgba(37, 99, 235, 0.25)'
            },
            neon: {
                '--bg-color': '#0a0a12',
                '--text-main': '#00ffcc',
                '--text-dim': '#00cc99',
                '--accent': '#ff00ff',
                '--accent-glow': 'rgba(255, 0, 255, 0.25)',
                '--panel-bg': 'rgba(0, 0, 0, 0.7)',
                '--folder-bg': 'rgba(0, 255, 204, 0.05)',
                '--hover-bg': 'rgba(0, 255, 204, 0.10)',
                '--glass-border': 'rgba(0, 255, 204, 0.15)',
                '--dock-bg': 'rgba(0, 0, 0, 0.85)'
            }
        };

        const themeVars = themes[theme] || themes.dark;
        Object.keys(themeVars).forEach(key => {
            root.style.setProperty(key, themeVars[key]);
        });

        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.classList.toggle('primary', btn.getAttribute('data-theme') === theme);
        });
    }

    // Apply background ONLY - no theme changes
    function applyBackgroundOnly() {
        const body = document.body;
        
        if (currentBackground.type === 'custom' && currentBackground.url) {
            // Custom image (either URL or data URL from local upload)
            body.style.backgroundImage = `url('${currentBackground.url}')`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundRepeat = 'no-repeat';
            body.style.backgroundColor = 'transparent';
            body.style.backgroundAttachment = 'fixed';
            
            document.querySelectorAll('[data-bg]').forEach(btn => {
                btn.classList.toggle('primary', btn.getAttribute('data-bg') === 'custom');
            });
        } else {
            // Predefined backgrounds
            const backgrounds = {
                gradient: 'radial-gradient(circle at 10% 20%, rgba(88, 166, 255, 0.06) 0%, transparent 45%), radial-gradient(circle at 90% 75%, rgba(46, 160, 67, 0.05) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(88, 166, 255, 0.02) 0%, transparent 70%)',
                dark: '#0b1016',
                darkblue: '#0a0e1a',
                purple: '#0d0a1a'
            };
            
            if (backgrounds[currentBackground.type]) {
                body.style.background = backgrounds[currentBackground.type];
                body.style.backgroundColor = backgrounds[currentBackground.type];
                body.style.backgroundSize = 'auto';
                body.style.backgroundPosition = 'auto';
                body.style.backgroundRepeat = '';
                body.style.backgroundAttachment = '';
            } else {
                // Fallback to gradient
                body.style.background = backgrounds.gradient;
                body.style.backgroundColor = 'transparent';
            }
            
            document.querySelectorAll('[data-bg]').forEach(btn => {
                btn.classList.toggle('primary', btn.getAttribute('data-bg') === currentBackground.type);
            });
        }
    }

    // Combined function for theme change
    function applyTheme(theme) {
        applyThemeOnly(theme);
        // Re-apply background to ensure it stays
        applyBackgroundOnly();
        saveSettings();
    }

    // Combined function for background change
    function applyBackground(bg) {
        if (bg && bg.startsWith('data:image')) {
            // This is a data URL from local upload
            currentBackground.type = 'custom';
            currentBackground.url = bg;
            localStorage.setItem('nexusCustomBgDataUrl', bg);
            localStorage.setItem('nexusCustomBgType', 'local');
        } else if (bg && bg.startsWith('http')) {
            currentBackground.type = 'custom';
            currentBackground.url = bg;
            localStorage.removeItem('nexusCustomBgDataUrl');
            localStorage.removeItem('nexusCustomBgType');
        } else {
            currentBackground.type = bg;
            currentBackground.url = '';
            localStorage.removeItem('nexusCustomBgDataUrl');
            localStorage.removeItem('nexusCustomBgType');
        }
        applyBackgroundOnly();
        saveSettings();
    }

    function applySearchEngine(engine) {
        currentSearchEngine = engine;
        const searchInput = document.getElementById('web-search');
        const placeholders = {
            google: 'Search the web (Google)…',
            duckduckgo: 'Search the web (DuckDuckGo)…',
            bing: 'Search the web (Bing)…',
            brave: 'Search the web (Brave)…'
        };
        searchInput.placeholder = placeholders[engine] || placeholders.google;

        document.querySelectorAll('[data-search]').forEach(btn => {
            btn.classList.toggle('primary', btn.getAttribute('data-search') === engine);
        });
    }

    function updateSettingUI() {
        document.querySelector('[data-time-format]')?.classList.toggle('primary', use24Hour);
        document.querySelector('[data-time-seconds]')?.classList.toggle('primary', showSeconds);
    }

    /* ============================
       14. LOCAL WALLPAPER UPLOAD HANDLER
    ============================ */
    function handleLocalWallpaperUpload() {
        const fileInput = document.getElementById('wallpaper-upload');
        const applyBtn = document.getElementById('apply-uploaded-bg');
        
        if (!fileInput || !applyBtn) return;
        
        // Preview when file is selected
        fileInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (file) {
                // Show file name
                const label = this.closest('.setting-row').querySelector('.setting-label');
                if (label) {
                    label.textContent = `Selected: ${file.name}`;
                }
            }
        });
        
        applyBtn.addEventListener('click', function() {
            const file = fileInput.files[0];
            if (!file) {
                alert('Please select an image file first.');
                return;
            }
            
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const imageDataUrl = event.target.result;
                
                // Save to localStorage
                localStorage.setItem('nexusCustomBgDataUrl', imageDataUrl);
                localStorage.setItem('nexusCustomBgType', 'local');
                
                // Apply the background
                currentBackground.type = 'custom';
                currentBackground.url = imageDataUrl;
                applyBackgroundOnly();
                saveSettings();
                
                // Update UI
                document.querySelectorAll('[data-bg]').forEach(btn => {
                    btn.classList.toggle('primary', btn.getAttribute('data-bg') === 'custom');
                });
                
                // Reset file input
                fileInput.value = '';
                const label = fileInput.closest('.setting-row').querySelector('.setting-label');
                if (label) {
                    label.textContent = 'Upload from Device';
                }
                
                alert('✅ Wallpaper applied successfully!');
            };
            
            reader.onerror = function() {
                alert('Error reading the file. Please try again.');
            };
            
            reader.readAsDataURL(file);
        });
    }

    /* ============================
       15. IMPORT/EXPORT AS CSV
    ============================ */
    
    function exportData() {
        try {
            const settings = JSON.parse(localStorage.getItem('nexusSettings') || '{}');
            const categoryApps = JSON.parse(localStorage.getItem('nexusCategoryApps') || '{}');
            
            let csvRows = [];
            csvRows.push('Type,Category,AppName,URL,Domain');
            
            Object.keys(categoryApps).forEach(categoryId => {
                const categoryName = getCategoryName(categoryId);
                categoryApps[categoryId].forEach(app => {
                    csvRows.push(`App,${categoryName},${app.appName},${app.url},${app.domain}`);
                });
            });
            
            const dockItems = document.querySelectorAll('.dock-item');
            dockItems.forEach(item => {
                if (item.style.display !== 'none') {
                    const label = item.querySelector('.dock-label')?.textContent || '';
                    const href = item.href || '';
                    const domain = href ? new URL(href).hostname : '';
                    if (label && href) {
                        csvRows.push(`Dock,Favorites,${label},${href},${domain}`);
                    }
                }
            });
            
            csvRows.push(`Settings,General,theme,${settings.theme || 'dark'},`);
            csvRows.push(`Settings,General,backgroundType,${settings.backgroundType || 'gradient'},`);
            if (settings.customBackgroundUrl) {
                csvRows.push(`Settings,General,customBackgroundUrl,${settings.customBackgroundUrl},`);
            }
            csvRows.push(`Settings,General,searchEngine,${settings.searchEngine || 'google'},`);
            csvRows.push(`Settings,Time,use24Hour,${settings.use24Hour || 'true'},`);
            csvRows.push(`Settings,Time,showSeconds,${settings.showSeconds || 'false'},`);
            
            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'nexus_backup_' + new Date().toISOString().slice(0,10) + '.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            alert('✅ Data exported successfully!');
        } catch (e) {
            alert('Error exporting data: ' + e.message);
            console.error(e);
        }
    }
    
    function getCategoryName(categoryId) {
        const modal = document.getElementById(categoryId);
        if (modal) {
            const title = modal.querySelector('.window-title');
            if (title) {
                return title.textContent.replace(/[📁🎓🧠💻🚀🛠🛡🎬⭐]/g, '').trim();
            }
        }
        return categoryId.replace('modal-', '').replace(/-/g, ' ');
    }
    
    function importData() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        fileInput.addEventListener('change', function(e) {
            const file = this.files[0];
            if (!file) {
                document.body.removeChild(fileInput);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const csvText = event.target.result;
                    const lines = csvText.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        alert('Invalid CSV file. File must contain at least a header row and one data row.');
                        document.body.removeChild(fileInput);
                        return;
                    }
                    
                    const rows = lines.map(line => {
                        const result = [];
                        let current = '';
                        let inQuotes = false;
                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                result.push(current.trim());
                                current = '';
                            } else {
                                current += char;
                            }
                        }
                        result.push(current.trim());
                        return result;
                    });
                    
                    const dataRows = rows.slice(1);
                    
                    if (!confirm(`This will import ${dataRows.length} items. Continue?`)) {
                        document.body.removeChild(fileInput);
                        return;
                    }
                    
                    let importedApps = 0;
                    let importedDock = 0;
                    let importedSettings = 0;
                    
                    const categoryData = {};
                    const dockData = [];
                    const settingsData = {};
                    
                    dataRows.forEach(row => {
                        const type = row[0] || '';
                        const category = row[1] || '';
                        const name = row[2] || '';
                        const url = row[3] || '';
                        const domain = row[4] || '';
                        
                        if (type === 'App') {
                            let categoryId = null;
                            document.querySelectorAll('.overlay').forEach(modal => {
                                const title = modal.querySelector('.window-title');
                                if (title && title.textContent.replace(/[📁🎓🧠💻🚀🛠🛡🎬⭐]/g, '').trim() === category) {
                                    categoryId = modal.id;
                                }
                            });
                            
                            if (categoryId) {
                                if (!categoryData[categoryId]) {
                                    categoryData[categoryId] = [];
                                }
                                categoryData[categoryId].push({ appName: name, url, domain });
                                importedApps++;
                            }
                        } else if (type === 'Dock') {
                            dockData.push({ name, url, domain });
                            importedDock++;
                        } else if (type === 'Settings') {
                            const settingType = row[1] || '';
                            const key = row[2] || '';
                            const value = row[3] || '';
                            if (!settingsData[settingType]) {
                                settingsData[settingType] = {};
                            }
                            settingsData[settingType][key] = value;
                            importedSettings++;
                        }
                    });
                    
                    Object.keys(categoryData).forEach(categoryId => {
                        const modal = document.getElementById(categoryId);
                        if (!modal) return;
                        
                        const folderGrid = modal.querySelector('.folder-grid');
                        if (!folderGrid) return;
                        
                        categoryData[categoryId].forEach(item => {
                            const existing = folderGrid.querySelectorAll('.app-title');
                            let exists = false;
                            existing.forEach(el => {
                                if (el.textContent === item.appName) {
                                    exists = true;
                                }
                            });
                            
                            if (!exists) {
                                const appItem = document.createElement('a');
                                appItem.href = item.url;
                                appItem.className = 'app-item local-app';
                                appItem.style.position = 'relative';
                                appItem.innerHTML = `
                                    <span class="app-icon"><img data-domain="${item.domain}" alt="" /></span>
                                    <span class="app-title">${item.appName}</span>
                                `;
                                folderGrid.appendChild(appItem);
                            }
                        });
                        
                        updateFolderPreview(modal);
                    });
                    
                    const dock = document.getElementById('app-dock');
                    const divider = dock.querySelector('.dock-divider');
                    
                    dockData.forEach(item => {
                        let exists = false;
                        dock.querySelectorAll('.dock-label').forEach(el => {
                            if (el.textContent === item.name) {
                                exists = true;
                            }
                        });
                        
                        if (!exists) {
                            const dockItem = document.createElement('a');
                            dockItem.href = item.url;
                            dockItem.className = 'dock-item';
                            dockItem.title = item.name;
                            dockItem.innerHTML = `
                                <span class="dock-icon"><img data-domain="${item.domain}" alt="" /></span>
                                <span class="dock-label">${item.name}</span>
                            `;
                            if (divider) {
                                dock.insertBefore(dockItem, divider);
                            } else {
                                dock.appendChild(dockItem);
                            }
                            
                            const favContent = document.getElementById('set-fav');
                            const row = document.createElement('div');
                            row.className = 'setting-row';
                            row.innerHTML = `
                                <span class="setting-label">${item.name}</span>
                                <button class="setting-control">Remove</button>
                            `;
                            const addBtn = favContent.querySelector('.setting-control.primary')?.closest('.setting-row');
                            if (addBtn) {
                                favContent.insertBefore(row, addBtn);
                            } else {
                                favContent.appendChild(row);
                            }
                            
                            row.querySelector('.setting-control').addEventListener('click', function() {
                                if (confirm(`Remove "${item.name}" from favorites?`)) {
                                    const dockItems = document.querySelectorAll('.dock-item');
                                    dockItems.forEach(dockItem => {
                                        const itemLabel = dockItem.querySelector('.dock-label');
                                        if (itemLabel && itemLabel.textContent === item.name) {
                                            dockItem.style.display = 'none';
                                        }
                                    });
                                    row.style.display = 'none';
                                    saveSettings();
                                }
                            });
                        }
                    });
                    
                    // Apply settings
                    if (settingsData.General) {
                        // Apply theme
                        if (settingsData.General.theme) {
                            applyThemeOnly(settingsData.General.theme);
                        }
                        // Apply background
                        if (settingsData.General.backgroundType) {
                            currentBackground.type = settingsData.General.backgroundType;
                            if (settingsData.General.customBackgroundUrl) {
                                currentBackground.url = settingsData.General.customBackgroundUrl;
                            } else {
                                currentBackground.url = '';
                            }
                            applyBackgroundOnly();
                        }
                        if (settingsData.General.searchEngine) {
                            applySearchEngine(settingsData.General.searchEngine);
                        }
                    }
                    
                    if (settingsData.Time) {
                        if (settingsData.Time.use24Hour === 'true') {
                            use24Hour = true;
                        } else if (settingsData.Time.use24Hour === 'false') {
                            use24Hour = false;
                        }
                        if (settingsData.Time.showSeconds === 'true') {
                            showSeconds = true;
                        } else if (settingsData.Time.showSeconds === 'false') {
                            showSeconds = false;
                        }
                        updateClock();
                        updateSettingUI();
                    }
                    
                    const existingCategoryData = JSON.parse(localStorage.getItem('nexusCategoryApps') || '{}');
                    Object.keys(categoryData).forEach(categoryId => {
                        if (!existingCategoryData[categoryId]) {
                            existingCategoryData[categoryId] = [];
                        }
                        categoryData[categoryId].forEach(app => {
                            const exists = existingCategoryData[categoryId].some(a => a.appName === app.appName);
                            if (!exists) {
                                existingCategoryData[categoryId].push(app);
                            }
                        });
                    });
                    localStorage.setItem('nexusCategoryApps', JSON.stringify(existingCategoryData));
                    
                    saveSettings();
                    injectFavicons();
                    updateAllApps();
                    
                    alert(`✅ Import successful!\n\nImported:\n- ${importedApps} apps to categories\n- ${importedDock} dock items\n- ${importedSettings} settings`);
                    
                } catch (e) {
                    alert('Error importing data: ' + e.message);
                    console.error(e);
                }
                document.body.removeChild(fileInput);
            };
            
            reader.readAsText(file);
        });
        
        fileInput.click();
    }
    
    function addImportExportButtons() {
        const searchSection = document.getElementById('set-search');
        if (!searchSection) return;
        
        if (document.getElementById('import-export-section')) return;
        
        const section = document.createElement('div');
        section.id = 'import-export-section';
        section.style.cssText = `
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--glass-border);
        `;
        section.innerHTML = `
            <div class="settings-header" style="font-size: 1.2rem; margin-bottom: 15px;">Import / Export</div>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="setting-control primary" id="export-btn" style="padding: 10px 24px; background: var(--accent); color: #000;">
                    📤 Export CSV
                </button>
                <button class="setting-control" id="import-btn" style="padding: 10px 24px;">
                    📥 Import CSV
                </button>
            </div>
            <div style="margin-top: 12px; font-size: 0.8rem; color: var(--text-dim);">
                Export all your apps, dock items, and settings as a CSV file.<br>
                Import a CSV file to restore your data.
            </div>
        `;
        
        searchSection.appendChild(section);
        
        document.getElementById('export-btn')?.addEventListener('click', exportData);
        document.getElementById('import-btn')?.addEventListener('click', importData);
    }

    /* ============================
       16. SETUP EVENT LISTENERS
    ============================ */

    document.querySelector('[data-time-format]')?.addEventListener('click', function() {
        use24Hour = !use24Hour;
        this.classList.toggle('primary', use24Hour);
        updateClock();
        saveSettings();
    });

    document.querySelector('[data-time-seconds]')?.addEventListener('click', function() {
        showSeconds = !showSeconds;
        this.classList.toggle('primary', showSeconds);
        updateClock();
        saveSettings();
    });

    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            applyTheme(theme); // This applies theme and re-applies background
            saveSettings();
        });
    });

    document.querySelectorAll('[data-bg]').forEach(btn => {
        btn.addEventListener('click', function() {
            const bg = this.getAttribute('data-bg');
            if (bg === 'custom') {
                const customBg = localStorage.getItem('nexusCustomBg') || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1920';
                const url = prompt('Enter image URL:', customBg);
                if (url && url.trim()) {
                    applyBackground(url.trim());
                }
            } else {
                applyBackground(bg);
            }
            saveSettings();
        });
    });

    document.querySelectorAll('[data-search]').forEach(btn => {
        btn.addEventListener('click', function() {
            const engine = this.getAttribute('data-search');
            applySearchEngine(engine);
            saveSettings();
        });
    });

    document.querySelectorAll('#set-cat .setting-control:not(.primary)').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('.setting-row');
            const label = row?.querySelector('.setting-label')?.textContent || 'Item';
            if (this.textContent === 'Edit') {
                const newName = prompt(`Rename "${label}" to:`, label);
                if (newName && newName.trim()) {
                    const folderBtns = document.querySelectorAll('.folder-label');
                    folderBtns.forEach(folder => {
                        if (folder.textContent === label) {
                            folder.textContent = newName.trim();
                        }
                    });
                    if (row) row.querySelector('.setting-label').textContent = newName.trim();
                    saveSettings();
                }
            }
        });
    });

    document.querySelectorAll('#set-fav .setting-control:not(.primary)').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('.setting-row');
            const label = row?.querySelector('.setting-label')?.textContent || 'Item';
            if (this.textContent === 'Remove') {
                if (confirm(`Remove "${label}" from favorites?`)) {
                    const dockItems = document.querySelectorAll('.dock-item');
                    dockItems.forEach(item => {
                        const itemLabel = item.querySelector('.dock-label');
                        if (itemLabel && itemLabel.textContent === label) {
                            item.style.display = 'none';
                        }
                    });
                    if (row) row.style.display = 'none';
                    saveSettings();
                }
            }
        });
    });

    document.querySelector('#set-fav .setting-control.primary')?.addEventListener('click', function() {
        const dock = document.getElementById('app-dock');
        const newApp = prompt('Enter the app name to add to dock:');
        if (newApp && newApp.trim()) {
            const url = prompt('Enter the URL for ' + newApp + ':');
            if (url && url.trim()) {
                try {
                    const domain = new URL(url).hostname;
                    const item = document.createElement('a');
                    item.href = url;
                    item.className = 'dock-item';
                    item.title = newApp;
                    item.innerHTML = `
                        <span class="dock-icon"><img data-domain="${domain}" alt="" /></span>
                        <span class="dock-label">${newApp}</span>
                    `;
                    const divider = dock.querySelector('.dock-divider');
                    if (divider) {
                        dock.insertBefore(item, divider);
                    } else {
                        dock.appendChild(item);
                    }
                    const img = item.querySelector('img');
                    if (img) {
                        img.src = 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64';
                    }
                    
                    const favContent = document.getElementById('set-fav');
                    const row = document.createElement('div');
                    row.className = 'setting-row';
                    row.innerHTML = `
                        <span class="setting-label">${newApp}</span>
                        <button class="setting-control">Remove</button>
                    `;
                    const addBtn = favContent.querySelector('.setting-control.primary')?.closest('.setting-row');
                    if (addBtn) {
                        favContent.insertBefore(row, addBtn);
                    } else {
                        favContent.appendChild(row);
                    }
                    
                    row.querySelector('.setting-control').addEventListener('click', function() {
                        if (confirm(`Remove "${newApp}" from favorites?`)) {
                            const dockItems = document.querySelectorAll('.dock-item');
                            dockItems.forEach(dockItem => {
                                const itemLabel = dockItem.querySelector('.dock-label');
                                if (itemLabel && itemLabel.textContent === newApp) {
                                    dockItem.style.display = 'none';
                                }
                            });
                            row.style.display = 'none';
                            saveSettings();
                        }
                    });
                    
                    saveSettings();
                } catch (e) {
                    alert('Invalid URL. Please enter a valid URL.');
                }
            }
        }
    });

    document.querySelector('#set-cat .setting-control.primary')?.addEventListener('click', function() {
        const name = prompt('Enter new category name:');
        if (name && name.trim()) {
            const id = 'modal-' + name.toLowerCase().replace(/\s+/g, '-');
            
            const workspace = document.getElementById('workspace');
            const folder = document.createElement('button');
            folder.className = 'large-folder';
            folder.setAttribute('onclick', `openModal('${id}')`);
            folder.type = 'button';
            folder.innerHTML = `
                <div class="folder-box">
                    <img data-domain="github.com" alt="" />
                    <img data-domain="google.com" alt="" />
                    <img data-domain="youtube.com" alt="" />
                </div>
                <span class="folder-label">${name}</span>
            `;
            workspace.appendChild(folder);

            const container = document.getElementById('modal-container');
            const modal = document.createElement('div');
            modal.className = 'overlay';
            modal.id = id;
            modal.setAttribute('onclick', 'closeModal(event)');
            modal.innerHTML = `
                <div class="folder-window" onclick="event.stopPropagation()">
                    <div class="window-title">📁 ${name}</div>
                    <div class="folder-grid">
                        <a href="https://example.com" class="app-item local-app">
                            <span class="app-icon"><img data-domain="example.com" alt="" /></span>
                            <span class="app-title">Example</span>
                        </a>
                    </div>
                </div>
            `;
            container.appendChild(modal);

            const catContent = document.getElementById('set-cat');
            const row = document.createElement('div');
            row.className = 'setting-row';
            row.innerHTML = `
                <span class="setting-label">${name}</span>
                <button class="setting-control">Edit</button>
            `;
            catContent.insertBefore(row, catContent.querySelector('.setting-row:last-child'));

            row.querySelector('.setting-control').addEventListener('click', function() {
                const currentLabel = this.closest('.setting-row').querySelector('.setting-label');
                const newName = prompt(`Rename "${currentLabel.textContent}" to:`, currentLabel.textContent);
                if (newName && newName.trim()) {
                    const folderBtns = document.querySelectorAll('.folder-label');
                    folderBtns.forEach(folder => {
                        if (folder.textContent === currentLabel.textContent) {
                            folder.textContent = newName.trim();
                        }
                    });
                    currentLabel.textContent = newName.trim();
                    saveSettings();
                }
            });

            injectFavicons();
            updateAllApps();
            saveSettings();
        }
    });

    /* ============================
       17. INITIALIZATION
    ============================ */

    // Load everything in correct order
    loadCategoryApps();
    loadSettings();
    
    setTimeout(() => {
        addAddWebsiteButtons();
        addRemoveButtonsToApps();
        addImportExportButtons();
        handleLocalWallpaperUpload(); // Add local wallpaper upload handler
    }, 500);

})();