let chemicals = [];

function addChemical() {
    const name = document.getElementById("chemical-name2").value; // Просто отримуємо значення з select без .trim()
    const hq = parseFloat(document.getElementById("hq-value").value.trim());

    console.log("Name:", name);  // Перевірка на консоль
    console.log("HQ:", hq);  // Перевірка на консоль

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
    const HI = chemicals.reduce((sum, chemical) => sum + chemical.hq, 0);
    document.getElementById("result").textContent = `Індекс небезпеки (HI): ${HI.toFixed(2)}`;
}

// Додавання слухача події на зміни в select
document.getElementById("chemical-name2").addEventListener("change", function() {
    const name = this.value.trim();
    if (name !== "Оберіть хімічну речовину") {
        console.log("Вибрано: " + name); // Перевірка, чи вибрано значення
    }
});
