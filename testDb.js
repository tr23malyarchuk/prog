const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecolog'
});

db.connect((err) => {
    if (err) {
        console.error('Помилка підключення до бази даних:', err);
        return;
    }
    console.log('Підключено до бази даних');

    db.query('SELECT * FROM Викиди_в_атмосферне_повітря', (err, results) => {
        if (err) {
            console.error('Помилка запиту:', err);
            return;
        }
        console.log('Результати запиту:', results);
        db.end(); 
    });
});
