

export async function fetchModule(moduleId) {
    const response = await fetch("https://your-backend-url/get_module", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ module_id: moduleId })
    });

    return response.json();
}
