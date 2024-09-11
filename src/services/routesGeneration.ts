import app from "../app";
import {
    getTablesAndViews,
    getColumnsForTable,
} from "../models/introspectionModel";
import {
    getAllFromTable,
    insertIntoTable,
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
            //validating req.body contains valid columns
            const columnInfoArray = await getColumnsForTable(tableName);
            const validColumnsArray = columnInfoArray.map(
                (columnInfo) => columnInfo.column_name
            );
            const invalidColumnsArray = Object.keys(data).filter(
                (col) => !validColumnsArray.includes(col)
            );

            if (invalidColumnsArray.length > 0) {
                return res.status(400).json({
                    error: `invalid columns: ${invalidColumnsArray.join(", ")}`,
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
}
