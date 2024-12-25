function calculateReclamationCost() {
  const C1 = parseFloat(document.getElementById('C1').value);
  const C2 = parseFloat(document.getElementById('C2').value);
  const Kc = parseFloat(document.getElementById('Kc').value);
  
  if (!isNaN(C1) && !isNaN(C2) && !isNaN(Kc)) {
      const result = C1 * C2 * Kc;
      document.getElementById('reclamation-cost-details').textContent = `Вартість рекультивації: ${result} одиниць.`;

      // Send data to the server
      fetch('http://localhost:3005/data/reclamation-cost', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              C1: C1,
              C2: C2,
              Kc: Kc,
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
      document.getElementById('reclamation-cost-details').textContent = 'Будь ласка, введіть всі значення.';
  }
}
