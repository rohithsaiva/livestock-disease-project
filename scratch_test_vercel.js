async function testUrl(url) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        console.log("Status for", url, ":", res.status);
    } catch (err) {
        console.log("Error:", err.message);
    }
}
testUrl("https://livestock-disease-project.vercel.app");
testUrl("https://livestockai.vercel.app");
