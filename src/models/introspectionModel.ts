import queryDB from "../config/db";

export async function getTablesAndViews() {
    const query = `
    SELECT table_name, table_type 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
    `;
    const result = await queryDB(query);
    console.log(result.rows);
    return result.rows;
}
