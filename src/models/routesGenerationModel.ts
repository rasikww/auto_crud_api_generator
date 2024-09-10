import queryDB from "../config/db";

export async function getAllFromTable(tableName: String) {
    const query = `
    SELECT * FROM ${tableName}
    `;
    const result = await queryDB(query);
    return result.rows;
}
