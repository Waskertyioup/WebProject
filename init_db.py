import sqlite3

DB_NAME = "database.db"

def create_schema(cursor):
    cursor.executescript("""
    DROP TABLE IF EXISTS clubs;
    DROP TABLE IF EXISTS disciplines;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS communes;
    DROP TABLE IF EXISTS regions;
    DROP TABLE IF EXISTS countries;

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
        name TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        FOREIGN KEY(category_id) REFERENCES categories(id)
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
        discipline_id INTEGER,

        adults BOOLEAN,
        kids BOOLEAN,

        FOREIGN KEY(country_id) REFERENCES countries(id),
        FOREIGN KEY(region_id) REFERENCES regions(id),
        FOREIGN KEY(commune_id) REFERENCES communes(id),
        FOREIGN KEY(discipline_id) REFERENCES disciplines(id)
    );
    """)

def seed_data(cursor):

    # Countries
    cursor.execute("INSERT INTO countries (name) VALUES ('Chile')")
    cursor.execute("INSERT INTO countries (name) VALUES ('Argentina')")

    # Regions
    cursor.execute("INSERT INTO regions (name, country_id) VALUES ('Metropolitana', 1)")
    cursor.execute("INSERT INTO regions (name, country_id) VALUES ('Valparaíso', 1)")

    # Communes
    cursor.execute("INSERT INTO communes (name, region_id) VALUES ('Santiago', 1)")
    cursor.execute("INSERT INTO communes (name, region_id) VALUES ('Providencia', 1)")
    cursor.execute("INSERT INTO communes (name, region_id) VALUES ('Viña del Mar', 2)")

    # Categories
    cursor.execute("INSERT INTO categories (name) VALUES ('Físico')")
    cursor.execute("INSERT INTO categories (name) VALUES ('Mental')")
    cursor.execute("INSERT INTO categories (name) VALUES ('Espiritual')")

    # Disciplines
    cursor.execute("INSERT INTO disciplines (name, category_id) VALUES ('Karate', 1)")
    cursor.execute("INSERT INTO disciplines (name, category_id) VALUES ('Taekwondo', 1)")
    cursor.execute("INSERT INTO disciplines (name, category_id) VALUES ('Judo', 1)")
    cursor.execute("INSERT INTO disciplines (name, category_id) VALUES ('Yoga', 3)")
    cursor.execute("INSERT INTO disciplines (name, category_id) VALUES ('Meditación', 3)")

    # Clubs
    cursor.execute("""
        INSERT INTO clubs 
        (title, subtitle, schedule, image_url, country_id, region_id, commune_id, discipline_id, adults, kids)
        VALUES 
        ('Karate Santiago Centro', 'Av. Siempre Viva 123', 'Lun-Vie 11:00-15:00',
        'https://picsum.photos/300/210',
        1,1,1,1,1,1)
    """)


    cursor.execute("""
        INSERT INTO clubs 
        (title, subtitle, schedule, image_url, country_id, region_id, commune_id, discipline_id, adults, kids)
        VALUES 
        ('Taekwondo Santiago Centro', 'Av. Siempre Viva 123', 'Lun-Vie 19:00-22:00',
        'https://picsum.photos/300/221',
        1,1,1,2,1,1)
    """)

    cursor.execute("""
        INSERT INTO clubs 
        (title, subtitle, schedule, image_url, country_id, region_id, commune_id, discipline_id, adults, kids)
        VALUES 
        ('Taekwon Dododo', 'Monjitas 323', 'Lun-Vie 20:00-21:00',
        'https://picsum.photos/300/231',
        1,1,1,2,1,1)
    """)


    cursor.execute("""
        INSERT INTO clubs 
        (title, subtitle, schedule, image_url, country_id, region_id, commune_id, discipline_id, adults, kids)
        VALUES 
        ('Yoga Do - Centro', 'San Diego 053', 'Lun-Vie 9:00-20:00',
        'https://picsum.photos/300/222',
        1,1,1,
        4,1,1)
    """)

    cursor.execute("""
        INSERT INTO clubs 
        (title, subtitle, schedule, image_url, country_id, region_id, commune_id, discipline_id, adults, kids)
        VALUES 
        ('Taekwondo Providencia', 'Los Leones 456', 'Lun-Sab 10:00-18:00',
        'https://picsum.photos/300/211',
        1,1,2,2,1,1)
    """)

def main():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    create_schema(cursor)
    seed_data(cursor)
    conn.commit()
    conn.close()
    print("Database created successfully.")

if __name__ == "__main__":
    main()