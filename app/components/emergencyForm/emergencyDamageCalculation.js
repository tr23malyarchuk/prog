function calculateEmergencyDamage(Mi, Sp, Kneb, Kv, Kmp, Kpp) {
  return Mi * Sp * Kneb * Kv * Kmp * Kpp;
}

function emergencyDamageCalculation() {
  const Mi = parseFloat(document.getElementById('Mi').value);
  const Sp = parseFloat(document.getElementById('Sp').value);
  const Kneb = parseFloat(document.getElementById('Kneb').value);
  const Kv = parseFloat(document.getElementById('Kv').value);
  const Kmp = parseFloat(document.getElementById('Kmp').value);
  const Kpp = parseFloat(document.getElementById('Kpp').value);
  const object = parseInt(document.getElementById('object').value, 10);
  const enterprise = document.getElementById('enterprise').value.trim();

  if (isNaN(Mi) || isNaN(Sp) || isNaN(Kneb) || isNaN(Kv) || isNaN(Kmp) || isNaN(Kpp) || isNaN(object) || !enterprise) {
    document.getElementById('emergency-damage-result').innerHTML = '<p>Всі поля мають бути заповнені правильними значеннями.</p>';
    return;
  }

  const result = calculateEmergencyDamage(Mi, Sp, Kneb, Kv, Kmp, Kpp);

  document.getElementById('emergency-damage-result').innerHTML = `<p>Розраховані збитки: ${result.toFixed(2)}</p>`;

  fetch('http://localhost:3005/data/emergency-damage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Mi: Mi,
      Sp: Sp,
      Kneb: Kneb,
      Kv: Kv,
      Kmp: Kmp,
      Kpp: Kpp,
      result: result,
      object: object,
      enterprise: enterprise
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
