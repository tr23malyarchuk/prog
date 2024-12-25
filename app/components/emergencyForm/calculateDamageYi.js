function calculateDamageYi() {
    const Y_N = parseFloat(document.getElementById('Y_N').value);
    const I = parseFloat(document.getElementById('I').value);

    if (isNaN(Y_N) || isNaN(I) || Y_N <= 0 || I <= 0) {
        alert("Please enter valid values for Y_N and I.");
        return;
    }

    const Y = (Y_N * I) / 100;
    document.getElementById('dynamic-risk-result').innerHTML = `<p>Розрахована шкода: ${Y.toFixed(2)} UAH/т</p>`;

    fetch('http://localhost:3005/data/damage-yi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Y_N: Y_N,
            I: I,
            result: Y
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
