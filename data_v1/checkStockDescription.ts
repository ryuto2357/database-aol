import { rows as data } from "./data.ts";
console.log("Number of data: " + data.length);
console.log();

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


let emptyDesc = 0;

for (const row of data) {
    const inv = stocks.get(row.StockCode);
    if (row.Description.trim() === "") emptyDesc++;
    stockLength.add(row.StockCode.length);
    if (inv === undefined) {
        stocks.set(row.StockCode, new Set<string>([row.Description]));
    }
    else {
        inv.add(row.Description);
    }
}

console.log("Empty Description: " + emptyDesc);
console.log("Stock Length: " + stockLength);
console.log(stockLength);


let sameDescriptionForEveryStockCode = 0;
let multipleDescriptionForEveryStockCode = 0;
let hasEmptyDescriptionForEveryStockCode = 0;

stocks.forEach((value, key) => {
    if (value.size == 1) {
        sameDescriptionForEveryStockCode++;
    }
    else {
        for (let v of value) {
            if (v.trim() == "") {
                hasEmptyDescriptionForEveryStockCode++;
                break;
            }
        }
        multipleDescriptionForEveryStockCode++;
    }
})

console.log(sameDescriptionForEveryStockCode);
console.log(multipleDescriptionForEveryStockCode);
console.log(hasEmptyDescriptionForEveryStockCode);

let a = 0;