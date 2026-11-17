import { rows as data } from "./data.ts";
console.log("Number of data: " + data.length);
console.log();


const invoiceStock = new Map<string, Set<string>>();

let duplicateRowWithSameInvoiceSameStockCode = 0;

for (const row of data) {
    const inv = invoiceStock.get(row.Invoice);
    if (inv === undefined) {
        invoiceStock.set(row.Invoice, new Set<string>([row.StockCode]));
    }
    else {
        if (inv.has(row.StockCode)) {
            console.log(row.Invoice + " " + row.StockCode)
            duplicateRowWithSameInvoiceSameStockCode++;
        }
        inv.add(row.StockCode);
    }
}

console.log(duplicateRowWithSameInvoiceSameStockCode);

let a = 0;