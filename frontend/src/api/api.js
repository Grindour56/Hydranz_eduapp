// api/api.js
const CACHE_PREFIX = "module_";
const CACHE_INDEX_KEY = "module_cache_index";
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB limit (most browsers allow 5-10MB per domain)
const CACHE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 year expiry (practically forever)

// Cache index to track all cached modules
function getCacheIndex() {
    const index = localStorage.getItem(CACHE_INDEX_KEY);
    return index ? JSON.parse(index) : { modules: [], totalSize: 0 };
}

function updateCacheIndex(moduleId, size) {
    const index = getCacheIndex();

    // Check if module already exists
    const existingModule = index.modules.find(m => m.id === moduleId);

    if (existingModule) {
        // Update existing entry
        existingModule.size = size;
        existingModule.lastAccessed = Date.now();
        existingModule.expiry = Date.now() + CACHE_EXPIRY;
    } else {
        // Add new module
        index.modules.push({
            id: moduleId,
            size: size,
            cachedAt: Date.now(),
            lastAccessed: Date.now(),
            expiry: Date.now() + CACHE_EXPIRY
        });
        index.totalSize += size;
    }

    // Sort by last accessed (most recent first)
    index.modules.sort((a, b) => b.lastAccessed - a.lastAccessed);

    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
    return index;
}

// Clean up cache if we're running low on space
function ensureCacheSpace(requiredSize) {
    const index = getCacheIndex();

    // If we have enough space, return
    if (index.totalSize + requiredSize <= MAX_CACHE_SIZE) {
        return;
    }

    console.log("Cache full, cleaning up...");

    // Sort by last accessed (oldest first) for removal
    const sortedModules = [...index.modules].sort((a, b) => a.lastAccessed - b.lastAccessed);

    // Remove oldest modules until we have enough space
    let freedSpace = 0;
    const modulesToKeep = [];

    for (const module of sortedModules) {
        if (index.totalSize - freedSpace + requiredSize <= MAX_CACHE_SIZE) {
            // Keep this module
            modulesToKeep.push(module);
        } else {
            // Remove this module
            localStorage.removeItem(CACHE_PREFIX + module.id);
            freedSpace += module.size;
            console.log(`Removed module ${module.id} to free ${module.size} bytes`);
        }
    }

    // Update index
    index.modules = modulesToKeep.sort((a, b) => b.lastAccessed - a.lastAccessed);
    index.totalSize -= freedSpace;

    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
}

// Manual cache management function (expose to user)
export function getCachedModules() {
    const index = getCacheIndex();
    return index.modules.map(module => ({
        ...module,
        sizeKB: Math.round(module.size / 1024),
        sizeMB: (module.size / (1024 * 1024)).toFixed(2),
        cachedDate: new Date(module.cachedAt).toLocaleDateString(),
        lastUsed: new Date(module.lastAccessed).toLocaleDateString(),
        expires: new Date(module.expiry).toLocaleDateString()
    }));
}

export function deleteCachedModule(moduleId) {
    const index = getCacheIndex();
    const moduleIndex = index.modules.findIndex(m => m.id === moduleId);

    if (moduleIndex !== -1) {
        index.totalSize -= index.modules[moduleIndex].size;
        index.modules.splice(moduleIndex, 1);
        localStorage.removeItem(CACHE_PREFIX + moduleId);
        localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
        return true;
    }
    return false;
}

export function clearAllCache() {
    const index = getCacheIndex();
    index.modules.forEach(module => {
        localStorage.removeItem(CACHE_PREFIX + module.id);
    });
    localStorage.removeItem(CACHE_INDEX_KEY);
    console.log("All cache cleared");
}

export function getCacheStats() {
    const index = getCacheIndex();
    return {
        totalModules: index.modules.length,
        totalSizeMB: (index.totalSize / (1024 * 1024)).toFixed(2),
        maxSizeMB: MAX_CACHE_SIZE / (1024 * 1024),
        usagePercent: ((index.totalSize / MAX_CACHE_SIZE) * 100).toFixed(1),
        remainingMB: ((MAX_CACHE_SIZE - index.totalSize) / (1024 * 1024)).toFixed(2)
    };
}

export async function fetchModule(moduleId, forceRefresh = false) {
    const cacheKey = CACHE_PREFIX + moduleId;

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
        const cachedRaw = localStorage.getItem(cacheKey);

        if (cachedRaw) {
            try {
                const cachedData = JSON.parse(cachedRaw);

                // Check if cache is still valid (not expired)
                if (cachedData.expiry && cachedData.expiry > Date.now()) {
                    console.log(`✅ Loaded from cache: ${moduleId}`);

                    // Update last accessed time
                    const index = getCacheIndex();
                    const module = index.modules.find(m => m.id === moduleId);
                    if (module) {
                        module.lastAccessed = Date.now();
                        localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
                    }

                    return cachedData.data;
                } else {
                    // Cache expired, remove it
                    console.log(`Cache expired for ${moduleId}, removing...`);
                    localStorage.removeItem(cacheKey);
                    deleteCachedModule(moduleId);
                }
            } catch (e) {
                console.error("Error parsing cache:", e);
                localStorage.removeItem(cacheKey);
            }
        }
    }

    console.log(`🌐 Fetching from server: ${moduleId}`);

    try {
        const response = await fetch("http://127.0.0.1:8000/get_module", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ module_id: moduleId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Calculate size
        const dataString = JSON.stringify(data);
        const bytes = new TextEncoder().encode(dataString).length;

        // Ensure we have space
        ensureCacheSpace(bytes);

        // Store in cache with expiry
        const cacheData = {
            data: data,
            cachedAt: Date.now(),
            expiry: Date.now() + CACHE_EXPIRY
        };

        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        updateCacheIndex(moduleId, bytes);

        console.log(`✅ Cached ${moduleId} (${bytes} bytes)`);

        return data;
    } catch (error) {
        console.error("❌ Error fetching module:", error);

        // Try to get expired cache as fallback
        const expiredCache = localStorage.getItem(cacheKey);
        if (expiredCache) {
            try {
                const cachedData = JSON.parse(expiredCache);
                console.log("⚠️ Using expired cache as fallback");
                return cachedData.data;
            } catch (e) {
                // Ignore
            }
        }

        // Ultimate fallback
        return {
            title: `Module ${moduleId} (Offline)`,
            content: "You are offline and no cached version is available. Please check your connection.",
            difficulty: "unknown",
            estimated_time: 10,
            offline: true
        };
    }
}