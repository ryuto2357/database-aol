import { stringify } from "csv-stringify/sync";
import { data } from "./data.ts";
import { writeFileSync } from "node:fs";

const countries = new Set<string>();

for (const row of data) {
    countries.add(row.Country);
}

const sortedCountries = [...countries].sort();

const countryRows = sortedCountries.map((name, index) => ({
    CountryID: index + 1,
    CountryName: name
}));

const csv = stringify(countryRows, {
    header: true,
    columns: ["CountryID", "CountryName"]
});

writeFileSync(
    "import_csv/data/countries.csv",
    csv,
    "utf8"
);