import app from "../app";
import { getAllFromTable } from "../models/routesGenerationModel";

export function generateCRUDRoutesForATable(tableName: string) {
    app.get(`/${tableName}`, async (req, res) => {
        const result = await getAllFromTable(tableName);
        // res.json(result);
        return result;
    });
}
