import { Pool } from "pg";

const pool: Pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
});

async function queryDB(query: string, params?: string[]) {
    const client = await pool.connect();
    try {
        const result = await client.query(query, params);
        return result;
    } finally {
        client.release();
    }
}

export default queryDB;
