import { data } from "./data.ts";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

type CountryRow = {
    CountryID: string;
    CountryName: string;
};

const countryCsv = readFileSync(
    "import_csv/data/countries.csv",
    "utf8"
);

const countries = parse(countryCsv, {
    columns: true,
    skip_empty_lines: true
}) as CountryRow[];

const countryMap = new Map<string, number>();

for (const country of countries) {
    countryMap.set(
        country.CountryName,
        Number(country.CountryID)
    );
}

type InvoiceRow = {
    InvoiceNo: string;
    CustomerID: string;
    CountryID: number;
    InvoiceDate: string;
    InvoiceType: string;
    Status: string;
    CancelledAt: string;
    CancellationReason: string;
};

const invoiceMap = new Map<string, InvoiceRow>();

for (const row of data) {
    const countryID = countryMap.get(row.Country)!;

    let invoiceType = "Sale";

    if (row.Invoice.startsWith("C")) {
        invoiceType = "Return";
    }
    else if (row.Invoice.startsWith("A")) {
        invoiceType = "Adjustment";
    }

    const existing = invoiceMap.get(row.Invoice);

    if (existing === undefined) {
        invoiceMap.set(row.Invoice, {
            InvoiceNo: row.Invoice,
            CustomerID: row.Customer,
            CountryID: countryID,
            InvoiceDate: row.Date,
            InvoiceType: invoiceType,
            Status: "Completed",
            CancelledAt: "",
            CancellationReason: ""
        });
    }
}

const invoiceRows = [...invoiceMap.values()].sort(
    (a, b) => a.InvoiceNo.localeCompare(b.InvoiceNo)
);


const csv = stringify(invoiceRows, {
    header: true,
    columns: [
        "InvoiceNo",
        "CustomerID",
        "CountryID",
        "InvoiceDate",
        "InvoiceType",
        "Status",
        "CancelledAt",
        "CancellationReason"
    ]
});

writeFileSync(
    "import_csv/data/invoices.csv",
    csv,
    "utf8"
);