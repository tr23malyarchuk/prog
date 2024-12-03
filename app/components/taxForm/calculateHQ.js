function calculateHQ() { // Оцінка ризику розвитку неканцерогенних ефектів
                         // Визначення коефіцієнта небезпеки
    const concentration = parseFloat(document.getElementById('concentration').value);  // Рівень впливу (C_i)
    const safeLevel = parseFloat(document.getElementById('safe-level').value);        // Безпечний рівень впливу (RfC)
    
    // Перевірка на коректність введених значень
    if (isNaN(concentration) || isNaN(safeLevel) || safeLevel === 0) {
      alert("Будь ласка, введіть коректні значення для рівня впливу і безпечного рівня.");
      return;
    }
  
    // Розрахунок коефіцієнта небезпеки (HQ)
    const HQ = concentration / safeLevel;
  
    // Відображення результату
    const resultDiv = document.getElementById('non-cancer-risk-result');
    resultDiv.innerHTML = `<strong>Коефіцієнт небезпеки (HQ):</strong> ${HQ.toFixed(2)}`;
  }
  