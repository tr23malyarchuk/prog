const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Kondratets@222#54',
    database: 'ecolog',
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
    const query = 'SELECT * FROM інфа_про_водойми';
    executeQuery(res, query);
});

app.get('/data/air', (req, res) => {
    const query = 'SELECT * FROM інфа_про_повітря';
    executeQuery(res, query);
});

app.get('/data/air-risk', (req, res) => {
    const query = 'SELECT * FROM оцінка_ризику_повітря';
    executeQuery(res, query);
});

app.post('/data/water', (req, res) => { 
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    
    const query = 'INSERT INTO інфа_про_водойми (id_обєкта, назва_забруд_речовини, обєм_викидів_тонн, ставка_за_викиди_в_водойми, Рік) VALUES (?, ?, ?, ?, ?)';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year]);
});

app.post('/data/air', (req, res) => {
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'INSERT INTO інфа_про_повітря (id_обєкта, назва_забруд_речовини, обєм_викидів_тонн, ставка_за_викиди_в_повітря, Рік) VALUES (?, ?, ?, ?, ?)';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year]);
});

app.post('/data/air-risk', (req, res) => {
    const { objectName, pollutantName, emissionVolume, hazardClass, criticalOrgans, referenceConcentration, cancerFactor, year } = req.body;
    const query = 'INSERT INTO оцінка_ризику_повітря (id_обєкта, назва_забруднюючої_речовини, обєм_викидів_тонн, клас_небезпеки, критичні_органи_або_системи, ref_концентрація_мг_м3, фактор_канцерогенного_потенціалу, рік) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, hazardClass, criticalOrgans, referenceConcentration, cancerFactor, year]);
});

app.delete('/data/water/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM інфа_про_водойми WHERE id = ?';
    executeQuery(res, query, [id]);
});

app.delete('/data/air/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM інфа_про_повітря WHERE id = ?';
    executeQuery(res, query, [id]);
});

app.delete('/data/air-risk/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM оцінка_ризику_повітря WHERE id = ?';
    executeQuery(res, query, [id]);
});

app.put('/data/water/:id', (req, res) => {
    const { id } = req.params;
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'UPDATE інфа_про_водойми SET id_обєкта = ?, назва_забруд_речовини = ?, обєм_викидів_тонн = ?, ставка_за_викиди_в_водойми = ?, Рік = ? WHERE id = ?';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year, id]);
});

app.put('/data/air/:id', (req, res) => {
    const { id } = req.params;
    const { objectName, pollutantName, emissionVolume, taxRate, year } = req.body;
    const query = 'UPDATE інфа_про_повітря SET id_обєкта = ?, назва_забруд_речовини = ?, обєм_викидів_тонн = ?, ставка_за_викиди_в_повітря = ?, Рік = ? WHERE id = ?';
    executeQuery(res, query, [objectName, pollutantName, emissionVolume, taxRate, year, id]);
});

app.put('/data/air-risk/:id', (req, res) => {
    const { id } = req.params;
    const { objectName, pollutantName, concentration, hazardClass, criticalOrgans, referenceConcentration, cancerFactor, year } = req.body;
    const query = 'UPDATE оцінка_ризику_повітря SET id_обєкта = ?, назва_забруднюючої_речовини = ?, концентрація_речовини = ?, клас_небезпеки = ?, критичні_органи_або_системи = ?, ref_концентрація_мг_м3 = ?, фактор_канцерогенного_потенціалу = ?, рік = ? WHERE id = ?';
    executeQuery(res, query, [objectName, pollutantName, concentration, hazardClass, criticalOrgans, referenceConcentration, cancerFactor, year, id]);
});

app.get('/data/air-risk', (req, res) => {
    const { object, pollutant, year } = req.query;
    let query = 'SELECT * FROM оцінка_ризику_повітря WHERE обєкт = ?';
    let params = [object];

    if (pollutant) {
        query += ' AND назва_забруднюючої_речовини = ?';
        params.push(pollutant);
    }

    if (year) {
        query += ' AND рік = ?';
        params.push(year);
    }

    pool.execute(query, params, (error, results) => {
        if (error) {
            console.error('Error fetching air risk data:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});


app.post('/saveData_about_m_atmos', (req, res) => {
    const { production, substance, rBi, rBnorm, qv, T, year, mi } = req.body;
    const query = `
        INSERT INTO emissions_atmos_lab4 (production, substance, rBi, rBnorm, qv, T, year, mi)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [production, substance, rBi, rBnorm, qv, T, year, mi];

    executeQuery(res, query, params);
});
app.listen(3006, () => {
    console.log('Сервер працює на порті 3006');
});