 // Функція для перемикання видимості секції
 function toggleSection(sectionId) {
    const form = document.getElementById(sectionId); // Використовуємо змінну sectionId
    
    // Перевірка на існування елемента
    if (form) {
        // Якщо вибрана секція є активною, показуємо/ховаємо форму
        if (form.classList.contains('hidden')) {
            form.classList.remove('hidden'); // Показати форму
        } else {
            form.classList.add('hidden'); // Сховати форму
        }
    } else {
        console.error('Елемент з ID ' + sectionId + ' не знайдено');
    }
}
function calculateMi() {
    const rBi = parseFloat(document.getElementById('rBi').value);
    const rBnorm = parseFloat(document.getElementById('rBnorm').value);
    const qv = parseFloat(document.getElementById('qv').value);
    const T = parseFloat(document.getElementById('T').value);

    if (isNaN(rBi) || isNaN(rBnorm) || isNaN(qv) || isNaN(T)) {
        alert('Будь ласка, введіть всі необхідні дані.');
        return;
    }

    const mi = 3.6e-6 * (rBi - rBnorm) * qv * T;
    document.getElementById('result').innerText = mi.toFixed(6);
}

function saveData_about_m_atmos() {
    const production = document.getElementById('production').value;
    const substance = document.getElementById('substance').value;
    const rBi = parseFloat(document.getElementById('rBi').value);
    const rBnorm = parseFloat(document.getElementById('rBnorm').value);
    const qv = parseFloat(document.getElementById('qv').value);
    const T = parseFloat(document.getElementById('T').value);
    const year = parseInt(document.getElementById('year').value);
    const mi = parseFloat(document.getElementById('result').innerText);

    if (isNaN(rBi) || isNaN(rBnorm) || isNaN(qv) || isNaN(T) || isNaN(year) || isNaN(mi)) {
        alert('Будь ласка, введіть всі необхідні дані.');
        return;
    }

    const data = {
        production,
        substance,
        rBi,
        rBnorm,
        qv,
        T,
        year,
        mi
    };

    fetch('http://localhost:3006/saveData_about_m_atmos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Data saved successfully:', result);
        showNotification('Дані успішно збережено!', 'green');
    })
    .catch(error => {
        console.error('Error saving data:', error);
        showNotification('Помилка при збереженні даних.', 'red');
    });
}
function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.backgroundColor = color;
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.zIndex = '1000';
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000); // Сповіщення буде зникати через 3 секунди
}
function calculateMi() {
    const rBi = parseFloat(document.getElementById('rBi').value);
    const rBnorm = parseFloat(document.getElementById('rBnorm').value);
    const qv = parseFloat(document.getElementById('qv').value);
    const T = parseFloat(document.getElementById('T').value);

    if (isNaN(rBi) || isNaN(rBnorm) || isNaN(qv) || isNaN(T)) {
        alert('Будь ласка, введіть всі необхідні дані.');
        return;
    }

    const mi = 3.6e-6 * (rBi - rBnorm) * qv * T;
    document.getElementById('result').innerText = mi.toFixed(6);
}
