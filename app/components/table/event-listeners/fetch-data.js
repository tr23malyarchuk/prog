document.getElementById('fetch-data').addEventListener('click', () => {
    const selectedTable = document.getElementById('table-select').value;
    const url = selectedTable === 'water' ? 'http://localhost:3005/data/water' : 'http://localhost:3005/data/air';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Мережна помилка');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = '';

            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>ID</th>
                <th>${selectedTable === 'water' ? 'ID Об\'єкта' : 'ID Об\'єкту'}</th>
                <th>Назва Об\'єкта</th>
                <th>Назва Забруднюючої Речовини</th>
                <th>Об\'єм Викидів (тонн)</th>
                <th>Ставка Податку</th>
                <th>Рік</th>
                <th>Податок</th>
                <th>Дії</th>
            `;
            tableBody.appendChild(headerRow);

            if (data.length === 0) {
                tableBody.innerHTML += '<tr><td colspan="9" class="error">Дані не знайдені</td></tr>';
            } else {
                data.forEach(row => {
                    const emissionVolume = parseFloat(row['обєм_викидів_тонн']) ? parseFloat(row['обєм_викидів_тонн']).toFixed(14) : '—';

                    let taxRate = 0;

                    // Перевірка ставки податку по назві забруднюючої речовини
                    const pollutantName = row['назва_забруд_речовини'];
                    taxRate = calculateTaxRate(pollutantName);

                    if (taxRate === 0) {
                        // Якщо ставка не знайдена, для води ставка залежить від об'єму викидів
                        if (selectedTable === 'water') {
                            const volume = parseFloat(row['обєм_викидів_тонн']);
                            if (volume <= 0.001) {
                                taxRate = 1349948.0;
                            } else if (volume <= 0.1) {
                                taxRate = 978777.84;
                            } else if (volume <= 1) {
                                taxRate = 168741.52;
                            } else if (volume <= 10) {
                                taxRate = 17173.04;
                            } else {
                                taxRate = 3437.76;
                            }
                        }
                        // Якщо це не вода, ставка податку залежить від класу небезпеки для повітря
                        else if (selectedTable === 'air') {
                            const hazardClass = row['клас_небезпеки'] || '—';

                            // Використовуємо клас небезпеки для визначення ставки податку
                            taxRate = getTaxRateByHazardClass(hazardClass);
                        }
                    }

                    const tax = emissionVolume * taxRate;

                    const tr = document.createElement('tr');

                    let objectName = '—';
                    if (selectedTable === 'water' && row['id_обєкта']) {
                        objectName = row['id_обєкта'] === 1 ? 'Рівне' :
                                     row['id_обєкта'] === 2 ? 'Хмельницьк' :
                                     row['id_обєкта'] === 3 ? 'Бровари' : '—';
                    } else if (row['id_обєкту']) {
                        objectName = row['id_обєкту'] === 1 ? 'Рівне' :
                                     row['id_обєкту'] === 2 ? 'Хмельницьк' :
                                     row['id_обєкту'] === 3 ? 'Бровари' : '—';
                    }

                    tr.innerHTML = `
                        <td>${row['id']}</td>
                        <td>${selectedTable === 'water' ? (row['id_обєкта'] || '—') : (row['id_обєкту'] || '—')}</td>
                        <td>${objectName}</td>
                        <td>${row['назва_забруд_речовини'] || '—'}</td>
                        <td>${emissionVolume || '—'}</td>
                        <td>${taxRate || '—'}</td>
                        <td>${row['Рік'] || '—'}</td>
                        <td>${tax.toFixed(10) || '—'}</td>
                        <td>
                            <button class="edit-btn" data-id="${row['id']}">Редагувати</button>
                            <button class="delete-btn" data-id="${row['id']}">Видалити</button>
                        </td>
                    `;
                    tableBody.appendChild(tr);
                });
                addEventListeners();
            }
        })
        .catch(error => {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = `<tr><td colspan="9" class="error">Помилка при завантаженні даних: ${error.message}</td></tr>`;
        });
});
