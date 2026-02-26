export async function fetchModule(moduleId) {

    const cacheKey = `module_${moduleId}`;
    const bandwidthKey = "bandwidth_saved";

    // 🔹 1️⃣ Check local cache first
    const cachedRaw = localStorage.getItem(cacheKey);

    if (cachedRaw) {
        const cachedData = JSON.parse(cachedRaw);

        console.log("Loaded from cache");

        // Calculate saved bytes
        const cachedSize = new TextEncoder().encode(JSON.stringify(cachedData.data)).length;

        let totalSaved = parseInt(localStorage.getItem(bandwidthKey)) || 0;
        totalSaved += cachedSize;

        localStorage.setItem(bandwidthKey, totalSaved);

        displayStatus(`Loaded from cache. Saved ${cachedSize} bytes.`);
        displayTotalSaved(totalSaved);

        return cachedData.data;
    }

    console.log("Fetching from server...");

    // 🔹 2️⃣ Fetch from backend
    const response = await fetch("http://127.0.0.1:8000/get_module", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ module_id: moduleId })
    });

    const data = await response.json();

    const bytes = new TextEncoder().encode(JSON.stringify(data)).length;

    console.log("Bytes transferred:", bytes);

    // 🔹 3️⃣ Store in cache (with timestamp)
    localStorage.setItem(cacheKey, JSON.stringify({
        data: data,
        timestamp: Date.now()
    }));

    displayStatus(`Fetched from server. ${bytes} bytes transferred.`);

    return data;
}