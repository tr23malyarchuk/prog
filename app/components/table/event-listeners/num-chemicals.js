document.getElementById('num-chemicals').addEventListener('input', function() {
    const numChemicals = parseInt(this.value);
    const chemicalRows = document.getElementById('chemical-rows');
    
    // Очищення попередніх полів
    chemicalRows.innerHTML = '';
  
    // Додавання нових полів
    for (let i = 0; i < numChemicals; i++) {
      const row = document.createElement('div');
      row.classList.add('chemical-row');
      row.innerHTML = `
        <label for="cr-${i}">Канцерогенний ризик для речовини ${i + 1} (CR_i):</label>
        <input type="number" id="cr-${i}" step="0.00001" required>
      `;
      chemicalRows.appendChild(row);
    }
  });
  