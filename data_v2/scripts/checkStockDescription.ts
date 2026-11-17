import { data } from "./data.ts";

const stockDescriptions = new Map<string, Set<string>>();

for (const row of data) {
    const description = stockDescriptions.get(row.Stock);
    if (description === undefined) {
        if (row.Description.trim() === "") stockDescriptions.set(row.Stock, new Set<string>());
        else stockDescriptions.set(row.Stock, new Set<string>([row.Description.trim()]));
    }
    else {
        if (row.Description.trim() !== "") description.add(row.Description.trim());
    }
}


let noDescription = 0;
let oneDescription = 0;
let moreDescription = 0;

stockDescriptions.forEach((value, key) => {
    if (value.size === 0) noDescription++;
    else if (value.size === 1) oneDescription++;
    else moreDescription++;
})

console.log(noDescription, oneDescription, moreDescription);

console.log("=====");

let printed = 0;

stockDescriptions.forEach((descriptions, stock) => {
    if (descriptions.size > 1 && printed < 10) {
        console.log(stock, descriptions);
        printed++;
    }
});

let a = 0;