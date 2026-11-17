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


const nInvoices = new Set<string>();
const cInvoices = new Set<string>();
const aInvoices = new Set<string>();

for (const row of data) {
    if (row.Invoice.startsWith("C")) {
        cInvoices.add(row.Invoice);
    }
    else if (row.Invoice.startsWith("A")) {
        aInvoices.add(row.Invoice);
    }
    else {
        nInvoices.add(row.Invoice);
    }
}

console.log("Invoice starts with N: " + normalInvoice + " (unique: " + nInvoices.size + ")");
console.log("Invoice starts with C: " + invoiceStartWithC + " (unique: " + cInvoices.size + ")");
console.log("Invoice starts with A: " + invoiceStartWithA + " (unique: " + aInvoices.size + ")");

// console.log("N Invoice: " + normalInvoice + " --> " + nInvoices.size);
// console.log("C Invoice: " + invoiceStartWithC + " --> " + cInvoices.size);
// console.log("A Invoice: " + invoiceStartWithA + " --> " + aInvoices.size);
// console.log();

// console.log(nInvoices)
// console.log(cInvoices)
// console.log(aInvoices)

let a = 0;