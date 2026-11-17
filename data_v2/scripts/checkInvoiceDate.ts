import { data } from "./data.ts";

const mapInvoiceDate = new Map<string, Set<string>>();

for (const row of data) {
    const setDate = mapInvoiceDate.get(row.Invoice);
    if (setDate === undefined) mapInvoiceDate.set(row.Invoice, new Set<string>([row.Date]));
    else setDate.add(row.Date);
}

let multipleDates = 0;
mapInvoiceDate.forEach((value, key) => {
    if (value.size != 1) {
        multipleDates++;
    }
})

console.log(multipleDates);