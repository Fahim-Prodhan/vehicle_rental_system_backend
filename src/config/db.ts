import { Pool } from "pg";
import config from ".";
export const pool = new Pool({
  connectionString: config.db_url,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE CHECK (email = LOWER(email)),
        password VARCHAR(255) NOT NULL CHECK (length(password)>= 6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(15) NOT NULL CHECK(role IN('admin', 'customer')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
`);

  await pool.query(`
            CREATE TABLE IF NOT EXIST vehicles
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(250) NOT NULL,
            type VARCHAR(10) CHECK(type IN('car', 'bike', 'van', 'SUV')),
            registration_number NOT NULL UNIQUE,
            daily_rent_price NOT NULL CHECK(daily_rent_price > 0),
            daily_rent_price CHECK(daily_rent_price IN('available', 'booked'))
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()

        `);
};

export default initDB;
