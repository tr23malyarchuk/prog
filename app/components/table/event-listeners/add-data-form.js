// Обробка форми на відправку даних
document.getElementById('add-data-form').addEventListener('submit', (event) => {
    event.preventDefault();

    console.log("Form submitted");

    const selectedPollutant = document.getElementById('pollutant-name').value;
    const pollutantName = selectedPollutant === 'custom' 
        ? document.getElementById('custom-pollutant-name').value 
        : selectedPollutant;

        let hazardClass = selectedPollutant === 'custom' 
        ? document.getElementById('hazard-class').value 
        : null;

    console.log("Pollutant:", pollutantName);
    console.log("Hazard Class:", hazardClass);

    const selectedTable = document.getElementById('table-select1').value;
    console.log("Selected Table:", selectedTable);

    if (selectedTable === 'air' && !hazardClass && selectedPollutant === 'custom') {
        showNotification("Поле 'Клас небезпеки' є обов'язковим для таблиці повітря.", "red");
        return;
    }

    if (selectedTable === 'water') {
        hazardClass = null;
    }

    const taxRate = calculateTaxRate(pollutantName, hazardClass);

    const newRecord = {
        objectName: document.getElementById('object-name').value,
        pollutantName: pollutantName,
        emissionVolume: document.getElementById('emission-volume').value,
        taxRate: taxRate,
        year: document.getElementById('year').value
    };

    console.log("New Record:", newRecord);

    const url = selectedTable === 'water' ? 'http://localhost:3005/data/water' : 'http://localhost:3005/data/air';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecord),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network error');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data successfully added:', data);
        updateTableWithNewRecord(data);
        document.getElementById('add-data-form').reset();
        showNotification("Запис було успішно додано!", "green");

        document.getElementById('custom-pollutant-name').style.display = 'none';
        document.getElementById('hazard-class-label').style.display = 'none';
        document.getElementById('hazard-class').style.display = 'none';
    })
    .catch(error => {
        console.error('Error adding data:', error);
    });
});
