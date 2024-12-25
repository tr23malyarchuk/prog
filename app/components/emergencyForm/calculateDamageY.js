function calculateDamageY() {
  const Y = parseFloat(document.getElementById('Y').value); // Value for Y
  const A = parseFloat(document.getElementById('A2').value); // Value for A

  if (!isNaN(Y) && !isNaN(A)) {
      const result = Y * A;
      document.getElementById('damage-details').innerText = `Економічний збиток: ${result.toFixed(2)} UAH/т`;

      fetch('http://localhost:3005/data/damage-y', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              Y: Y,
              A: A,
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
  } else {
      document.getElementById('damage-details').innerText = 'Будь ласка, введіть коректні значення для Y та A.';
  }
}
