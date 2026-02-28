const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

/* ===========================
   UBICACIÓN
=========================== */

app.get("/countries", (req, res) => {
    db.all("SELECT * FROM countries", [], (err, rows) => {
        res.json(rows);
    });
});

app.get("/regions/:countryId", (req, res) => {
    db.all(
        "SELECT * FROM regions WHERE country_id = ?",
        [req.params.countryId],
        (err, rows) => res.json(rows)
    );
});

app.get("/communes/:regionId", (req, res) => {
    db.all(
        "SELECT * FROM communes WHERE region_id = ?",
        [req.params.regionId],
        (err, rows) => res.json(rows)
    );
});

/* ===========================
   CATEGORÍAS Y DISCIPLINAS
=========================== */

app.get("/categories", (req, res) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        res.json(rows);
    });
});

app.get("/disciplines/:categoryId", (req, res) => {
    db.all(
        "SELECT * FROM disciplines WHERE category_id = ?",
        [req.params.categoryId],
        (err, rows) => res.json(rows)
    );
});

/* ===========================
   BUSQUEDA
=========================== */

app.post("/clubs/search", (req, res) => {

    const { category, disciplines, country, region, commune, adults, kids } = req.body;

    let query = `
        SELECT clubs.*, 
               disciplines.name as discipline_name,
               categories.name as category_name
        FROM clubs
        JOIN disciplines ON clubs.discipline_id = disciplines.id
        JOIN categories ON disciplines.category_id = categories.id
        WHERE 1=1
    `;

    let params = [];

    if (category) {
        query += " AND disciplines.category_id = ?";
        params.push(category);
    }

    if (disciplines && disciplines.length > 0) {
        const placeholders = disciplines.map(() => "?").join(",");
        query += ` AND clubs.discipline_id IN (${placeholders})`;
        params.push(...disciplines);
    }

    if (country) {
        query += " AND clubs.country_id = ?";
        params.push(country);
    }

    if (region) {
        query += " AND clubs.region_id = ?";
        params.push(region);
    }

    if (commune) {
        query += " AND clubs.commune_id = ?";
        params.push(commune);
    }

    if (adults && !kids) {
        query += " AND clubs.adults = 1";
    }

    if (kids && !adults) {
        query += " AND clubs.kids = 1";
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});