import { rows as data } from "../data.ts";
// console.log("Number of data: " + data.length);
// console.log();

let invoiceStartWithC = 0;
let invoiceStartWithA = 0;
let normalInvoice = 0;

for (const row of data) {
    if (row.Invoice.startsWith("C")) invoiceStartWithC++;
    else if (row.Invoice.startsWith("A")) invoiceStartWithA++;
    else normalInvoice++;
}

const stocks = new Map<string, Set<string>>();
const stockLength = new Set<number>();
const stockLengthToStock = new Map<number, Set<string>>();


let emptyDesc = 0;

for (const row of data) {
    const inv = stockLengthToStock.get(row.StockCode.trim().length);
    if (row.Description.trim() === "") emptyDesc++;
    stockLength.add(row.StockCode.trim().length);
    if (inv === undefined) {
        stockLengthToStock.set(row.StockCode.trim().length, new Set<string>([row.StockCode.trim()]));
    }
    else {
        inv.add(row.StockCode.trim());
    }
}

console.log(stockLength);
console.log(stockLengthToStock);

let a = 0;