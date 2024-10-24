document.getElementById('fetch-data').addEventListener('click', () => {
    const selectedTable = document.getElementById('table-select').value;
    const url = selectedTable === 'water' ? 'http://localhost:3005/data/water' : 'http://localhost:3005/data/air';
    
    // Завантажуємо дані з сервера та відображаємо їх у таблиці
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Мережна помилка');
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('data-table');
            tableBody.innerHTML = ''; // Очищення таблиці перед новими даними
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" class="error">Дані не знайдені</td></tr>'; // Оновлено на 8
            } else {
                data.forEach(row => {
                    const emissionVolume = parseFloat(row['обєм_викидів_тонн']) || 0;
                    const taxRate = selectedTable === 'water' ? parseFloat(row['ставка_за_викиди_в_водойми']) || 0 : parseFloat(row['ставка_за_викиди_в_повітря']) || 0;
                    const tax = emissionVolume * taxRate; // Обчислення податку

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row['id']}</td>
                        <td>${selectedTable === 'water' ? (row['id_обєкта'] || '—') : (row['id_обєкту'] || '—')}</td>
                        <td>${row['назва_забруд_речовини'] || '—'}</td>
                        <td>${emissionVolume || '—'}</td>
                        <td>${taxRate || '—'}</td>
                        <td>${row['Рік'] || '—'}</td>
                        <td>${tax.toFixed(10) || '—'}</td> <!-- Додано значення податку -->
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
            tableBody.innerHTML = `<tr><td colspan="8" class="error">Помилка при завантаженні даних: ${error.message}</td></tr>`; // Оновлено на 8
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

    // Відправлення POST-запиту для додавання даних
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
        document.getElementById('fetch-data').click(); // Оновлення таблиці після додавання
        document.getElementById('add-data-form').reset(); // Скидання полів форми
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
                document.getElementById('fetch-data').click(); // Оновлення таблиці після видалення
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
                document.getElementById('fetch-data').click(); // Оновлення таблиці після редагування
            })
            .catch(error => {
                console.error('Помилка при редагуванні даних:', error);
            });
        });
    });
}
