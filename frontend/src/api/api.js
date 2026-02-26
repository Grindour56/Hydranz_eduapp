

export async function fetchModule(moduleId) {
    const response = await fetch("http://127.0.0.1:8000/get_module", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ module_id: moduleId })
    });

    return response.json();
}
