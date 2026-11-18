-- Query 1
UPDATE Product
SET UnitPrice = ROUND(UnitPrice * 1.08, 3)
WHERE UnitPrice < 5.00;

-- Query 2
UPDATE Invoice
SET
    Status = 'Cancelled',
    CancelledAt = NOW(),
    CancellationReason = 'Customer request'
WHERE InvoiceNo = '489434';

-- Query 3
SELECT
    Country.CountryName AS Country,
    SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) AS TotalRevenue,
    COUNT(DISTINCT Invoice.InvoiceNo) AS TotalInvoices
FROM Country
JOIN Invoice ON Country.CountryID = Invoice.CountryID
JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
WHERE Invoice.Status = 'Completed' AND Invoice.InvoiceType = 'Sale'
GROUP BY Country.CountryID, Country.CountryName
ORDER BY TotalRevenue DESC;

-- Query 4
SELECT COUNT(*)
INTO @CustomerCount
FROM Customer;

SELECT
    Customer.CustomerID,
    Customer.CustomerName,
    SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) AS TotalSpend
FROM Customer
JOIN Invoice ON Customer.CustomerID = Invoice.CustomerID
JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
WHERE Invoice.Status = 'Completed'
  AND Invoice.InvoiceType = 'Sale'
GROUP BY Customer.CustomerID, Customer.CustomerName
HAVING TotalSpend > (
    SELECT SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) / @CustomerCount
    FROM Invoice
    JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
    WHERE Invoice.Status = 'Completed'
      AND Invoice.InvoiceType = 'Sale'
      AND Invoice.CustomerID IS NOT NULL
)
ORDER BY TotalSpend DESC;


-- Query 5
SELECT
    Product.StockCode,
    Product.Description,
    COUNT(DISTINCT Invoice.CountryID) AS CountryCount
FROM Product
JOIN InvoiceLine ON Product.StockCode = InvoiceLine.StockCode
JOIN Invoice ON InvoiceLine.InvoiceNo = Invoice.InvoiceNo
WHERE Invoice.Status = 'Completed'
  AND Invoice.InvoiceType = 'Sale'
  AND Invoice.CustomerID IS NOT NULL
  AND InvoiceLine.Quantity > 0
  AND Product.StockCode NOT IN (
      SELECT InvoiceLine.StockCode
      FROM InvoiceLine
      JOIN Invoice ON InvoiceLine.InvoiceNo = Invoice.InvoiceNo
      JOIN Country ON Invoice.CountryID = Country.CountryID
      WHERE Country.CountryName = 'Germany'
        AND Invoice.Status = 'Completed'
        AND Invoice.InvoiceType = 'Sale'
        AND Invoice.CustomerID IS NOT NULL
        AND InvoiceLine.Quantity > 0
  )
GROUP BY Product.StockCode, Product.Description
HAVING CountryCount >= 2
ORDER BY CountryCount DESC;
