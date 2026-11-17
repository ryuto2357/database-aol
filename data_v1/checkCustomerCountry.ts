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

const customerCountry = new Map<string, Set<string>>();

for (const row of data) {
    const cust = customerCountry.get(row.CustomerID);
    if (cust === undefined) {
        customerCountry.set(row.CustomerID, new Set<string>([row.Country]));
    }
    else {
        cust.add(row.Country);
    }
}

customerCountry.forEach((value, key) => {
    if (value.size != 1) {
        console.log(key);
        console.log(value);
    }
})

let a = 0;
