function calculateSoilDamage() {
    const A = parseFloat(document.getElementById("A1").value);
    const NPZ = parseFloat(document.getElementById("NPZ").value);
    const PD = parseFloat(document.getElementById("PD").value);
    const KN = parseFloat(document.getElementById("KN").value);
    const Ko = parseFloat(document.getElementById("Ko").value);
    const Vr = parseFloat(document.getElementById("Vr").value);

    const result = A * NPZ * PD * KN * Ko + Vr;
    document.getElementById("soil-damage-details").textContent = `Розрахована шкода: ${result} грн.`;

    fetch('http://localhost:3005/data/soil-damage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            A: A,
            NPZ: NPZ,
            PD: PD,
            KN: KN,
            Ko: Ko,
            Vr: Vr,
            result: result
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Data successfully saved to the database');
        } else {
            console.error('Error saving data:', data.message || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Network error:', error);
    });
}
