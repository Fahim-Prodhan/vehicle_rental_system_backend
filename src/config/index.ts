import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    db_url:process.env.DB_URL,
    secret_key:process.env.SECRET_KEY,
    port:process.env.PORT
}

export default config;