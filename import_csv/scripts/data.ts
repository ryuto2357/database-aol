import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";

const csv = readFileSync("data_v3/data/data_v3.csv", "utf-8");

type InvoiceData = {
    Invoice: string,
    Stock: string,
    Description: string,
    Quantity: string,
    Date: string,
    Price: string,
    Customer: string,
    Country: string,
}

const data = parse(csv, {
    columns: (headers: string[]) => headers.map(header => {
        switch (header) {
            case "StockCode": return "Stock";
            case "InvoiceDate": return "Date";
            case "Customer ID": return "Customer";
            default: return header;
        }
    }),
    skip_empty_lines: true
}) as InvoiceData[];

export { data }