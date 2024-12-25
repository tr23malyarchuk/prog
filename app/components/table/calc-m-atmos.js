

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


// Оновлюємо значення I та gamma_i в залежності від вибраного року
function updateValuesForYear() {
    var year = document.getElementById("yearSelect").value;

    // Ваш код для оновлення значень для обраного року
    console.log(year); // Просто для перевірки

    let I, gamma_i;

    switch (year) {
        case '2024':
            I = 105.1;
            gamma_i = 3076.16;
            break;
        case '2023':
            I = 126.6;
            gamma_i = 3076.16;
            break;
        case '2022':
            I = 110.0;
            gamma_i = 2429.83;
            break;
        case '2021':
            I = 105.0;
            gamma_i = 2429.83;
            break;
        default:
            I = 105.1;
            gamma_i = 3076.16;
    }

    // Зберігаємо значення I та gamma_i у глобальні змінні
    window.I = I;
    window.gamma_i = gamma_i;
}

function addPollutantFields() {
    const m = document.getElementById('m').value;
    const container = document.getElementById('pollutants-container');
    
    // Очищаємо попередні поля
    container.innerHTML = '';

    for (let i = 0; i < m; i++) {
        container.innerHTML += `
            <h3>Забруднююча речовина ${i + 1}</h3>
            <label for="M_${i}">Маса наднормативного скиду (М_${i}):</label>
            <input type="number" id="M_${i}" required>

            <label for="substance_${i}">Забруднююча речовина ${i + 1}:</label>
            <select id="substance_${i}" onchange="updateSubstanceGDK(${i})">
                <option value="Аміак">Аміак</option>
                <option value="Пил">Пил</option>
                <option value="Діоксид сірки">Діоксид сірки</option>
                <option value="Фтористий водень">Фтористий водень</option>
                <option value="Хлористий водень">Хлористий водень</option>
                <option value="Формальдегід">Формальдегід</option>
                <option value="Залізо">Залізо</option>
                <option value="Кадмій">Кадмій</option>
                <option value="Марагнець">Марагнець</option>
                <option value="Мідь">Мідь</option>
            </select>

            <label for="GDK_${i}">ГДК (ГДК_${i}):</label>
            <input type="number" id="GDK_${i}" required readonly>
        `;
    }
}

// Оновлення GDK для кожної забруднюючої речовини
function updateSubstanceGDK(i) {
    const substance = document.getElementById(`substance_${i}`).value;
    let GDK;

    if (substance === "Аміак") {
        GDK = 0.04;
    } else if (substance === "Пил") {
        GDK = 0.15;
    } else if (substance === "Діоксид сірки") {
        GDK = 0.05;
    } else if (substance === "Фтористий водень") {
        GDK = 1.3;
    } else if (substance === "Хлористий водень") {
        GDK = 0.06;
    } else if (substance === "Формальдегід") {
        GDK = 0.007;
    } else if (substance === "Залізо") {
        GDK = 0.38;
    } else if (substance === "Кадмій") {
        GDK = 0.004;
    } else if (substance === "Марагнець") {
        GDK = 0.011;
    } else if (substance === "Мідь") {
        GDK = 0.014;
    }

    document.getElementById(`GDK_${i}`).value = GDK;
}

let k = 1.5; // Змінну k потрібно оголосити перед її використанням

// Функція для розрахунку відшкодування
function calculateCompensation() {
    const K_catElement = document.getElementById('K_cat');
    const K_R_Element = document.getElementById('K_R');
    if (!K_catElement || !K_R_Element) {
        console.error('Не знайдені елементи для K_cat або K_R');
        return;
    }

    const K_cat = parseFloat(K_catElement.value);
    const K_R = parseFloat(K_R_Element.value);
    if (isNaN(K_cat) || isNaN(K_R)) {
        console.error('Некоректні значення K_cat або K_R');
        return;
    }

    const m = parseInt(document.getElementById('m').value);
    if (isNaN(m) || m <= 0) {
        console.error('Некоректне значення m');
        return;
    }

    let total = 0;
    for (let i = 0; i < m; i++) {
        const M_i = parseFloat(document.getElementById(`M_${i}`).value);
        const GDK_i = parseFloat(document.getElementById(`GDK_${i}`).value);

        if (isNaN(M_i) || M_i <= 0 || isNaN(GDK_i) || GDK_i <= 0) {
            console.error('Некоректні значення для M_i або GDK_i');
            return;
        }

        const gammaIndex = window.gamma_i * (window.I / 100);
        const A_i = 1 / GDK_i;

        total += M_i * gammaIndex * A_i;
    }

    const compensation = K_cat * K_R * k * total;
    document.getElementById('resultat').innerText = `Розмір відшкодування збитків: ${compensation.toFixed(2)} грн`;
    submitCalculationData(compensation);
}
// Ініціалізація значень при завантаженні сторінки
    updateValuesForYear(); 

    // Функція для зберігання даних
    // Функція для зберігання даних
function submitCalculationData(result) {
    const enterprise = document.getElementById('enterprise').value;
    const K_cat = parseFloat(document.getElementById('K_cat').value);
    const K_R = parseFloat(document.getElementById('K_R').value);
    const m = parseInt(document.getElementById('m').value, 10);
    const year = parseInt(document.getElementById('yearSelect').value, 10);
    
    // Логування для перевірки значень
    console.log('Дані для збереження:', { enterprise, K_cat, K_R, m, year, result });
    
    const formData = {
        enterprise: enterprise,
        K_cat: K_cat,
        K_R: K_R,
        m: m,
        year: year,
        result: result
    };
    
    // Відправка даних на сервер
    fetch('http://localhost:3005/save-dani-water', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(errorText => { throw new Error(errorText); });
        }
        return response.json();
    })
    .then(data => {
        alert('Дані успішно збережені');
    })
    .catch(error => {
        console.error('Помилка:', error.message);
        alert('Помилка при відправці даних');
    });
}
   