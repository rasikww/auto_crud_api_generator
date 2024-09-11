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

export async function getColumnsForTable(tableName: string) {
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1;
    `;
    const result = await queryDB(query, [tableName]);
    return result.rows;
}
