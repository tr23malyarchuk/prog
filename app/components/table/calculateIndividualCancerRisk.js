function calculateIndividualCancerRisk() {
    const LADD = parseFloat(document.getElementById('LADD').value);  // Середня добова доза
    const SF = parseFloat(document.getElementById('SF').value);      // Фактор нахилу
    
    // Перевірка на коректність введених значень
    if (isNaN(LADD) || isNaN(SF)) {
      alert("Будь ласка, введіть коректні значення для LADD і SF.");
      return;
    }
  
    // Розрахунок індивідуального канцерогенного ризику (CR)
    const CR = LADD * SF;
  
    // Відображення результату
    const resultDiv = document.getElementById('individual-cancer-risk-result');
    resultDiv.innerHTML = `<strong>Індивідуальний канцерогений ризик (CR):</strong> ${CR.toFixed(6)}`;
  }
  