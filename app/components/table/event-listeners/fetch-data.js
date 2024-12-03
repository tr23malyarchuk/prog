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
                <th>Назва Підприємства</th>
                <th>Назва Забруднюючої Речовини</th>
                <th>Об'єм Викидів (тонн)</th>
                <th>Клас Небезпеки</th>
                <th>Критичні Органи</th>
                <th>Референтна Концентрація (мг/м³)</th>
                <th>Фактор Канцерогенного Потенціалу</th>
                <th>Рік</th>
                <th>Дії</th>
            `;
        } else {
            headerRow.innerHTML = `
                <th>ID</th>
                <th>ID Об'єкта</th>
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
                let enterpriseName = '—';

                if (row['id_обєкта']) {
                    objectName = row['id_обєкта'] === 1 ? 'Рівне' :
                                 row['id_обєкта'] === 2 ? 'Хмельницьк' :
                                 row['id_обєкта'] === 3 ? 'Бровари' : '—';

                    enterpriseName = row['id_обєкта'] === 1 ? 'ПАТ "Рівнеазот"' :
                                     row['id_обєкта'] === 2 ? 'Хмельницька атомна електростанція' :
                                     row['id_обєкта'] === 3 ? 'КП Броварської міської ради Київської області «Броваритепловодоенергія»' : '—';
                }

                const tr = document.createElement('tr');
                if (selectedTable === 'air-risk') {
                    tr.innerHTML = `
                        <td>${row['id']}</td>
                        <td>${row['id_обєкта'] || '—'}</td>
                        <td>${objectName}</td>
                        <td>${enterpriseName}</td>
                        <td>${row['назва_забруднюючої_речовини'] || '—'}</td>
                        <td>${parseFloat(row['обєм_викидів_тонн']).toFixed(4) || '—'}</td>
                        <td>${row['клас_небезпеки'] || '—'}</td>
                        <td>${row['критичні_органи_або_системи'] || '—'}</td>
                        <td>${row['ref_концентрація_мг_м3'] || '—'}</td>
                        <td>${row['фактор_канцерогенного_потенціалу'] || '—'}</td>
                        <td>${row['рік'] || '—'}</td>
                        <td>
                            <button class="edit-btn" data-id="${row['id']}">Редагувати</button>
                            <button class="delete-btn" data-id="${row['id']}">Видалити</button>
                        </td>
                    `;
                } else {
                    const emissionVolume = parseFloat(row['обєм_викидів_тонн']) ? parseFloat(row['обєм_викидів_тонн']).toFixed(14) : '—';
                    let taxRate = 0;

                    const pollutantName = row['назва_забруд_речовини'];
                    taxRate = calculateTaxRate(pollutantName);

                    const tax = emissionVolume * taxRate;

                    tr.innerHTML = `
                        <td>${row['id']}</td>
                        <td>${row['id_обєкта']}</td>
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
                }

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
