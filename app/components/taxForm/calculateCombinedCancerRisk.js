function calculateCombinedCancerRisk() {
    const numChemicals = parseInt(document.getElementById('num-chemicals').value);
    
    if (isNaN(numChemicals) || numChemicals <= 0) {
      alert("Будь ласка, введіть кількість хімічних речовин.");
      return;
    }
  
    let totalCancerRisk = 0;
  
    // Обчислення сумарного канцерогенного ризику
    for (let i = 0; i < numChemicals; i++) {
      const cr = parseFloat(document.getElementById(`cr-${i}`).value);
      
      if (isNaN(cr)) {
        alert(`Будь ласка, введіть значення для канцерогенного ризику для речовини ${i + 1}.`);
        return;
      }
  
      totalCancerRisk += cr;
    }
  
    // Відображення результату
    const resultDiv = document.getElementById('combined-cancer-risk-result');
    resultDiv.innerHTML = `<strong>Сумарний канцерогенний ризик (CR_A):</strong> ${totalCancerRisk.toFixed(5)}`;
  }
  