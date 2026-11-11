import { rows as data } from "./data.ts";

console.log("Number of data: " + data.length);

let missingInvoice = 0;
let missingStockCode = 0;
let missingDescription = 0;
let missingQuantity = 0;
let missingInvoiceDate = 0;
let missingPrice = 0;
let missingCustomerID = 0;
let missingCountry = 0;

for (const row of data) {
    if (row.Invoice.trim() === "") missingInvoice++;
    if (row.StockCode.trim() === "") missingStockCode++;
    if (row.Description.trim() === "") missingDescription++;
    if (row.Quantity.trim() === "") missingQuantity++;
    if (row.InvoiceDate.trim() === "") missingInvoiceDate++;
    if (row.Price.trim() === "") missingPrice++;
    if (row.CustomerID.trim() === "") missingCustomerID++;
    if (row.Country.trim() === "") missingCountry++;
}

console.log("Missing Invoice: " + missingInvoice);
console.log("Missing StockCode: " + missingStockCode);
console.log("Missing Description: " + missingDescription);
console.log("Missing Quantity: " + missingQuantity);
console.log("Missing InvoiceDate: " + missingInvoiceDate);
console.log("Missing Price: " + missingPrice);
console.log("Missing CustomerID: " + missingCustomerID);
console.log("Missing Country: " + missingCountry);