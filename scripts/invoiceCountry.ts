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

const invoiceCustomers = new Map<string, Set<string>>();

const countryList = new Set<string>();

for (const row of data) {
    const inv = invoiceCustomers.get(row.Invoice);
    if (inv === undefined) {
        invoiceCustomers.set(row.Invoice, new Set<string>());
        const invv = invoiceCustomers.get(row.Invoice);
        invv?.add(row.Country);
        countryList.add(row.Country);
    }
    else {
        inv.add(row.Country);
    }
}


invoiceCustomers.forEach((value, key) => {
    if (value.size != 1) {
        console.log("Invoice: " + key)
        console.log(value);
    }
})

let noCountry = 0;


invoiceCustomers.forEach((value, key) => {
    if (value.has("")) {
        noCountry++;
    }
})

console.log("No Country (unique to Invoice): " + noCountry);

console.log(countryList);

let a = 0;