# Project: Relational Database for KoDes Retail Store

**Project**

Database Overhaul

**Due Date**

any time before UAS

### **1. The Scenario**

You are a database engineer assigned to a new client, KoDes Retail, an Indonesian-based retail store specializing in all-occasion gifts. For the past several years, they have managed their business by exporting all transaction data into a single, large CSV file.

This flat-file approach has reached its limit. The client is experiencing significant operational friction: generating reports is slow, data is frequently inconsistent, and making simple updates (like changing a product's name) is a monumental task.

Your mission is to lead the project of replacing their outdated spreadsheet system with a professionally designed, secure, and efficient relational database.

### **2. The Core Objective**

> Your primary goal is to take the client's raw transaction data and use it as a blueprint to design, implement, and test a fully normalized relational database system from scratch. This new system must ensure data integrity, eliminate redundancy, and be capable of handling complex business queries efficiently.
> 

### **3. The Source Data**

All available historical data is contained in a single CSV file. You can download it from the source below.

- **Dataset:**  https://binusianorg-my.sharepoint.com/personal/samuel_philip_binus_ac_id/_layouts/15/guestaccess.aspx?share=EjOMHzdw4DBBuPYxwF0jiCsB00et40bpSmNIdBRdZkJldg&e=EeSNlL
- **Columns Provided:** `Invoice`, `StockCode`, `Description`, `Quantity`, `InvoiceDate`, `Price`, `Customer ID`, `Country`.

### **4. Project Phases & Deliverables**

Complete the following phases in order. You will submit three separate `.sql` files, **documentation** that explains your work, and database backup file as your final deliverables.

### **Phase 1: Database Analysis & Design**

Before writing any code, you must analyze the source data and design a logical structure for the new database.

- **Task:** Investigate the relationships hidden within the flat-file data. Identify the core business concepts (e.g., sales, products, customers) and design a schema that organizes them into separate, related tables. You have the authority to add new attributes or even new tables if you can justify their business value (e.g., storing customer contact info, tracking inventory levels, etc.).
- **Deliverable:** An **Entity-Relationship Diagram (ERD)**.
- **Requirements:**
    - [ ]  The schema must be normalized to at least **Third Normal Form (3NF) / normalized schema**.
    - [ ]  The ERD must clearly visualize all tables and their attributes.
    - [ ]  Each table must have a designated Primary Key (PK).
    - [ ]  All relationships between tables must be shown using standard notation (e.g., Crow's Foot) with Foreign Keys (FK) clearly marked.

### **Phase 2:  Database Implementation (DDL)**

Translate your conceptual ERD into a physical database schema using SQL.

- **Task:** Write the SQL code that creates the entire table structure, including all constraints needed to enforce your design's rules.
- **Deliverable:** A single SQL script file named `schema.sql`.
- **Requirements:**
    - [ ]  The script must contain all `CREATE TABLE` statements.
    - [ ]  You must select appropriate data types for every column.
    - [ ]  The script must define all **Primary Key** and **Foreign Key** constraints.
    - [ ]  Referential integrity actions (`ON DELETE`, `ON UPDATE`) must be defined.
    - [ ]  Use other constraints (`NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`) as needed to ensure data quality.
    - [ ]  Data from CSV should be imported into the DB. Preprocessing using other programming language is allowed.  using only sample of the data as your final import is not allowed.

### **Phase 3: Data Transactions & Queries (DML)**

With the database structure in place, write SQL queries to perform common business operations and answer analytical questions.

- **Task:** Write a series of robust DML statements that reflect real-world scenarios.
- **📎 Deliverable:** A single SQL script file named `queries.sql`.
- **Required Scenarios:**
    - [ ]  **Query 1: Price Adjustment Campaign (UPDATE).** Due to inflation and exchange rates, KoDes Retail needs to increase the `UnitPrice` by 8% for all products that currently cost less than $5.00. Write the update query to execute this price change.
    - [ ]  **Query 2: Order Cancellation Processing (UPDATE/DELETE).** A customer requests to cancel an order (`InvoiceNo`). Update the status of that invoice to `'Cancelled'` (or handle the cancellation according to your schema design) without deleting historical audit records.
    - [ ]  **Query 3: Regional Sales Breakdown (JOIN & GROUP BY).** Generate a report showing total sales revenue and total completed invoices per `Country`. Order the results from highest revenue to lowest.
    - [ ]  **Query 4: VIP High-Spender Identification (Nested Query / Subquery Required).** Write a query to find all customers whose **total spend** is *greater than the average total spend of all customers* in the database. Output the customer details along with their calculated total spend.
    - [ ]  **Query 5: Product Performance & Cross-Selling (Subquery / Complex Filtering).** Identify products that have **never been purchased by any customer from 'Germany'**, but have been purchased by customers from at least two other countries.

### **Phase 4:  Advanced Features & Automation**

Implement advanced database features to automate logic and improve data integrity.

- **Task:** Create a trigger and a stored procedure to handle common, repetitive, or critical logic at the database level.
- **Deliverable:** A single SQL script file named `advanced.sql`.
- **Requirements:**
    - [ ]  **Trigger:** Create a trigger that automatically updates the inventory level of a product whenever a transaction (sale or return) involving that product is recorded.
    - [ ]  **Stored Procedure:** Create a stored procedure named `GetCustomerInvoiceHistory` that accepts a `CustomerID` as input and returns a complete list of all invoices (including the date and total value) belonging to that customer.