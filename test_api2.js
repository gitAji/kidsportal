(async () => {
    try {
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            body: JSON.stringify({ message: "Hello!" }),
            headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error(e);
    }
})();
