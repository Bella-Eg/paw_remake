// File: app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database initialization
const db = new sqlite3.Database('./shelter.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// API to fetch animal information by ID
app.get('/api/animals/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM animals WHERE id = ?';
    db.get(query, [id], (err, row) => {
        if (err) {
            res.status(500).send('Error retrieving animal data.');
        } else {
            res.json(row);
        }
    });
});

// API to update animal information
app.put('/api/animals/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, sex, breed, weight, height, description, adoption_type, health_details, photo_link } = req.body;

    const query = `
        UPDATE animals
        SET name = ?, age = ?, sex = ?, breed = ?, weight = ?, height = ?, description = ?, 
            adoption_type = ?, health_details = ?, photo_link = ?
        WHERE id = ?
    `;
    db.run(query, [name, age, sex, breed, weight, height, description, adoption_type, health_details, photo_link, id], function(err) {
        if (err) {
            res.status(500).send('Error updating animal data.');
        } else {
            res.send({ message: 'Animal information updated successfully.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
