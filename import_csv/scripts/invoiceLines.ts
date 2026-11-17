
import { data } from "./data.ts";
import { stringify } from "csv-stringify/sync";
import { writeFileSync } from "node:fs";

const invoiceLines = data.map((row, index) => ({
    LineID: index + 1,
    InvoiceNo: row.Invoice,
    StockCode: row.Stock,
    Quantity: row.Quantity,
    UnitPrice: row.Price,
    OriginalDescription: row.Description
}));


const csv = stringify(invoiceLines, {
    header: true,
    columns: [
        "LineID",
        "InvoiceNo",
        "StockCode",
        "Quantity",
        "UnitPrice",
        "OriginalDescription"
    ]
});

writeFileSync(
    "import_csv/data/invoice_lines.csv",
    csv,
    "utf8"
);