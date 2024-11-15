document.getElementById('pollutant-name').addEventListener('change', (event) => { 
    console.log("Pollutant selected:", event.target.value); // Для перевірки, що подія спрацьовує
    const customPollutantField = document.getElementById('custom-pollutant-name');
    const hazardClassLabel = document.getElementById('hazard-class-label');
    const hazardClassSelect = document.getElementById('hazard-class');

    const selectedTable = document.getElementById('table-select1').value;

    if (event.target.value === 'custom') {
        customPollutantField.style.display = 'block';
        if (selectedTable === 'air') {
            hazardClassLabel.style.display = 'block';
            hazardClassSelect.style.display = 'block';
        }
    } else {
        customPollutantField.style.display = 'none';
        hazardClassLabel.style.display = 'none';
        hazardClassSelect.style.display = 'none';
    }
});
