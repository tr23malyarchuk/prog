function toggleSection(sectionId) {
    const form = document.getElementById('emissionForm');
    if (sectionId === 'calc-m-atmos') {
        form.classList.toggle('hidden');
    } else {
        form.classList.add('hidden');
    }
}

function calculateMi() {
    // Ваш код для розрахунку mi
}

function saveData() {
    // Ваш код для збереження даних
}