async function testPredict() {
    try {
        const res = await fetch("http://localhost:5000/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                animalType: "Cow",
                age: 2,
                fever: "Yes",
                appetiteLoss: "Yes",
                weakness: "Yes",
                vaccination: "Not Vaccinated",
                temperature: 39,
                humidity: 60
            })
        });
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
testPredict();
