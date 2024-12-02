async function calculateRisk() {
    const objectName = document.getElementById("air-object-select").value;
    const pollutantName = document.getElementById("pollutant-name").value;
    const concentration = parseFloat(document.getElementById("concentration").value);
    const hazardClass = parseInt(document.getElementById("hazard-class").value);
    const criticalOrgans = document.getElementById("critical-organs").value;
    const referenceConcentration = parseFloat(document.getElementById("reference-concentration").value);
    const cancerFactor = parseFloat(document.getElementById("cancer-factor").value);
    
    let result;
    if (hazardClass === 1) {
      if (concentration === 0) {
        result = 'HQ = "мало дуже"';
      } else {
        const HQ = concentration / referenceConcentration;
        result = `HQ = ${HQ}`;
      }
    } else {
      if (concentration === 0) {
        result = 'CR = "мало дуже"';
      } else {
        const LADD = (((Ca * Tout * Vout) + (Ch * Tin * Vin)) * Ef * Ed) / (Bw * At * days);
        const CR = LADD / Sfi;
        result = `CR = ${CR}`;
      }
    }
  
    // Відправка на сервер для збереження даних
    const data = {
      objectName,
      pollutantName,
      concentration,
      hazardClass,
      criticalOrgans,
      referenceConcentration,
      cancerFactor,
      year: new Date().getFullYear()
    };
  
    const response = await fetch('/data/air-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    const responseData = await response.json();
    document.getElementById("air-risk-result").innerText = result;
  }
  