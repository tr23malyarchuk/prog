function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(tabId).classList.add('active-tab');
}

function sortTable(columnIndex, ascending = true) {
    const table = document.getElementById('data-table');
    const rows = Array.from(table.rows).slice(1); 
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return ascending ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });
    rows.forEach(row => table.appendChild(row)); 
}

function searchTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#data-table tr:not(:first-child)'); 

    rows.forEach(row => {
        const cells = Array.from(row.cells);
        const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
        row.style.display = rowText.includes(searchInput) ? '' : 'none'; 
    });
}

document.getElementById('search-input').addEventListener('input', searchTable);
document.getElementById('sort-asc-btn').addEventListener('click', () => sortTable(1, true)); 
document.getElementById('sort-desc-btn').addEventListener('click', () => sortTable(1, false)); 

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

function calculateTaxRate(pollutantName) {
    const pollutantTaxRates = {
        'Азоту оксид': 2574.43,
        'Аміак': 482.84,
        'Ангідрид сірчистий': 2574.43,
        'Ацетон': 965.67,
        'Бензопірен': 3277278.63,
        'Бутилацетат': 579.84,
        'Ванадію п’ятиокис': 9656.78,
        'Водень хлористий': 96.99,
        'Вуглецю окис': 96.99,
        'Вуглеводні': 145.50,
        'Газоподібні фтористі сполуки': 6373.91,
        'Тверді речовини': 96.99,
        'Кадмій': 20376.22,
        'Марганець': 20376.22,
        'Нікель': 103816.62,
        'Озон': 2574.43,
        'Ртуть': 109127.84,
        'Свинець': 109127.84,
        'Сірководень': 8273.63,
        'Сірковуглець': 5376.59,
        'Спирт': 2574.43,
        'Стирол': 18799.08,
        'Фенол': 11685.10,
        'Хром': 69113.38,
        'Азот амонійний': 12883.84,
        'БСК 5': 5156.8,
        'Завислі речовини': 369.52,
        'Нафтопродукти': 75792.4,
        'Нітрати': 1108.56,
        'Нітрити': 63278.16,
        'Сульфати': 369.52,
        'Фосфати': 10297.44,
        'Хлориди': 369.52
    };

    // Перевіряємо чи є ставка податку для заданої речовини
    if (pollutantName in pollutantTaxRates) {
        return pollutantTaxRates[pollutantName];
    }

    // Якщо ставка не знайдена, повертаємо 0
    return 0;
}

function getTaxRateByHazardClass(hazardClass) {
    if (hazardClass) {
        switch (parseInt(hazardClass, 10)) {
            case 1:
                return 18413.24; // Клас I
            case 2:
                return 4216.92; // Клас II
            case 3:
                return 628.32; // Клас III
            case 4:
                return 145.50; // Клас IV
            default:
                return 0; // Невідомий клас небезпеки
        }
    }

    return 0; // Якщо клас небезпеки не вказано
}


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


document.getElementById('pollutant-name').addEventListener('change', (event) => { 
    console.log("Pollutant selected:", event.target.value); // Для перевірки, що подія спрацьовує
    const customPollutantField = document.getElementById('custom-pollutant-name');
    const hazardClassLabel = document.getElementById('hazard-class-label');
    const hazardClassSelect = document.getElementById('hazard-class');

    const selectedTable = document.getElementById('table-select1').value;

    if (event.target.value === 'custom' && selectedTable === 'air') {
        console.log("Custom pollutant selected, showing additional fields"); // Для перевірки
        customPollutantField.style.display = 'block';
        hazardClassLabel.style.display = 'block';
        hazardClassSelect.style.display = 'block';
    } else {
        customPollutantField.style.display = 'block';
        hazardClassLabel.style.display = 'none';
        hazardClassSelect.style.display = 'none';
    }
});

// Обробка форми на відправку даних
document.getElementById('add-data-form').addEventListener('submit', (event) => {
    event.preventDefault();

    console.log("Form submitted");

    const selectedPollutant = document.getElementById('pollutant-name').value;
    const pollutantName = selectedPollutant === 'custom' 
        ? document.getElementById('custom-pollutant-name').value 
        : selectedPollutant;

        let hazardClass = selectedPollutant === 'custom' 
        ? document.getElementById('hazard-class').value 
        : null;

    console.log("Pollutant:", pollutantName);
    console.log("Hazard Class:", hazardClass);

    const selectedTable = document.getElementById('table-select1').value;
    console.log("Selected Table:", selectedTable);

    if (selectedTable === 'air' && !hazardClass && selectedPollutant === 'custom') {
        showNotification("Поле 'Клас небезпеки' є обов'язковим для таблиці повітря.", "red");
        return;
    }

    if (selectedTable === 'water') {
        hazardClass = null;
    }

    const taxRate = calculateTaxRate(pollutantName, hazardClass);

    const newRecord = {
        objectName: document.getElementById('object-name').value,
        pollutantName: pollutantName,
        emissionVolume: document.getElementById('emission-volume').value,
        taxRate: taxRate,
        year: document.getElementById('year').value
    };

    console.log("New Record:", newRecord);

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
        updateTableWithNewRecord(data);
        document.getElementById('add-data-form').reset();
        showNotification("Запис було успішно додано!", "green");

        document.getElementById('custom-pollutant-name').style.display = 'none';
        document.getElementById('hazard-class-label').style.display = 'none';
        document.getElementById('hazard-class').style.display = 'none';
    })
    .catch(error => {
        console.error('Error adding data:', error);
    });
});

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

// Функція для оновлення таблиці з новим записом
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
// Функція для згортування та розгортання розділів
function toggleSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}

// Функція для відкриття форми для додавання запису
function toggleAddRecordForm() {
    var form = document.getElementById("add-record-form");
    if (form.style.display === "none") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
    }
}
