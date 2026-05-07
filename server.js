const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Zmieniona nazwa bazy danych na 'serwis'
const db = mysql.createConnection({
    host: 'mysql-serwis.alwaysdata.net',
    user: 'serwis',
    password: 'QAZwsx123!@#', 
    database: 'serwis_admin'
});

db.connect(err => {
    if (err) throw err;
    console.log('Połączono z bazą danych MySQL (baza: serwis).');
});

// 1. GET - Wyświetlanie całej tabeli
app.get('/api/tickets', (req, res) => {
    // Zmieniona nazwa tabeli na 'zgloszenie'
    db.query('SELECT * FROM zgloszenie', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// 2. GET - Detale jednego rekordu
app.get('/api/tickets/:id', (req, res) => {
    db.query('SELECT * FROM zgloszenie WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

// 3. POST - Dodawanie rekordu
app.post('/api/tickets', (req, res) => {
    // Zmienione nazwy zmiennych odbieranych z formularza
    const { imie, model, opis_usterki, status } = req.body;
    const sql = 'INSERT INTO zgloszenie (imie, model, opis_usterki, status) VALUES (?, ?, ?, ?)';
    db.query(sql, [imie, model, opis_usterki, status || 'Oczekujące'], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, message: 'Dodano pomyślnie' });
    });
});

// 4. PUT - Edycja rekordu
app.put('/api/tickets/:id', (req, res) => {
    const { imie, model, opis_usterki, status } = req.body;
    const sql = 'UPDATE zgloszenie SET imie = ?, model = ?, opis_usterki = ?, status = ? WHERE id = ?';
    db.query(sql, [imie, model, opis_usterki, status, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Zaktualizowano pomyślnie' });
    });
});

// 5. DELETE - Usuwanie rekordu
app.delete('/api/tickets/:id', (req, res) => {
    db.query('DELETE FROM zgloszenie WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Usunięto pomyślnie' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer API działa na porcie ${PORT}`);
});