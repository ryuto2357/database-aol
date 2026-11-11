import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";

const csv = readFileSync("data/online_retail_data.csv", "utf-8");

type InvoiceData = {
    Invoice: string,
    StockCode: string,
    Description: string,
    Quantity: string,
    InvoiceDate: string,
    Price: string,
    CustomerID: string,
    Country: string,
}

const rows = parse(csv, {
    columns: (headers: string[]) => headers.map(header => header === "Customer ID" ? "CustomerID" : header),
    skip_empty_lines: true
}) as InvoiceData[];

export { rows }