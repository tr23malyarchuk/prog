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
                <th>Назва Забруднюючої Речовини</th>
                <th>Об\'єм Викидів (тонн)</th>
                <th>Ставка Податку</th>
                <th>Рік</th>
                <th>Податок</th>
                <th>Дії</th>
            `;
            tableBody.appendChild(headerRow);

            if (data.length === 0) {
                tableBody.innerHTML += '<tr><td colspan="8" class="error">Дані не знайдені</td></tr>'; 
            } else {
                data.forEach(row => {
                    const emissionVolume = parseFloat(row['обєм_викидів_тонн']) || 0;
                    const taxRate = selectedTable === 'water' ? parseFloat(row['ставка_за_викиди_в_водойми']) || 0 : parseFloat(row['ставка_за_викиди_в_повітря']) || 0;
                    const tax = emissionVolume * taxRate; 

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row['id']}</td>
                        <td>${selectedTable === 'water' ? (row['id_обєкта'] || '—') : (row['id_обєкту'] || '—')}</td>
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
            tableBody.innerHTML = `<tr><td colspan="8" class="error">Помилка при завантаженні даних: ${error.message}</td></tr>`; 
        });
});

document.getElementById('add-data-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const newRecord = {
        objectName: document.getElementById('object-name').value,
        pollutantName: document.getElementById('pollutant-name').value,
        emissionVolume: document.getElementById('emission-volume').value,
        taxRate: document.getElementById('tax-rate').value,
        year: document.getElementById('year').value
    };

    const selectedTable = document.getElementById('table-select').value;
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
            throw new Error('Мережна помилка');
        }
        return response.json();
    })
    .then(data => {
        console.log('Дані успішно додано:', data);
        document.getElementById('fetch-data').click(); 
        document.getElementById('add-data-form').reset(); 
    })
    .catch(error => {
        console.error('Помилка при додаванні даних:', error);
    });
});

function addEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const selectedTable = document.getElementById('table-select').value;
            const url = selectedTable === 'water' ? `http://localhost:3005/data/water/${id}` : `http://localhost:3005/data/air/${id}`;

            fetch(url, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Мережна помилка');
                }
                return response.json();
            })
            .then(data => {
                console.log('Дані успішно видалено:', data);
                document.getElementById('fetch-data').click(); 
            })
            .catch(error => {
                console.error('Помилка при видаленні даних:', error);
            });
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const selectedTable = document.getElementById('table-select').value;
            const url = selectedTable === 'water' ? `http://localhost:3005/data/water/${id}` : `http://localhost:3005/data/air/${id}`;

            const newRecord = {
                objectName: prompt('Введіть нову назву об\'єкту:'),
                pollutantName: prompt('Введіть нову назву забруднюючої речовини:'),
                emissionVolume: prompt('Введіть новий об\'єм викидів:'),
                taxRate: prompt('Введіть нову ставку податку за викиди:'),
                year: prompt('Введіть новий рік:')
            };

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Мережна помилка');
                }
                return response.json();
            })
            .then(data => {
                console.log('Дані успішно оновлено:', data);
                document.getElementById('fetch-data').click(); 
            })
            .catch(error => {
                console.error('Помилка при редагуванні даних:', error);
            });
        });
    });
}
