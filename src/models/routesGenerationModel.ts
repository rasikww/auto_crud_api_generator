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

export async function updateRowOfTable(
    tableName: string,
    data: Record<string, any>,
    pk: string | null,
    pkValue: string
) {
    const columns = Object.keys(data);
    //creating the SET clause for the update
    const setClause = columns
        .map((col, index) => `${col} = $${index + 1}`)
        .join(", ");

    //creating sql query
    const query = `
    UPDATE ${tableName}
    SET ${setClause}
    WHERE ${pk} = $${columns.length + 1}
    RETURNING *;
    `;

    const values = [...columns.map((col) => data[col]), pkValue];

    const result = await queryDB(query, values);
    return result.rows[0];
}
