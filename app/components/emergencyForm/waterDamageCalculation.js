function calculateWaterDamage(K_cat, K_r, K_3, pollutants) {
  return K_cat * K_r * K_3 * pollutants.reduce((sum, { Mi, Yi }) => sum + Mi * Yi, 0);
}

function waterDamageCalculation() {
  const K_cat = parseFloat(document.getElementById('K_cat').value);
  const K_r = parseFloat(document.getElementById('K_r').value);
  const K_3 = parseFloat(document.getElementById('K_3').value);
  
  const pollutants = [
    { Mi: parseFloat(document.getElementById('Mi1').value), Yi: parseFloat(document.getElementById('Yi1').value) },
    { Mi: parseFloat(document.getElementById('Mi2').value), Yi: parseFloat(document.getElementById('Yi2').value) }
  ];
  
  const result = calculateWaterDamage(K_cat, K_r, K_3, pollutants);
  document.getElementById('water-damage-result').innerText = `Розрахована шкода: ${result}`;

  fetch('http://localhost:3005/data/water-damage', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          K_cat: K_cat,
          K_r: K_r,
          K_3: K_3,
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
