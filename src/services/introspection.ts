import { getTablesAndViews } from "../models/introspectionModel";
import { generateCRUDRoutesForATable } from "./routesGeneration";

export async function flow() {
    const result = await getTablesAndViews();
    return generateCRUDRoutesForATable(result[0].table_name);
}
