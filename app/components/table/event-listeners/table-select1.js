// Логіка для приховування поля 'hazard-class' при виборі таблиці "вода"
document.getElementById('table-select1').addEventListener('change', (event) => {
    const selectedTable = event.target.value;
    const hazardClassLabel = document.getElementById('hazard-class-label');
    const hazardClassSelect = document.getElementById('hazard-class');

    // Якщо вибрана таблиця "вода", приховуємо hazard-class
    if (selectedTable === 'water') {
        hazardClassLabel.style.display = 'none';
        hazardClassSelect.style.display = 'none';
    } else if (selectedTable === 'air') {
        // Якщо вибрана таблиця "повітря", показуємо hazard-class
        const customPollutant = document.getElementById('pollutant-name').value === 'custom';
        if (customPollutant) {
            hazardClassLabel.style.display = 'block';
            hazardClassSelect.style.display = 'block';
        }
    }
});
