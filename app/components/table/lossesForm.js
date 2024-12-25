 // Функція для перемикання видимості секції
 function toggleSection(sectionId) {
    const form = document.getElementById(sectionId);
    if (form) {
        form.classList.toggle('hidden');
    } else {
        console.error('Елемент з ID ' + sectionId + ' не знайдено');
    }
}



function calculateLossesAndSave() {
    // Викликаємо функцію для розрахунку
    calculateLosses();
    
    // Потім викликаємо функцію для збереження даних
    submitForm();
}
function submitForm() {
    const formData = {
        enterprise: document.getElementById('enterprise').value,
        substance: document.getElementById('substance').value,
        year: document.getElementById('year2').value,
        rBi: parseFloat(document.getElementById('rBi').value),
        rBnorm: parseFloat(document.getElementById('rBnorm').value),
        qv: parseFloat(document.getElementById('qv').value),
        T: parseFloat(document.getElementById('T').value),
        mass: parseFloat(document.getElementById('mass').value),
        minimumWage: parseFloat(document.getElementById('minimumWage').value),
        GDK: parseFloat(document.getElementById('GDK').value),
        populationSize: document.getElementById('populationSize').value,
        economicImportance: document.getElementById('economicImportance').value,
        annualConcentration: parseFloat(document.getElementById('annualConcentration').value),
        result: parseFloat(document.getElementById('lossResult').innerText.replace('Розмір відшкодувань: ', ''))
    };

    fetch('http://localhost:3005/save-emissions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        // Оновлене повідомлення
        alert('Дані успішно збережені');
    })
    .catch(error => {
        console.error('Помилка:', error);
        alert('Помилка при відправці даних');
    });
}

function calculateMi() {
    // Отримуємо значення з полів
    let rBi = parseFloat(document.getElementById('rBi').value);
    let rBnorm = parseFloat(document.getElementById('rBnorm').value);
    let qv = parseFloat(document.getElementById('qv').value);
    let T = parseFloat(document.getElementById('T').value);

    // Перевіряємо, чи введено всі необхідні значення
    if (isNaN(rBi) || isNaN(rBnorm) || isNaN(qv) || isNaN(T)) {
        document.getElementById('mass').value = "";
        return;
    }

    // Розрахунок маси наднормативного викиду
    
    let mass = 3.6e-6 * (rBi - rBnorm) * qv * T;
    // Виведення результату
    document.getElementById('mass').value = mass.toFixed(2);
}

function calculateLosses() {
    // Отримуємо значення з форми
    let mass = parseFloat(document.getElementById('mass').value);
    let minimumWage = parseFloat(document.getElementById('minimumWage').value);
    let GDK = parseFloat(document.getElementById('GDK').value);
    let populationSize = document.getElementById('populationSize').value;
    let economicImportance = document.getElementById('economicImportance').value;
    let annualConcentration = parseFloat(document.getElementById('annualConcentration').value);

    // Перевіряємо, чи введено всі необхідні значення
    if (isNaN(mass) || isNaN(minimumWage) || isNaN(GDK) || isNaN(annualConcentration)) {
        document.getElementById('lossResult').innerText = "Будь ласка, заповніть всі числові поля!";
        return;
    }

    // Перевірка вибору чисельності населення
    if (populationSize === "" || economicImportance === "") {
        document.getElementById('lossResult').innerText = "Будь ласка, виберіть чисельність населення та народногосподарське значення!";
        return;
    }

    // Коэффициент в залежності від чисельності населення
    let populationCoefficient;
    switch (populationSize) {
        case "100":
            populationCoefficient = 1.00;
            break;
        case "250":
            populationCoefficient = 1.20;
            break;
        case "500":
            populationCoefficient = 1.35;
            break;
        case "1000":
            populationCoefficient = 1.55;
            break;
        case "1000+":
            populationCoefficient = 1.80;
            break;
        default:
            populationCoefficient = 1.00;
            break;
    }

    // Коэффициент в залежності від типу населеного пункту
    let economicImportanceCoefficient;
    switch (economicImportance) {
        case "local":
            economicImportanceCoefficient = 1.00;
            break;
        case "industrial":
            economicImportanceCoefficient = 1.25;
            break;
        case "resort":
            economicImportanceCoefficient = 1.65;
            break;
        default:
            economicImportanceCoefficient = 1.00;
            break;
    }

    // Розрахунок розміру відшкодувань
    let compensation = mass * (1.1 * minimumWage) * (1 / GDK) * (populationCoefficient * economicImportanceCoefficient) * (annualConcentration / GDK);
    
    // Виведення результату
    document.getElementById('lossResult').innerText = "Розмір відшкодувань: " + compensation.toFixed(2) + " грн";
}
function updateMinimumWage() {
    const year = document.getElementById('year2').value; // отримуємо значення вибраного року
    let minimumWage;

    console.log("Selected Year: " + year);  // Це допоможе вам переконатися, що значення вибрано

    switch (year) {
        case "2024":
            minimumWage = 8000;
            break;
        case "2023":
        case "2022":
            minimumWage = 6700;
            break;
        case "2021":
            minimumWage = 6500;
            break;
        case "2020":
            minimumWage = 5000;
            break;
        default:
            minimumWage = 0; // Значення за замовчуванням
    }

    // Встановлюємо значення в поле мінімальної заробітної плати
    document.getElementById('minimumWage').value = minimumWage;
}
  // Функція для оновлення значень на основі вибраної речовини
  function updateConcentrationValues() {
    const substance = document.getElementById("substance").value;
    let GDK, annualConcentration;

    if (substance === "Фенол") {
        GDK = 0.003;
        annualConcentration = 0.7;
    } else if (substance === "Аміак") {
        GDK = 0.04;
        annualConcentration = 0.1;
    } else if (substance === "Пил") {
        GDK = 0.15;
        annualConcentration = 0.3;
    } else if (substance === "Діоксид сірки") {
        GDK = 0.05;
        annualConcentration = 0.02;
    } else if (substance === "Фтористий водень") {
        GDK = 1.3;
        annualConcentration = 0.5;
    } else if (substance === "Хлористий водень") {
        GDK = 0.06;
        annualConcentration = 0.3;
    } else if (substance === "Формальдегід") {
        GDK = 0.007;
        annualConcentration = 2.5;
    } else if (substance === "Залізо") {
        GDK = 0.38;
        annualConcentration = 0.009;
    } else if (substance === "Кадмій") {
        GDK = 0.004;
        annualConcentration = 0.13;
    } else if (substance === "Марагнець") {
        GDK = 0.011;
        annualConcentration = 0.011;
    } else if (substance === "Мідь") {
        GDK = 0.014;
        annualConcentration = 0.007;
    } else {
        // Якщо вибрано іншу речовину, значення можна залишити порожніми або встановити дефолтні значення
        GDK = "";
        annualConcentration = "";
    }

    // Оновлення полів вводу
    document.getElementById("GDK").value = GDK;
    document.getElementById("annualConcentration").value = annualConcentration;
}