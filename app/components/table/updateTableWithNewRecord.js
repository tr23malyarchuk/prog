function updateTableWithNewRecord(record) {
    const table = document.getElementById('data-table'); // Припустимо, що у вас є таблиця з id "data-table"
    const row = table.insertRow(); // Додаємо новий рядок

    // Додаємо клітинки до нового рядка
    const objectNameCell = row.insertCell(0);
    const pollutantNameCell = row.insertCell(1);
    const emissionVolumeCell = row.insertCell(2);
    const taxRateCell = row.insertCell(3);
    const yearCell = row.insertCell(4);

    // Заповнюємо клітинки значеннями з нового запису
    objectNameCell.textContent = record.objectName;
    pollutantNameCell.textContent = record.pollutantName;
    emissionVolumeCell.textContent = record.emissionVolume;
    taxRateCell.textContent = record.taxRate; // Виводимо обчислену ставку податку
    yearCell.textContent = record.year;
}
