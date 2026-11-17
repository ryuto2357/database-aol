import { stringify } from "csv-stringify/sync";
import { data } from "./data.ts";
import { writeFileSync } from "node:fs";

const customers = new Set<string>();

for (const row of data) {
    if (row.Customer !== "") {
        customers.add(row.Customer);
    }
}

const sortedCustomers = [...customers].sort(
    (a, b) => Number(a) - Number(b)
);

const customerRows = sortedCustomers.map((id) => ({
    CustomerID: Number(id),
    CustomerName: `Demo Customer ${id}`,
    Email: `customer${id}@gmail.com`
}));

const csv = stringify(customerRows, {
    header: true,
    columns: ["CustomerID", "CustomerName", "Email"]
});

writeFileSync(
    "import_csv/data/customers.csv",
    csv,
    "utf8"
);
