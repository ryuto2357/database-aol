
import { data } from "./data.ts";
import { stringify } from "csv-stringify/sync";
import { writeFileSync } from "node:fs";

const excludedWords = [
    "damage",
    "lost",
    "mia",
    "amendment",
    "unsaleable",
    "destroyed",
    "dotcom"
];

const nonStockCodes = new Set([
    "POST",
    "D",
    "M",
    "m",
    "B",
    "BANK CHARGES",
    "AMAZONFEE"
]);

type Product = {
    Description: string;
    UnitPrice: string;
    descriptionDate: string;
    priceDate: string;
};

const products = new Map<string, Product>();

for (const row of data) {
    if (!products.has(row.Stock)) {
        products.set(row.Stock, {
            Description: "",
            UnitPrice: "",
            descriptionDate: "",
            priceDate: ""
        });
    }

    const product = products.get(row.Stock)!;

    const description = row.Description.trim().toLowerCase();

    const excluded = excludedWords.some(word =>
        description.includes(word)
    );

    if (
        description !== "" &&
        !excluded &&
        row.Date >= product.descriptionDate
    ) {
        product.Description = row.Description;
        product.descriptionDate = row.Date;
    }

    const isSale = !row.Invoice.startsWith("C") && !row.Invoice.startsWith("A");

    if (
        isSale &&
        !excluded &&
        description !== "" &&
        Number(row.Quantity) > 0 &&
        Number(row.Price) > 0 &&
        row.Date >= product.priceDate
    ) {
        product.UnitPrice = row.Price;
        product.priceDate = row.Date;
    }
}

const productRows = [...products.entries()].map(([stock, product]) => ({
    StockCode: stock,
    Description: product.Description,
    UnitPrice: product.UnitPrice,
    StockQuantity: 0,
    IsStockTracked: nonStockCodes.has(stock) ? 0 : 1,
    IsActive: 1
}));

const csv = stringify(productRows, {
    header: true,
    columns: [
        "StockCode",
        "Description",
        "UnitPrice",
        "StockQuantity",
        "IsStockTracked",
        "IsActive"
    ]
});

writeFileSync("import_csv/data/products.csv", csv, "utf8");
