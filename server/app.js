const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
    origin: '*',  // Дозволяє запити з будь-якого домену
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
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

app.post('/save-emissions', (req, res) => {
    const {
        enterprise,
        substance,
        year,
        rBi,
        rBnorm,
        qv,
        T,
        mass,
        minimumWage,
        GDK,
        populationSize,
        economicImportance,
        annualConcentration,
        result
    } = req.body;

    const query = `INSERT INTO emissions_data (
        enterprise, substance, year, rBi, rBnorm, qv, T, mass, 
        minimumWage, GDK, populationSize, economicImportance, annualConcentration, result
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [enterprise, substance, year, rBi, rBnorm, qv, T, mass, 
        minimumWage, GDK, populationSize, economicImportance, annualConcentration, result];
    
    executeQuery(res, query, params);
});

app.post('/save-dani-water', (req, res) => {
    // Логування отриманих даних
    console.log('Отримано дані:', req.body); 

    const { enterprise, K_cat, K_R, m, year, result } = req.body;

    // Перевірка на валідність даних
    if (!enterprise || !K_cat || !K_R || !m || !year || !result) {
        return res.status(400).json({ message: 'Всі поля повинні бути заповнені!' });
    }

    const query = `INSERT INTO calculations (enterprise, K_cat, K_R, m, year, result) VALUES (?, ?, ?, ?, ?, ?)`;

    pool.query(query, [enterprise, K_cat, K_R, m, year, result], (err, result) => {
        if (err) {
            console.error('Помилка при виконанні запиту:', err);
            return res.status(500).json({ error: 'Помилка при виконанні запиту', details: err.message });
        }
        res.status(200).json({ message: 'Дані успішно збережені' });
    });
});

app.post('/data/emergency-damage', (req, res) => {
    const { Mi, Sp, Kneb, Kv, Kmp, Kpp, result, object, enterprise } = req.body;
  
    if (isNaN(Mi) || isNaN(Sp) || isNaN(Kneb) || isNaN(Kv) || isNaN(Kmp) || isNaN(Kpp) || isNaN(result) || isNaN(object) || !enterprise) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }
  
    const query = 'INSERT INTO emergency_damage (Mi, Sp, Kneb, Kv, Kmp, Kpp, result, object, enterprise) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    pool.execute(query, [Mi, Sp, Kneb, Kv, Kmp, Kpp, result, object, enterprise], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      res.status(200).json({ success: true, result: result });
    });
});
  
  app.post('/data/water-damage', (req, res) => {
    const { K_cat, K_r, K_3, result } = req.body;

    if (isNaN(K_cat) || isNaN(K_r) || isNaN(K_3) || isNaN(result)) {
        return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    const query = 'INSERT INTO water_damage (K_cat, K_r, K_3, result) VALUES (?, ?, ?, ?)';
    pool.execute(query, [K_cat, K_r, K_3, result], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, result: result });
    });
});

app.post('/data/soil-damage', (req, res) => {
    const { A, NPZ, PD, KN, Ko, Vr, result } = req.body;

    console.log('Received data:', { A, NPZ, PD, KN, Ko, Vr, result });

    if (isNaN(A) || isNaN(NPZ) || isNaN(PD) || isNaN(KN) || isNaN(Ko) || isNaN(Vr) || isNaN(result)) {
        return res.status(400).json({ success: false, message: 'Invalid input data, ensure all fields are filled with valid numbers.' });
    }

    const query = 'INSERT INTO soil_damage (A, NPZ, PD, KN, Ko, Vr, result) VALUES (?, ?, ?, ?, ?, ?, ?)';
    pool.execute(query, [A, NPZ, PD, KN, Ko, Vr, result], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, result: result });
    });
});

app.post('/data/reclamation-cost', (req, res) => {
    const { C1, C2, Kc, result } = req.body;

    console.log('Received reclamation cost data:', { C1, C2, Kc, result });

    if (isNaN(C1) || isNaN(C2) || isNaN(Kc) || isNaN(result)) {
        return res.status(400).json({ success: false, message: 'Invalid input data, ensure all fields are filled with valid numbers.' });
    }

    const query = 'INSERT INTO reclamation_cost (C1, C2, Kc, result) VALUES (?, ?, ?, ?)';
    pool.execute(query, [C1, C2, Kc, result], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, result: result });
    });
});

app.post('/data/damage-yi', (req, res) => {
    const { Y_N, I, result } = req.body;

    console.log('Received damage calculation data:', { Y_N, I, result });

    if (isNaN(Y_N) || isNaN(I) || isNaN(result) || Y_N <= 0 || I <= 0 || result <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid input data, ensure all fields are filled with valid numbers greater than zero.' });
    }

    const query = 'INSERT INTO damage_yi (Y_N, I, result) VALUES (?, ?, ?)';
    pool.execute(query, [Y_N, I, result], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, result: result });
    });
});

app.post('/data/damage-y', (req, res) => {
    const { Y, A, result } = req.body;

    console.log('Received data:', { Y, A, result });

    if (isNaN(Y) || isNaN(A) || isNaN(result)) {
        return res.status(400).json({ success: false, message: 'Invalid input data, ensure all fields are filled with valid numbers.' });
    }

    const query = 'INSERT INTO damage_y (Y, A, result) VALUES (?, ?, ?)';
    pool.execute(query, [Y, A, result], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, result: result });
    });
});

app.post('/data/ai', (req, res) => {
    const { MAC_i, Ai } = req.body;
  
    console.log('Received data:', { MAC_i, Ai });
  
    if (isNaN(MAC_i) || isNaN(Ai)) {
      return res.status(400).json({ success: false, message: 'Invalid input data, ensure all fields are filled with valid numbers.' });
    }
  
    const query = 'INSERT INTO ai_calculation (MAC_i, result) VALUES (?, ?)';
    pool.execute(query, [MAC_i, Ai], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      res.status(200).json({ success: true, result: Ai });
    });
  });
  
app.listen(3005, () => {
    console.log('Сервер працює на порті 3005');
});