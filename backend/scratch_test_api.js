async function testAPI() {
    try {
        const res = await fetch("http://localhost:5000/api/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "rohithsaiva8@gmail.com" })
        });
        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Failed to fetch:", e.message);
    }
}
testAPI();
