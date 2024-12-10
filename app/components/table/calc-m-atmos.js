function toggleSection(sectionId) {
    const form = document.getElementById('emissionForm');
    
    // Перевіряємо, чи форма вже видима
    if (form.classList.contains('hidden')) {
        // Якщо форма схована, показуємо її
        form.classList.remove('hidden');
    } else {
        // Якщо форма вже відкрита, ховаємо її
        form.classList.add('hidden');
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

function saveData() {
    const production = document.getElementById('production').value;
    const substance = document.getElementById('substance').value;
    const rBi = parseFloat(document.getElementById('rBi').value);
    const rBnorm = parseFloat(document.getElementById('rBnorm').value);
    const qv = parseFloat(document.getElementById('qv').value);
    const T = parseFloat(document.getElementById('T').value);
    const year = parseInt(document.getElementById('year').value);
    const mi = 3.6e-6 * (rBi - rBnorm) * qv * T;

    if (!production || !substance || isNaN(rBi) || isNaN(rBnorm) || isNaN(qv) || isNaN(T) || isNaN(year)) {
        alert('Будь ласка, введіть всі необхідні дані.');
        return;
    }

    const formData = new FormData();
    formData.append('production', production);
    formData.append('substance', substance);
    formData.append('rBi', rBi);
    formData.append('rBnorm', rBnorm);
    formData.append('qv', qv);
    formData.append('T', T);
    formData.append('year', year);
    formData.append('mi', mi);

    fetch('../../server/PHP/save_data_lab4.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Помилка:', error));
}