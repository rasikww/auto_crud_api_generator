import { getTablesAndViews } from "../models/introspectionModel";
import { generateCRUDRoutesForATable } from "./routesGeneration";

let tablesAndViewsArray = [];

export async function flow() {
    tablesAndViewsArray = await getTablesAndViews();
    tablesAndViewsArray.forEach((table) =>
        generateCRUDRoutesForATable(table.table_name)
    );

    // return generateCRUDRoutesForATable(tablesAndViewsArray[0].table_name);
}
