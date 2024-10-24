const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const executeQuery = (res, query, params = []) => {
    pool.execute(query, params, (error, results) => {
        if (error) {
            console.error('Помилка при виконанні запиту:', error);
            res.status(500).json({ error: 'Помилка при виконанні запиту' });
        } else {
            res.json(results);
        }
    });
};

app.get('/data/water', (req, res) => {
    const query = 'SELECT * FROM water_emissions';
    executeQuery(res, query);
});

app.get('/data/air', (req, res) => {
    const query = 'SELECT * FROM air_emissions';
    executeQuery(res, query);
});

app.post('/data/water', (req, res) => {
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'INSERT INTO water_emissions (id_обєкта, назва_забруд_речовини, обєм_викидів_тонн, ставка_за_викиди_в_водойми, Рік) VALUES (?, ?, ?, ?, ?)';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year]);
});

app.post('/data/air', (req, res) => {
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'INSERT INTO air_emissions (id_обєкту, назва_забруд_речовини, обєм_викидів_тонн, ставка_за_викиди_в_повітря, Рік) VALUES (?, ?, ?, ?, ?)';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year]);
});

app.delete('/data/water/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM water_emissions WHERE id = ?';
    executeQuery(res, query, [id]);
});

app.delete('/data/air/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM air_emissions WHERE id = ?';
    executeQuery(res, query, [id]);
});

app.put('/data/water/:id', (req, res) => {
    const { id } = req.params;
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'UPDATE water_emissions SET id_обєкта = ?, назва_забруд_речовини = ?, обєм_викидів_тонн = ?, ставка_за_викиди_в_водойми = ?, Рік = ? WHERE id = ?';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year, id]);
});

app.put('/data/air/:id', (req, res) => {
    const { id } = req.params;
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'UPDATE air_emissions SET id_обєкту = ?, назва_забруд_речовини = ?, обєм_викидів_тонн = ?, ставка_за_викиди_в_повітря = ?, Рік = ? WHERE id = ?';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year, id]);
});

app.listen(3005, () => {
    console.log('Сервер працює на порті 3005');
});
