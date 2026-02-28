CREATE TABLE countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country_id INTEGER NOT NULL,
    FOREIGN KEY(country_id) REFERENCES countries(id)
);

CREATE TABLE communes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id INTEGER NOT NULL,
    FOREIGN KEY(region_id) REFERENCES regions(id)
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE disciplines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    schedule TEXT,
    image_url TEXT,

    country_id INTEGER,
    region_id INTEGER,
    commune_id INTEGER,

    category_id INTEGER,
    discipline_id INTEGER,

    adults BOOLEAN,
    kids BOOLEAN,

    FOREIGN KEY(country_id) REFERENCES countries(id),
    FOREIGN KEY(region_id) REFERENCES regions(id),
    FOREIGN KEY(commune_id) REFERENCES communes(id),
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(discipline_id) REFERENCES disciplines(id)
);