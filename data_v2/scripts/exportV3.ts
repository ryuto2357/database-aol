import { stringify } from "csv-stringify/sync";
import { data } from "./data.ts";
import { writeFileSync } from "node:fs";

let cleanedRow = [];

for (const row of data) {
    cleanedRow.push({
        ...row,
        Stock: row.Stock.trim(),
        Description: row.Description.trim(),
        Customer: row.Customer.trim().replace(/\.0$/, "")
    })
}

console.log(cleanedRow.length);

const csv = stringify(cleanedRow, {
    header: true,
    columns: [
        { key: "Invoice", header: "Invoice" },
        { key: "Stock", header: "StockCode" },
        { key: "Description", header: "Description" },
        { key: "Quantity", header: "Quantity" },
        { key: "Date", header: "InvoiceDate" },
        { key: "Price", header: "Price" },
        { key: "Customer", header: "Customer ID" },
        { key: "Country", header: "Country" }
    ]
});

writeFileSync(
    "data_v3/data/data_v3.csv",
    csv,
    "utf8"
)