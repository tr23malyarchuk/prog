let chemicals = [];

function calculateNonCanceric() {
    const name = document.getElementById("chemical-name2").value;
    const hq = parseFloat(document.getElementById("hq-value").value.trim());

    // Перевірка, чи вибрано ім'я
    if (name === "" || name === "Оберіть хімічну речовину") {
        alert("Будь ласка, виберіть хімічну речовину.");
        return; // Якщо не вибрано, припиняємо виконання функції
    }

    // Перевірка на правильність значення HQ
    if (isNaN(hq) || hq <= 0) {
        alert("Будь ласка, введіть коректне значення для HQ.");
        return; // Якщо HQ некоректне, вивести повідомлення і припинити функцію
    }

    // Перевірка, чи вже існує така хімічна речовина в списку
    const existingChemical = chemicals.find(chemical => chemical.name === name);
    if (existingChemical) {
        alert("Ця хімічна речовина вже додана.");
        return;
    }

    // Якщо все правильно, додаємо хімічну речовину в список
    chemicals.push({ name, hq });
    updateChemicalList();
    document.getElementById("hq-value").value = ''; // Очищаємо поле HQ
}

// Функція для оновлення списку хімічних речовин
function updateChemicalList() {
    const list = document.getElementById("chemical-list");
    list.innerHTML = ''; // Очищаємо список

    chemicals.forEach((chemical) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${chemical.name}: HQ = ${chemical.hq}`;
        list.appendChild(listItem);
    });
}

function calculateHI() {
    if (chemicals.length === 0) {
        alert("Будь ласка, додайте хоча б одну хімічну речовину для розрахунку.");
        return;
    }

    const HI = chemicals.reduce((sum, chemical) => sum + chemical.hq, 0);
    document.getElementById("resulting").textContent = `Індекс небезпеки (HI): ${HI.toFixed(2)}`;
}

// Додавання слухача події на зміни в select
document.getElementById("chemical-name2").addEventListener("change", function() {
    const name = this.value.trim();
    if (name !== "Оберіть хімічну речовину") {
        console.log("Вибрано: " + name); // Перевірка, чи вибрано значення
    }
});