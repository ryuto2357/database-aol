import { data } from "./data.ts";

let validRow = [];

for (const row of data) {
    if (
        !row.Invoice.startsWith("C") &&
        !row.Invoice.startsWith("A") &&
        Number(row.Quantity) > 0 &&
        Number(row.Price) > 0 &&
        row.Description.trim() !== ""
    ) {
        validRow.push(row);
    }
}

const excludedDescriptions = ["damage", "lost", "mia", "amendment", "unsaleable", "destroyed", "dotcom"];

let newRow = [];

for (const row of validRow) {
    let containsExcluded = false;
    for (const word of excludedDescriptions) {
        if (row.Description.toLowerCase().includes(word)) containsExcluded = true;
    }
    if (!containsExcluded) newRow.push(row);
}