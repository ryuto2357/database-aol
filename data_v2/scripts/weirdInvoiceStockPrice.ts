import { data } from "./data.ts";

type Row = (typeof data)[number];

const firstSeen = new Map<string, Row>();
const conflicts = new Map<string, Map<number, Row>>();

for (const row of data) {
    const key = JSON.stringify([
        row.Invoice,
        row.Stock,
        row.Description
    ]);

    const first = firstSeen.get(key);

    if (!first) {
        firstSeen.set(key, row);
        continue;
    }

    const firstPrice = Number(first.Price);
    const currentPrice = Number(row.Price);

    if (firstPrice === currentPrice) continue;

    if (!conflicts.has(key)) {
        conflicts.set(key, new Map([
            [firstPrice, first]
        ]));
    }

    conflicts.get(key)!.set(currentPrice, row);
}

console.log("Conflicting groups:", conflicts.size);

for (const [key, prices] of [...conflicts].slice(0, 20)) {
    const [invoice, stock, description] = JSON.parse(key);

    console.log("\nInvoice:", invoice);
    console.log("StockCode:", stock);
    console.log("Description:", description);

    console.table(
        [...prices.values()].map(row => ({
            Invoice: row.Invoice,
            StockCode: row.Stock,
            Desc: row.Description,
            Quantity: row.Quantity,
            UnitPrice: row.Price,
            InvoiceDate: row.Date
        }))
    );
}

let i = 0;