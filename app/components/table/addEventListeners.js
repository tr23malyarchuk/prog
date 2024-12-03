function addEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const selectedTable = document.getElementById('table-select').value;
            let url = '';

            if (selectedTable === 'water') {
                url = `http://localhost:3005/data/water/${id}`;
            } else if (selectedTable === 'air') {
                url = `http://localhost:3005/data/air/${id}`;
            } else if (selectedTable === 'air-risk') {
                url = `http://localhost:3005/data/air-risk/${id}`;
            }

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
                document.getElementById('fetch-data').click(); // Reload the data after delete
                showNotification("Запис було успішно видалено!", "red");
            })
            .catch(error => {
                console.error('Error deleting data:', error);
            });
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            const cells = row.querySelectorAll('td');
            row.classList.add('editing');  // Додаємо клас для підсвічування редагованого рядка
    
            const selectedTable = document.getElementById('table-select').value;
            
            // Перетворюємо клітинки на input для редагування в залежності від таблиці
            cells.forEach((cell, index) => {
                if (index > 0 && index < cells.length - 1) { // Не редагуємо ID і кнопки
                    const currentValue = cell.innerText;
                    if (selectedTable === 'air-risk') {
                        // Для таблиці air-risk додаємо всі поля для редагування
                        if (index !== 0) { // Пропускаємо ID
                            cell.innerHTML = `<input type="text" value="${currentValue}" />`;
                        }
                    } else {
                        // Для інших таблиць аналогічно, тільки з іншими полями
                        if (index !== 0) { // Пропускаємо ID
                            cell.innerHTML = `<input type="text" value="${currentValue}" />`;
                        }
                    }
                }
            });
    
            // Додаємо кнопку "Зберегти" після всіх клітинок (в кінці рядка)
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Зберегти';
            saveButton.classList.add('save-btn');
            const actionsCell = row.querySelector('td:last-child'); // Знаходимо клітинку з кнопками
            actionsCell.innerHTML = ''; // Очищаємо попередні кнопки (Редагувати/Видалити)
            actionsCell.appendChild(saveButton); // Додаємо кнопку "Зберегти"
    
            // Обробник для збереження змін
            saveButton.addEventListener('click', () => {
                const updatedRecord = {};
                cells.forEach((cell, index) => {
                    if (index === 1) updatedRecord['id_обєкта'] = cell.querySelector('input').value;
                    if (index === 2) updatedRecord['назва_обєкта'] = cell.querySelector('input').value;
                    if (index === 3) updatedRecord['назва_підприємства'] = cell.querySelector('input').value;
                    if (index === 4) updatedRecord['назва_забруднюючої_речовини'] = cell.querySelector('input').value;
                    if (index === 5) updatedRecord['об\'єм_викидів_тонн'] = cell.querySelector('input').value;
                    if (index === 6) updatedRecord['клас_небезпеки'] = cell.querySelector('input').value;
                    if (index === 7) updatedRecord['критичні_органи_або_системи'] = cell.querySelector('input').value;
                    if (index === 8) updatedRecord['ref_концентрація_мг_м3'] = cell.querySelector('input').value;
                    if (index === 9) updatedRecord['фактор_канцерогенного_потенціалу'] = cell.querySelector('input').value;
                    if (index === 10) updatedRecord['рік'] = cell.querySelector('input').value;
                });
    
                const id = event.target.getAttribute('data-id');
                let url = '';
                if (selectedTable === 'air-risk') {
                    url = `http://localhost:3005/data/air-risk/${id}`;
                } else if (selectedTable === 'water') {
                    url = `http://localhost:3005/data/water/${id}`;
                } else if (selectedTable === 'air') {
                    url = `http://localhost:3005/data/air/${id}`;
                }
    
                fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedRecord),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Мережна помилка');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Дані успішно оновлено:', data);
                    row.classList.remove('editing'); // Видаляємо підсвітку
                    document.getElementById('fetch-data').click(); 
                    showNotification("Запис було успішно відредаговано!", "yellow");
                    
                    // Оновлюємо значення в таблиці
                    cells.forEach((cell, index) => {
                        if (index > 0 && index < cells.length - 1) {
                            const input = cell.querySelector('input');
                            cell.innerHTML = input.value; // Оновлюємо значення в клітинці
                        }
                    });
    
                    // Видаляємо кнопку "Зберегти"
                    saveButton.remove();
                })
                .catch(error => {
                    console.error('Помилка при редагуванні даних:', error);
                });
            });
        });
    });
}
