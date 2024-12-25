function calculateAi() {
  const MAC_i = parseFloat(document.getElementById('MAC_i').value);

  if (!isNaN(MAC_i) && MAC_i > 0) {
    const Ai = 1 / MAC_i;
    document.getElementById('ai-value').textContent = `Результат Ai: ${Ai.toFixed(4)}`;

    fetch('http://localhost:3005/data/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        MAC_i: MAC_i,
        Ai: Ai,
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
    document.getElementById('ai-value').textContent = 'Будь ласка, введіть правильне значення для MAC_i.';
  }
}
