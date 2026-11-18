import { data } from "./data.ts";

let allComposite = new Map<string, [string, number]>();

let counter = 0;
let rowCounter = 0;
for (const row of data) {
    let jsonData = JSON.stringify({
        Invoice: row.Invoice,
        Stock: row.Stock,
        Price: row.Price,
        Description: row.Description,
        Quantity: row.Quantity
    });

    let fullJson = allComposite.get(jsonData);

    if (fullJson === undefined) allComposite.set(jsonData, [JSON.stringify(row), rowCounter]);
    else {
        console.log("row " + fullJson[1]);
        console.log(JSON.parse(fullJson[0]));
        console.log("row " + rowCounter);
        console.log(row);
        console.log("=====");
        counter++;
    }

    if (counter === 20) break;
    rowCounter++;
}

console.log(counter);