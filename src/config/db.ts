
import {Pool} from 'pg'
import config from '.'
export const pool = new Pool({
    connectionString: config.db_url
})

const initDB = async()=>{

}

export default initDB;
