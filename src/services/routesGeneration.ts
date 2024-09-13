import app from "../app";
import {
    getTablesAndViews,
    getColumnsForTable,
    getPrimaryKeyName,
} from "../models/introspectionModel";
import {
    getAllFromTable,
    insertIntoTable,
    updateRowOfTable,
} from "../models/routesGenerationModel";

export function generateCRUDRoutesForATable(tableName: string) {
    //following is for letting know what are the tables in the db
    app.get("/api/tableinfo", async (req, res) => {
        const tablesAndViewsArray = await getTablesAndViews();
        res.json(tablesAndViewsArray); //change how the front-end receives the data by changing this line
    });

    //following is for letting know what are the columns in the relevant table
    app.get(`/api/tableinfo/${tableName}`, async (req, res) => {
        const columnInfoArray = await getColumnsForTable(tableName);
        res.json(columnInfoArray); //change how the front-end receives the data by changing this line
    });

    app.get(`/${tableName}`, async (req, res) => {
        const result = await getAllFromTable(tableName);
        res.json(result); //change how the front-end receives the data by changing this line
    });

    app.post(`/${tableName}`, async (req, res) => {
        const data = req.body;

        try {
            const [isValid, invalidColumns] = await areColumnsValid(
                tableName,
                data
            );
            if (!isValid) {
                return res.status(400).json({
                    error: `invalid columns: ${invalidColumns?.join(", ")}`,
                });
            }

            const result = await insertIntoTable(tableName, data);
            res.status(201).json(result);
        } catch (error) {
            console.error(`error occurred: `, error);
            if (error instanceof Error) {
                res.status(500).json({ error: `${error.message}` });
            }
        }
    });

    app.put(`/${tableName}/:id`, async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const pkName = await getPrimaryKeyName(tableName);

        try {
            const [isValid, invalidColumns] = await areColumnsValid(
                tableName,
                data
            );
            if (!isValid) {
                return res.status(400).json({
                    error: `invalid columns: ${invalidColumns?.join(", ")}`,
                });
            }

            const result = await updateRowOfTable(tableName, data, pkName, id);
            res.status(200).json(result);
        } catch (error) {
            console.error(`error occurred: `, error);
            if (error instanceof Error) {
                res.status(500).json({ error: `${error.message}` });
            }
        }
    });

    //validating columns
    async function areColumnsValid(
        tableName: string,
        data: Record<string, any>
    ): Promise<[boolean, any[]?]> {
        try {
            const columnInfoArray = await getColumnsForTable(tableName);
            const validColumnsArray = columnInfoArray.map(
                (columnInfo) => columnInfo.column_name
            );
            const invalidColumnsArray = Object.keys(data).filter(
                (col) => !validColumnsArray.includes(col)
            );
            return [invalidColumnsArray.length === 0, invalidColumnsArray];
        } catch (error) {
            console.error("Error fetching table columns:", error);
            return [false, []]; //if any error occurs, gives false..
        }
    }
}
