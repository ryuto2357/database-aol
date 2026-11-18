-- Create Trigger
CREATE TRIGGER UpdateInventory
AFTER INSERT ON InvoiceLine
FOR EACH ROW
UPDATE Product
JOIN Invoice ON Invoice.InvoiceNo = NEW.InvoiceNo
SET Product.StockQuantity = Product.StockQuantity - NEW.Quantity
WHERE Product.StockCode = NEW.StockCode
    AND Product.IsStockTracked = TRUE;


-- Create Function
DELIMITER ///

CREATE PROCEDURE GetCustomerInvoiceHistory(IN custID INT)
BEGIN
    SELECT
        Invoice.InvoiceNo,
        Invoice.InvoiceDate,
        Invoice.InvoiceType,
        Invoice.Status,
        SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) AS InvoiceTotal
    FROM Invoice
    JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
    WHERE Invoice.CustomerID = custID
    GROUP BY
        Invoice.InvoiceNo,
        Invoice.InvoiceDate,
        Invoice.InvoiceType,
        Invoice.Status
    ORDER BY Invoice.InvoiceDate DESC;
END ///

DELIMITER ;