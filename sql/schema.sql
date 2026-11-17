CREATE DATABASE kodes_retail
CHARACTER SET utf8mb4
COLLATE utf8mb4_bin;
USE kodes_retail;

CREATE TABLE Country (
    CountryID INT AUTO_INCREMENT PRIMARY KEY,
    CountryName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    Email VARCHAR(255) UNIQUE
);

CREATE TABLE Product (
    StockCode VARCHAR(20) PRIMARY KEY,
    Description VARCHAR(255),
    UnitPrice DECIMAL(12,3),
    StockQuantity INT NOT NULL DEFAULT 0,
    IsStockTracked BOOLEAN NOT NULL DEFAULT TRUE,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,

    CHECK (UnitPrice >= 0),
    CHECK (StockQuantity >= 0),
    CHECK (IsStockTracked IN (0, 1)),
    CHECK (IsActive IN (0, 1))
);

CREATE TABLE Invoice (
    InvoiceNo VARCHAR(16) PRIMARY KEY,
    CustomerID INT,
    CountryID INT NOT NULL,
    InvoiceDate DATETIME NOT NULL,
    InvoiceType VARCHAR(20) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    CancelledAt DATETIME,
    CancellationReason VARCHAR(255),

    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (CountryID) REFERENCES Country(CountryID),

    CHECK (InvoiceType IN ('Sale', 'Return', 'Adjustment')),
    CHECK (Status IN ('Completed', 'Cancelled'))
);

CREATE TABLE InvoiceLine (
    LineID BIGINT AUTO_INCREMENT PRIMARY KEY,
    InvoiceNo VARCHAR(16) NOT NULL,
    StockCode VARCHAR(20) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(12,3) NOT NULL,
    OriginalDescription VARCHAR(255),

    FOREIGN KEY (InvoiceNo) REFERENCES Invoice(InvoiceNo),
    FOREIGN KEY (StockCode) REFERENCES Product(StockCode)
);