function calculateTax(type) {
    const objectId = document.getElementById(type === 'water' ? 'water-object-select' : 'air-object-select').value;
    const url = type === 'water' ? `http://localhost:3005/data/water` : `http://localhost:3005/data/air`;
    const resultContainer = document.getElementById(type === 'water' ? 'water-tax-result' : 'air-tax-result');

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(record => record['id_обєкта'] === parseInt(objectId));
            let totalTax = 0;

            filteredData.forEach(record => {
                const volume = parseFloat(record['обєм_викидів_тонн']) || 0;
                const rate = parseFloat(type === 'water' ? record['ставка_за_викиди_в_водойми'] : record['ставка_за_викиди_в_повітря']) || 0;
                totalTax += volume * rate;
            });

            resultContainer.textContent = `Сума податку для обраного об'єкта: ${totalTax.toFixed(2)} грн`;
            resultContainer.classList.add('success');
        })
        .catch(error => {
            resultContainer.textContent = 'Помилка при обчисленні податку';
            resultContainer.classList.add('error');
        });
}
