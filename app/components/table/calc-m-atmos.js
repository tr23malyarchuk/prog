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

function saveData_about_m_atmos() {
    const formData = {
        production: document.getElementById('production').value,
        substance: document.getElementById('substance').value,
        rBi: document.getElementById('rBi').value,
        rBnorm: document.getElementById('rBnorm').value,
        qv: document.getElementById('qv').value,
        T: document.getElementById('T').value,
        year: document.getElementById('year').value,
        mi: document.getElementById('result').textContent
    };

    fetch('http://localhost:3000/saveData_about_m_atmos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => alert('Дані збережено!'))
    .catch(error => console.error('Помилка при збереженні:', error));
}