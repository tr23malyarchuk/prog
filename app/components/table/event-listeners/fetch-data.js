document.getElementById('fetch-data').addEventListener('click', () => {
    const selectedTable = document.getElementById('table-select').value;
    let url = '';

    if (selectedTable === 'water') {
        url = 'http://localhost:3005/data/water';
    } else if (selectedTable === 'air') {
        url = 'http://localhost:3005/data/air';
    } else if (selectedTable === 'air-risk') {
        url = 'http://localhost:3005/data/air-risk';
    }

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
            if (selectedTable === 'air-risk') {
                headerRow.innerHTML = `
                    <th>ID</th>
                    <th>ID Об'єкта</th>
                    <th>Назва Об'єкта</th>
                    <th>Назва Забруднюючої Речовини</th>
                    <th>Об'єм Викидів (тонн)</th>
                    <th>Клас Небезпеки</th>
                    <th>Критичні Органи</th>
                    <th>Референтна Концентрація (мг/м³)</th>
                    <th>Фактор Канцерогенного Потенціалу</th>
                    <th>Рік</th>
                `;
            } else {
                headerRow.innerHTML = `
                    <th>ID</th>
                    <th>${selectedTable === 'water' ? 'ID Об\'єкта' : 'ID Об\'єкту'}</th>
                    <th>Назва Об'єкта</th>
                    <th>Назва Забруднюючої Речовини</th>
                    <th>Об'єм Викидів (тонн)</th>
                    <th>Ставка Податку</th>
                    <th>Рік</th>
                    <th>Податок</th>
                    <th>Дії</th>
                `;
            }
            tableBody.appendChild(headerRow);

            if (data.length === 0) {
                tableBody.innerHTML += '<tr><td colspan="9" class="error">Дані не знайдені</td></tr>';
            } else {
                data.forEach(row => {
                    let objectName = '—';
                    if (row['id_обєкта']) {
                        objectName = row['id_обєкта'] === 1 ? 'Рівне' :
                                     row['id_обєкта'] === 2 ? 'Хмельницьк' :
                                     row['id_обєкта'] === 3 ? 'Бровари' : '—';
                    }
                
                    const tr = document.createElement('tr');
                    if (selectedTable === 'air-risk') {
                        tr.innerHTML = `
                            <td>${row['id']}</td>
                            <td>${row['id_обєкта'] || '—'}</td>
                            <td>${objectName}</td>
                            <td>${row['назва_забруднюючої_речовини'] || '—'}</td>
                            <td>${parseFloat(row['обєм_викидів_тонн']).toFixed(4) || '—'}</td>
                            <td>${row['клас_небезпеки'] || '—'}</td>
                            <td>${row['критичні_органи_або_системи'] || '—'}</td>
                            <td>${row['ref_концентрація_мг_м3'] || '—'}</td>
                            <td>${row['фактор_канцерогенного_потенціалу'] || '—'}</td>
                            <td>${row['рік'] || '—'}</td>
                        `;
                    } else {
                        const emissionVolume = parseFloat(row['обєм_викидів_тонн']) || 0;
                        const taxRate = parseFloat(row['ставка_за_викиди']) || 0;
                        const tax = emissionVolume * taxRate;
                
                        tr.innerHTML = `
                            <td>${row['id']}</td>
                            <td>${row['id_обєкта'] || '—'}</td>
                            <td>${objectName}</td>
                            <td>${row['назва_забруд_речовини'] || '—'}</td>
                            <td>${emissionVolume.toFixed(4)}</td>
                            <td>${taxRate.toFixed(2)}</td>
                            <td>${row['Рік'] || '—'}</td>
                            <td>${!isNaN(tax) ? tax.toFixed(2) : '—'}</td>
                            <td>
                                <button class="edit-btn" data-id="${row['id']}">Редагувати</button>
                                <button class="delete-btn" data-id="${row['id']}">Видалити</button>
                            </td>
                        `;
                    }
                    tableBody.appendChild(tr);
                });
            }
        })
        .catch(error => {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = `<tr><td colspan="9" class="error">Помилка при завантаженні даних: ${error.message}</td></tr>`;
        });
});
