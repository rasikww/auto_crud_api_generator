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

export async function getPrimaryKeyName(
    tableName: string
): Promise<string | null> {
    const query = `
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND tc.table_name = $1
      AND tc.table_schema = 'public';
  `;
    try {
        const res = await queryDB(query, [tableName]);
        if (res.rows.length > 0) {
            return res.rows[0].column_name;
        } else {
            return null; // No primary key found
        }
    } catch (error) {
        console.error("Error fetching primary key:", error);
        return null;
    }
}
