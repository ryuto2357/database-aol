USE kodes_retail;

LOAD DATA LOCAL INFILE 'import_csv/data/countries.csv'
INTO TABLE Country
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'import_csv/data/customers.csv'
INTO TABLE Customer
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'import_csv/data/products.csv'
INTO TABLE Product
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    StockCode,
    @description,
    @price,
    StockQuantity,
    IsStockTracked,
    IsActive
)
SET
    Description = NULLIF(@description, ''),
    UnitPrice = NULLIF(@price, '');

LOAD DATA LOCAL INFILE 'import_csv/data/invoices.csv'
INTO TABLE Invoice
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    InvoiceNo,
    @customer,
    CountryID,
    InvoiceDate,
    InvoiceType,
    Status,
    @cancelled,
    @reason
)
SET
    CustomerID = NULLIF(@customer, ''),
    CancelledAt = NULLIF(@cancelled, ''),
    CancellationReason = NULLIF(@reason, '');


LOAD DATA LOCAL INFILE 'import_csv/data/invoice_lines.csv'
INTO TABLE InvoiceLine
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(
    LineID,
    InvoiceNo,
    StockCode,
    Quantity,
    UnitPrice,
    @description
)
SET
    OriginalDescription = NULLIF(@description, '');
