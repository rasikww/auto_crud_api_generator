import queryDB from "../config/db";

export async function getAllFromTable(tableName: String) {
    const query = `
    SELECT * FROM ${tableName}
    `;
    const result = await queryDB(query);
    return result.rows;
}

export async function insertIntoTable(
    tableName: String,
    data: Record<string, any>
) {
    const columns = Object.keys(data);
    const values = Object.values(data);

    const query = `
    INSERT INTO ${tableName} (${columns.join(",")})
    VALUES (${columns.map((_, i) => `$${i + 1}`).join(",")})
    RETURNING *;
    `;

    const result = await queryDB(query, values);
    return result.rows[0];
}
