function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(tabId).classList.add('active-tab');
}

// Sorting function
function sortTable(columnIndex, ascending = true) {
    const table = document.getElementById('data-table');
    const rows = Array.from(table.rows).slice(1); // Get rows except the header
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => table.appendChild(row)); // Reorder rows in the table
}

// Search function
function searchTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#data-table tr:not(:first-child)'); // Exclude header

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(searchInput) ? '' : 'none'; // Show or hide rows based on search
    });
}

// Event listeners for sorting and searching
document.getElementById('search-input').addEventListener('input', searchTable);
document.getElementById('sort-asc-btn').addEventListener('click', () => sortTable(1, true)); // Change 1 to the desired column index
document.getElementById('sort-desc-btn').addEventListener('click', () => sortTable(1, false)); // Change 1 to the desired column index

// ... rest of your code remains unchanged


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
                <th>Назва Об\'єкта</th>  <!-- Додано новий стовпець -->
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
                    const taxRate = selectedTable === 'water' ? parseFloat(row['ставка_за_викиди_в_водойми']) || 0 : parseFloat(row['ставка_за_викиди_в_повітря']) || 0;
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

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.backgroundColor = color;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);

    setTimeout(() => {
        notification.remove();
    }, 2500);
}

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
            throw new Error('Network error');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data successfully added:', data);
        document.getElementById('fetch-data').click();
        document.getElementById('add-data-form').reset();
        showNotification("Запис було успішно додано!", "green");
    })
    .catch(error => {
        console.error('Error adding data:', error);
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
                    throw new Error('Network error');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data successfully deleted:', data);
                document.getElementById('fetch-data').click();
                showNotification("Запис було успішно видалено!", "red");
            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const selectedTable = document.getElementById('table-select').value;
            const url = selectedTable === 'water' ? `http://localhost:3005/data/water/${id}` : `http://localhost:3005/data/air/${id}`;

            const newRecord = {
                objectName: prompt('Введіть id нового об\'єкту:'),
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
                showNotification("Запис було успішно відредаговано!", "yellow");
            })
            .catch(error => {
                console.error('Помилка при редагуванні даних:', error);
            });
        });
    });
}
