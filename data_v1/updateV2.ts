import { stringify } from "csv-stringify/sync";
import { rows as data } from "./data.ts";
import { writeFileSync } from "node:fs";

let mapInvoiceToDate = new Map<string, string>();

for (const row of data) {
    const invoiceDate = mapInvoiceToDate.get(row.Invoice);
    if (invoiceDate === undefined || row.InvoiceDate < invoiceDate) {
        mapInvoiceToDate.set(row.Invoice, row.InvoiceDate);
    }
}

let newData = [];
for (const row of data) {
    const invoiceDate = mapInvoiceToDate.get(row.Invoice)!;
    newData.push({
        ...row,
        InvoiceDate: invoiceDate
    })
}

console.log(newData.length);

const output = stringify(newData, {
    header: true,
    columns: [
        { key: "Invoice", header: "Invoice" },
        { key: "StockCode", header: "StockCode" },
        { key: "Description", header: "Description" },
        { key: "Quantity", header: "Quantity" },
        { key: "InvoiceDate", header: "InvoiceDate" },
        { key: "Price", header: "Price" },
        { key: "CustomerID", header: "Customer ID" },
        { key: "Country", header: "Country" }
    ]
})

writeFileSync(
    "data_v2/data_v2.csv",
    output,
    "utf8"
)