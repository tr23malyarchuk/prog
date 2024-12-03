function calculatePCR() { // Оцінка популяційного ризику
    const cr = parseFloat(document.getElementById('individual-cancer-risk').value);
    const pop = parseInt(document.getElementById('population-size').value);
  
    // Check for invalid inputs
    if (isNaN(cr) || cr <= 0) {
      alert("Будь ласка, введіть коректний індивідуальний канцерогенний ризик (CR).");
      return;
    }
  
    if (isNaN(pop) || pop <= 0) {
      alert("Будь ласка, введіть коректну чисельність популяції (POP).");
      return;
    }
  
    // Calculate PCR
    const pcr = cr * pop;
  
    // Display the result
    const resultDiv = document.getElementById('pcr-result');
    resultDiv.innerHTML = `<strong>Популяційний канцерогений ризик (PCR):</strong> ${pcr.toFixed(5)}`;
  }
  