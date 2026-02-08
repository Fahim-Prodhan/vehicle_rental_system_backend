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

};

export default initDB;
