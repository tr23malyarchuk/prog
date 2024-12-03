document.getElementById('object').addEventListener('change', updateEnterprise);
document.getElementById('risk-form').addEventListener('submit', calculateRisk);

function updateEnterprise() { // Оцінка ризику для здоров'я населення від забруднення атмосферного повітря 
    const object = document.getElementById('object').value;
    const enterpriseInput = document.getElementById('enterprise');
    let enterpriseName = '';

    if (object === 'rivne') {
        enterpriseName = 'ПАТ "Рівнеазот"';
    } else if (object === 'khmelnytsky') {
        enterpriseName = 'Хмельницька атомна електростанція';
    } else if (object === 'brovary') {
        enterpriseName = 'КП Броварської міської ради Київської області «Броваритепловодоенергія»';
    }

    enterpriseInput.value = enterpriseName;
    loadPollutants(object);
    loadYears(object);
}

function loadPollutants(object) {
  fetch(`http://localhost:3005/data/air-risk?object=${object}`)
      .then(response => response.json())
      .then(data => {
          const pollutantSelect = document.getElementById('pollutant');
          pollutantSelect.innerHTML = '';
          data.forEach(row => {
              row['концентрація'] = row['концентрація'] || row['фактор_канцерогенного_потенціалу'];
              const option = document.createElement('option');
              option.value = JSON.stringify(row);
              option.textContent = row['назва_забруднюючої_речовини'];
              pollutantSelect.appendChild(option);
          });
      })
      .catch(error => console.error('Помилка завантаження забруднюючих речовин:', error));
}



function loadYears(object) {
    fetch(`http://localhost:3005/data/air-risk?object=${object}`)
        .then(response => response.json())
        .then(data => {
            const yearSelect = document.getElementById('year');
            const years = [...new Set(data.map(row => row['рік']))];
            yearSelect.innerHTML = '';
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Помилка завантаження років:', error));
}

function calculateRisk(event) {
    event.preventDefault();

    const object = document.getElementById('object').value;
    const selectedOption = document.getElementById('pollutant').value;
    const year = document.getElementById('year').value;

    if (!selectedOption) {
        document.getElementById('risk-details').textContent = 'Будь ласка, виберіть забруднюючу речовину.';
        return;
    }

    const row = JSON.parse(selectedOption);
    const concentration = parseFloat(row['концентрація']);
    const Rfc = parseFloat(row['ref_концентрація_мг_м3']);
    const cancerFactor = parseFloat(row['фактор_канцерогенного_потенціалу']);
    let riskDescription = '';
    let risk = 0;

    const formattedConcentration = isNaN(concentration) || concentration === 0 ? '—' : concentration.toFixed(8);
    const formattedRfc = isNaN(Rfc) || Rfc === 0 ? '—' : Rfc.toFixed(2);

    if (concentration === 0 || isNaN(concentration) || cancerFactor === 0 || isNaN(cancerFactor)) {
        riskDescription = 'Низький ризик';
    } else {
        if (row['канцерогенна']) {
            const LADD = (((row['Ca'] * row['Tout'] * row['Vout']) + (row['Ch'] * row['Tin'] * row['Vin'])) * row['Ef'] * row['Ed']) / (row['Bw'] * row['At'] * row['days']);
            risk = LADD * cancerFactor;
            riskDescription = risk < 1 ? 'Низький ризик' : risk < 10 ? 'Середній ризик' : 'Високий ризик';
        } else {
            risk = concentration / Rfc;
            riskDescription = risk < 1 ? 'Низький ризик' : risk < 10 ? 'Середній ризик' : 'Високий ризик';
        }
    }

    document.getElementById('risk-details').innerHTML = `
        Назва речовини: ${row['назва_забруднюючої_речовини']}<br>
        Концентрація: ${formattedConcentration}<br>
        Rfc: ${formattedRfc}<br>
        Поточний ризик: ${isNaN(risk) ? '—' : risk.toFixed(2)}<br>
        Характеристика: ${riskDescription}
    `;
}
