# Documentation KoDes Retail

Github: https://github.com/ryuto2357/database-aol

# Structure of the Flat File CSV

## data/online_retail_data.csv

| Column | Meaning | Issues |
| --- | --- | --- |
| Invoice | The InvoiceNo of the transaction |   • Different invoice types (Sale, Return, Adjustment)
  • The same InvoiceNo appears in multiple rows |
| StockCode | The stock code of the product |   • Inconsistent format and length
  • Extra spaces in some codes
  • Inconsistent capitalization
  • Some codes represent services or fees |
| Description | The description of the StockCode at the time of InvoiceDate |   • Different descriptions for the same StockCode
  • 4,382 rows have blank descriptions
  • Extra spaces in some descriptions |
| Quantity | Quantity of the purchase |   • Some quantities are negative (returns) |
| InvoiceDate | The transaction timestamp |   • 83 invoices have different InvoiceDate values within the same invoice |
| Price | The price recorded at that transaction line |   • Different prices for the same StockCode
  • Some prices are zero or negative |
| Customer ID | The customer identifier |   • 243,007 rows have no Customer ID
  • Some IDs have a .0 suffix |
| Country | The country of that transaction |   • Some customers have transactions in more than one country
  • Some labels are nonstandard, such as EIRE, RSA, Unspecified |

# Analyzing original data

## [data_v1/findMissing.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/findMissing.ts)

This typescript code runs to find the missing data in every row. Here is the output:

```bash
Number of data: 1067371
Missing Invoice: 0
Missing StockCode: 0
Missing Description: 4382
Missing Quantity: 0
Missing InvoiceDate: 0
Missing Price: 0
Missing CustomerID: 243007
Missing Country: 0
```

We found out that 4382 rows have no Description, and 243007 rows have no Customer ID. We decided to keep those rows instead of deleting them.

## [data_v1/checkEachColumn/checkInvoiceVariants.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkEachColumn/checkInvoiceVariants.ts)

This code runs to check the types of Invoice in the CSV. Here is the output:

```bash
Invoice starts with N: 1047871 (unique: 45330)
Invoice starts with C: 19494 (unique: 8292)
Invoice starts with A: 6 (unique: 6)
```

We found out that there are 3 types of invoices. We use Sale for normal invoices, Return for invoices starting with C, and Adjustment for invoices starting with A. The script calls normal invoices N, but it actually means invoices that do not start with C or A.

## [data_v1/checkInvoiceCountry.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkInvoiceCountry.ts)

This code runs to check the relationship between Invoice and Country. We found out that every unique Invoice has only one Country. There are also 43 unique countries.

```bash
No Country (unique to Invoice): 0
Set(43) {
  'United Kingdom',
  'France',
  'USA',
  'Belgium',
  'Australia',
  'EIRE',
  'Germany',
  'Portugal',
  'Japan',
  'Denmark',
  'Nigeria',
  'Netherlands',
  'Poland',
  'Spain',
  'Channel Islands',
  'Italy',
  'Cyprus',
  'Greece',
  'Norway',
  'Austria',
  'Sweden',
  'United Arab Emirates',
  'Finland',
  'Switzerland',
  'Unspecified',
  'Malta',
  'Bahrain',
  'RSA',
  'Bermuda',
  'Hong Kong',
  'Singapore',
  'Thailand',
  'Israel',
  'Lithuania',
  'West Indies',
  'Lebanon',
  'Korea',
  'Brazil',
  'Canada',
  'Iceland',
  'Saudi Arabia',
  'Czech Republic',
  'European Community'
}
```

Because of this, we decided to put CountryID in the Invoice table.

## [data_v1/checkInvoiceCustomer.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkInvoiceCustomer.ts)

This code runs to check the relationship between Invoice and Customer ID, and to count invoices with missing Customer IDs. Here is the important output:

```bash
No Customer ID (unique to Invoice): 8752
```

We found out that 8752 invoices have no Customer ID. We also found that each invoice only has one Customer ID when it is available. So we put CustomerID in Invoice and allow it to be NULL.

## [data_v1/checkInvoiceDate.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkInvoiceDate.ts)

This code runs to check if every row with the same Invoice has the same InvoiceDate.

We found out that 83 invoices have different dates or times within the same invoice. We fixed this by using the earliest InvoiceDate for each invoice with [data_v1/updateV2.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/updateV2.ts), and created data_v2.

Output:

```bash
Invoice: 492807
Set(2) { '2009-12-20 12:28:00', '2009-12-20 12:29:00' }
Invoice: 494166
Set(2) { '2010-01-12 09:47:00', '2010-01-12 09:48:00' }
Invoice: 499967
Set(2) { '2010-03-03 14:06:00', '2010-03-03 14:07:00' }
Invoice: 500353
Set(2) { '2010-03-07 15:24:00', '2010-03-07 15:25:00' }
Invoice: 500827
Set(2) { '2010-03-10 11:10:00', '2010-03-10 11:11:00' }
Invoice: 501618
Set(2) { '2010-03-18 11:09:00', '2010-03-18 11:10:00' }
Invoice: 501871
Set(2) { '2010-03-21 12:23:00', '2010-03-21 12:24:00' }
Invoice: 503609
Set(2) { '2010-04-06 10:21:00', '2010-04-06 10:22:00' }
Invoice: 505791
Set(2) { '2010-04-26 11:07:00', '2010-04-26 11:08:00' }
Invoice: 509851
Set(2) { '2010-05-26 09:04:00', '2010-05-26 09:05:00' }
Invoice: 510644
Set(2) { '2010-06-02 12:36:00', '2010-06-02 12:37:00' }
Invoice: 513813
Set(2) { '2010-06-29 09:51:00', '2010-06-29 09:52:00' }
Invoice: 515016
Set(2) { '2010-07-07 17:25:00', '2010-07-07 17:26:00' }
Invoice: 518894
Set(2) { '2010-08-12 13:23:00', '2010-08-12 13:24:00' }
Invoice: 519239
Set(2) { '2010-08-15 13:41:00', '2010-08-15 13:42:00' }
Invoice: 519718
Set(2) { '2010-08-19 16:18:00', '2010-08-19 16:19:00' }
Invoice: 519730
Set(2) { '2010-08-19 19:39:00', '2010-08-19 19:40:00' }
Invoice: 519732
Set(2) { '2010-08-19 20:00:00', '2010-08-19 20:01:00' }
Invoice: 519881
Set(2) { '2010-08-22 11:27:00', '2010-08-22 11:28:00' }
Invoice: 520410
Set(2) { '2010-08-26 09:34:00', '2010-08-26 09:35:00' }
Invoice: 520771
Set(2) { '2010-08-31 11:19:00', '2010-08-31 11:20:00' }
Invoice: 520878
Set(2) { '2010-08-31 15:32:00', '2010-08-31 15:36:00' }
Invoice: 520899
Set(2) { '2010-09-01 09:25:00', '2010-09-01 09:26:00' }
Invoice: 521226
Set(2) { '2010-09-03 10:49:00', '2010-09-03 10:50:00' }
Invoice: 521651
Set(2) { '2010-09-07 13:41:00', '2010-09-07 13:42:00' }
Invoice: 521901
Set(2) { '2010-09-09 12:35:00', '2010-09-09 12:37:00' }
Invoice: 521922
Set(2) { '2010-09-09 14:49:00', '2010-09-09 14:50:00' }
Invoice: 522719
Set(2) { '2010-09-16 12:11:00', '2010-09-16 12:12:00' }
Invoice: 523203
Set(2) { '2010-09-21 09:50:00', '2010-09-21 09:51:00' }
Invoice: 523766
Set(2) { '2010-09-24 10:28:00', '2010-09-24 10:29:00' }
Invoice: 524128
Set(2) { '2010-09-27 14:35:00', '2010-09-27 14:36:00' }
Invoice: 528588
Set(2) { '2010-10-22 14:03:00', '2010-10-22 14:04:00' }
Invoice: 529368
Set(2) { '2010-10-28 10:07:00', '2010-10-28 10:16:00' }
Invoice: 530665
Set(2) { '2010-11-04 10:48:00', '2010-11-04 10:49:00' }
Invoice: 531756
Set(2) { '2010-11-09 13:23:00', '2010-11-09 13:24:00' }
Invoice: 532420
Set(2) { '2010-11-12 09:30:00', '2010-11-12 09:31:00' }
Invoice: 533106
Set(2) { '2010-11-16 11:53:00', '2010-11-16 11:54:00' }
Invoice: 533348
Set(2) { '2010-11-17 09:22:00', '2010-11-17 09:23:00' }
Invoice: 533505
Set(2) { '2010-11-17 14:05:00', '2010-11-17 14:06:00' }
Invoice: 534948
Set(2) { '2010-11-24 15:31:00', '2010-11-24 15:32:00' }
Invoice: 536591
Set(2) { '2010-12-01 16:57:00', '2010-12-01 16:58:00' }
Invoice: 540185
Set(2) { '2011-01-05 13:40:00', '2011-01-05 13:41:00' }
Invoice: 541596
Set(2) { '2011-01-19 16:18:00', '2011-01-19 16:19:00' }
Invoice: 541631
Set(2) { '2011-01-20 10:47:00', '2011-01-20 10:48:00' }
Invoice: 541809
Set(2) { '2011-01-21 14:58:00', '2011-01-21 14:59:00' }
Invoice: 541816
Set(2) { '2011-01-21 15:56:00', '2011-01-21 15:57:00' }
Invoice: 541849
Set(2) { '2011-01-23 13:33:00', '2011-01-23 13:34:00' }
Invoice: 542217
Set(2) { '2011-01-26 12:35:00', '2011-01-26 12:36:00' }
Invoice: 542806
Set(2) { '2011-02-01 11:19:00', '2011-02-01 11:20:00' }
Invoice: 543171
Set(2) { '2011-02-04 09:10:00', '2011-02-04 09:11:00' }
Invoice: 543179
Set(2) { '2011-02-04 10:31:00', '2011-02-04 10:32:00' }
Invoice: 543182
Set(2) { '2011-02-04 10:39:00', '2011-02-04 10:40:00' }
Invoice: 543777
Set(2) { '2011-02-11 16:19:00', '2011-02-11 16:20:00' }
Invoice: 544186
Set(2) { '2011-02-16 15:55:00', '2011-02-16 15:56:00' }
Invoice: 544667
Set(2) { '2011-02-22 15:09:00', '2011-02-22 15:10:00' }
Invoice: 544926
Set(2) { '2011-02-24 17:50:00', '2011-02-24 17:51:00' }
Invoice: 545460
Set(2) { '2011-03-02 17:32:00', '2011-03-02 17:33:00' }
Invoice: C545569
Set(2) { '2011-03-03 16:25:00', '2011-03-03 16:26:00' }
Invoice: 545713
Set(2) { '2011-03-07 10:11:00', '2011-03-07 10:12:00' }
Invoice: 546388
Set(2) { '2011-03-11 13:42:00', '2011-03-11 13:43:00' }
Invoice: 546986
Set(2) { '2011-03-18 12:55:00', '2011-03-18 12:56:00' }
Invoice: 547690
Set(2) { '2011-03-24 14:55:00', '2011-03-24 14:56:00' }
Invoice: 548203
Set(2) { '2011-03-29 16:40:00', '2011-03-29 16:41:00' }
Invoice: 549245
Set(2) { '2011-04-07 11:59:00', '2011-04-07 12:00:00' }
Invoice: 549524
Set(2) { '2011-04-08 15:41:00', '2011-04-08 15:42:00' }
Invoice: 550320
Set(2) { '2011-04-17 12:37:00', '2011-04-17 12:38:00' }
Invoice: 550333
Set(2) { '2011-04-17 14:05:00', '2011-04-17 14:06:00' }
Invoice: 550641
Set(2) { '2011-04-19 15:53:00', '2011-04-19 15:54:00' }
Invoice: 550645
Set(2) { '2011-04-19 16:30:00', '2011-04-19 16:31:00' }
Invoice: 552000
Set(2) { '2011-05-05 15:55:00', '2011-05-05 15:56:00' }
Invoice: 553199
Set(2) { '2011-05-15 15:13:00', '2011-05-15 15:14:00' }
Invoice: 553375
Set(2) { '2011-05-16 14:52:00', '2011-05-16 14:53:00' }
Invoice: 553556
Set(2) { '2011-05-17 16:48:00', '2011-05-17 16:49:00' }
Invoice: 554116
Set(2) { '2011-05-22 15:11:00', '2011-05-22 15:12:00' }
Invoice: 558086
Set(2) { '2011-06-26 11:58:00', '2011-06-26 11:59:00' }
Invoice: 561369
Set(2) { '2011-07-26 16:21:00', '2011-07-26 16:22:00' }
Invoice: 562128
Set(2) { '2011-08-03 09:06:00', '2011-08-03 09:07:00' }
Invoice: 563245
Set(2) { '2011-08-15 10:53:00', '2011-08-15 10:54:00' }
Invoice: 567183
Set(2) { '2011-09-18 15:32:00', '2011-09-18 15:33:00' }
Invoice: 571735
Set(2) { '2011-10-19 10:03:00', '2011-10-19 10:04:00' }
Invoice: 574076
Set(2) { '2011-11-02 15:37:00', '2011-11-02 15:38:00' }
Invoice: 576057
Set(2) { '2011-11-13 15:05:00', '2011-11-13 15:06:00' }
Invoice: 578548
Set(2) { '2011-11-24 15:02:00', '2011-11-24 15:03:00' }
```

## [data_v1/checkStockDescription.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkStockDescription.ts)

This code runs to check if each StockCode has only one Description. Here are the important results:

```
Empty Description: 4382
Stock Length:
Set(10) { 5, 6, 4, 7, 1, 8, 3, 2, 12, 9 }
same description for every stock code: 2457
multiple description for every stock code: 2848
has empty description for every stock code: 2096
```

We found out that the same StockCode can have different descriptions. Because of this, we decided to keep one Description in Product, and the original Description in InvoiceLine.

## [data_v1/checkCustomerCountry.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkCustomerCountry.ts)

This code runs to check if every Customer ID only has one Country.

We found out that 13 customers have transactions in more than one country. So we cannot put only one CountryID in Customer. We decided to put CountryID in Invoice instead.

Output:

```bash
Set(15) {
  'United Kingdom',
  'Nigeria',
  'EIRE',
  'Bahrain',
  'United Arab Emirates',
  'Bermuda',
  'Sweden',
  'France',
  'Hong Kong',
  'Lebanon',
  'RSA',
  'Unspecified',
  'Portugal',
  'Israel',
  'Switzerland'
}
12417.0
Set(2) { 'Belgium', 'Spain' }
12455.0
Set(2) { 'Cyprus', 'Spain' }
12422.0
Set(2) { 'Australia', 'Switzerland' }
12431.0
Set(2) { 'Belgium', 'Australia' }
12745.0
Set(2) { 'EIRE', 'United Kingdom' }
12370.0
Set(2) { 'Austria', 'Cyprus' }
12429.0
Set(2) { 'Denmark', 'Austria' }
12423.0
Set(2) { 'Denmark', 'Belgium' }
12449.0
Set(2) { 'Denmark', 'Belgium' }
12457.0
Set(2) { 'Switzerland', 'Cyprus' }
12652.0
Set(2) { 'Germany', 'France' }
12413.0
Set(2) { 'Spain', 'France' }
12394.0
Set(2) { 'Belgium', 'Denmark' }
```

## [data_v1/checkEachColumn/checkStockVariants.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/checkEachColumn/checkStockVariants.ts)

This code runs to check the different StockCode lengths and formats.

We found out that StockCodes have different lengths, and some have extra spaces. For example, `47503J`  and `47503J` should be the same code. After trimming, the number of unique StockCodes changed from 5305 to 5304.

Output:

```bash
Map(10) {
  5 => Set(3590) {
    '85048',
    '22041',
    '21232',
    '22064',
    '21871',
    '21523',
    '22350',
    '22349',
    '22195',
    '22353',
    '21755',
    '21754',
    '84879',
    '22119',
    '22142',
    '22296',
    '22295',
    '22109',
    '22107',
    '22194',
    '82582',
    '21181',
    '21756',
    '21333',
    '22111',
    '22143',
    '22145',
    '22130',
    '21364',
    '21360',
    '21351',
    '21352',
    '35400',
    '20695',
    '37370',
    '10002',
    '20703',
    '21987',
    '21989',
    '20971',
    '22271',
    '22272',
    '22274',
    '21912',
    '22112',
    '21329',
    '21252',
    '21100',
    '21033',
    '20711',
    '21410',
    '21411',
    '22065',
    '22138',
    '22139',
    '22352',
    '21491',
    '22333',
    '85216',
    '21493',
    '21731',
    '84691',
    '20749',
    '22321',
    '21955',
    '21582',
    '21586',
    '21590',
    '22091',
    '22024',
    '22026',
    '22029',
    '22025',
    '22031',
    '21428',
    '21430',
    '21916',
    '21790',
    '21888',
    '85178',
    '20754',
    '21035',
    '82580',
    '85150',
    '21041',
    '22180',
    '22128',
    '22163',
    '35951',
    '22253',
    '84988',
    '22219',
    '21299',
    '21099',
    '21085',
    '21929',
    '22241',
    '21091',
    '21733',
    '22178',
    ... 3490 more items
  },
  6 => Set(1649) {
    '79323P',
    '79323W',
    '48173C',
    '35004B',
    '84596F',
    '84596L',
    '84507B',
    '84970S',
    '84031A',
    '84031B',
    '84032A',
    '84032B',
    '84519A',
    '84519B',
    '85132A',
    '85132C',
    '85183A',
    '85183B',
    '85014A',
    '85014B',
    '16161P',
    '16169N',
    '85232B',
    '84029E',
    '84899E',
    '85123A',
    '84251J',
    '82001S',
    '35916C',
    '35916B',
    '18097C',
    '85099B',
    '85206A',
    '90200A',
    '90200D',
    '90200B',
    '90200E',
    '90200C',
    '90185C',
    '90185B',
    '90003C',
    '90003D',
    '90003B',
    '90209C',
    '90209A',
    '90082D',
    '79323S',
    '85071A',
    '85071B',
    '82494L',
    '72760B',
    '84327A',
    '84997D',
    '84997C',
    '90121B',
    '90175A',
    '90195B',
    '47566B',
    '47591D',
    '82613D',
    '84849B',
    '84997A',
    '16207A',
    '47591A',
    '84997B',
    '84951A',
    '85129A',
    '82616B',
    '84912B',
    '85014C',
    '85014D',
    '84971L',
    '84884A',
    '90013C',
    '90067A',
    '90067B',
    '90000A',
    '90024B',
    '90036D',
    '90199C',
    '35751C',
    '72739B',
    '85232D',
    '37492A',
    '84029G',
    '37492C',
    '85049A',
    '85049E',
    '79342B',
    '85226C',
    '85124A',
    '16169F',
    '15056N',
    '46000S',
    '16156N',
    '84520B',
    '84402D',
    '84660B',
    '72754B',
    '72802B',
    ... 1549 more items
  },
  4 => Set(4) { 'POST', 'PADS', 'GIFT', 'CRUK' },
  7 => Set(8) {
    '79323LP',
    '15056BL',
    '79323GR',
    '15056bl',
    'TEST001',
    'TEST002',
    '72024HC',
    'ADJUST2'
  },
  1 => Set(5) { 'D', 'M', 'm', 'S', 'B' },
  8 => Set(30) {
    'DCGS0058',
    'DCGS0068',
    'DCGS0004',
    'DCGS0076',
    'DCGS0003',
    'DCGS0072',
    'DCGS0044',
    'DCGS0006',
    'DCGS0016',
    'DCGS0027',
    'DCGS0036',
    'DCGS0039',
    'DCGS0060',
    'DCGS0056',
    'DCGS0059',
    'DCGSLBOY',
    'DCGS0053',
    'DCGS0062',
    'DCGS0037',
    'DCGSSBOY',
    'DCGS0069',
    'DCGS0070',
    'DCGS0075',
    'DCGS0041',
    'DCGS0055',
    'DCGS0074',
    'DCGS0057',
    'DCGS0073',
    'DCGS0071',
    'DCGS0067'
  },
  3 => Set(1) { 'DOT' },
  2 => Set(2) { 'C2', 'C3' },
  12 => Set(10) {
    'BANK CHARGES',
    'gift_0001_80',
    'gift_0001_20',
    'gift_0001_10',
    'gift_0001_50',
    'gift_0001_30',
    'gift_0001_40',
    'gift_0001_60',
    'gift_0001_70',
    'gift_0001_90'
  },
  9 => Set(5) {
    'DCGS0066N',
    'DCGSSGIRL',
    'DCGSLGIRL',
    'AMAZONFEE',
    'DCGS0066P'
  }
}
```

## [**data_v1/updateV2.ts**](https://github.com/ryuto2357/database-aol/blob/main/data_v1/updateV2.ts)

This code runs to fix the inconsistent InvoiceDate values that we found earlier.

First, we use a `Map` to store the earliest InvoiceDate for each unique InvoiceNo. Then, we loop through all the rows again and replace their InvoiceDate with the earliest date from the Map.

Finally, we use `stringify()` to convert the cleaned data back into CSV format and save it as data_v2.

We kept all 1067371 rows without removing any data.

# **Cleaning CSV data from v1 to v2**

We found out that some invoices have different InvoiceDate values even though they have the same InvoiceNo. We used [data_v1/updateV2.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v1/updateV2.ts) to change all InvoiceDate values to the earliest date of that invoice.

We saved the cleaned data as data_v2, without removing any rows.

# Analyzing data v2

After creating data_v2, we ran some checks again to confirm that the InvoiceDate issue was fixed and to analyze the StockCode descriptions.

## [data_v2/scripts/checkInvoiceDate.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v2/scripts/checkInvoiceDate.ts)

This code runs to check whether any invoices still have different InvoiceDate values. Here is the output:

```
0
```

We confirmed that all invoices now have consistent InvoiceDate values.

## [data_v2/scripts/checkStockDescription.ts](https://github.com/ryuto2357/database-aol/blob/main/data_v2/scripts/checkStockDescription.ts)

This code runs to check how many different non-empty Descriptions each StockCode has. Here is the output:

```bash
No Description: 355
One Description: 3736
More Description: 1214
=====
79323P Set(2) { 'PINK CHERRY LIGHTS', 'Unsaleable, destroyed.' }
79323W Set(2) { 'WHITE CHERRY LIGHTS', 'Unsaleable, destroyed.' }
21232 Set(2) {
  'STRAWBERRY CERAMIC TRINKET BOX',
  'STRAWBERRY CERAMIC TRINKET POT'
}
21523 Set(4) {
  'FANCY FONT HOME SWEET HOME DOORMAT',
  'DOOR MAT FANCY FONT HOME SWEET HOME',
  'DOORMAT FANCY FONT HOME SWEET HOME',
  'amendment'
}
22350 Set(2) { 'CAT BOWL', 'ILLUSTRATED CAT BOWL' }
22349 Set(2) {
  'DOG BOWL , CHASING BALL DESIGN',
  'DOG BOWL CHASING BALL DESIGN'
}
22195 Set(2) {
  'HEART MEASURING SPOONS LARGE',
  'LARGE HEART MEASURING SPOONS'
}
22353 Set(2) {
  'LUNCHBOX WITH CUTLERY FAIRY CAKES',
  'LUNCH BOX WITH CUTLERY FAIRY CAKES'
}
48173C Set(4) {
  'DOOR MAT BLACK FLOCK',
  'MIA',
  'DOORMAT BLACK FLOCK',
  'damaged'
}
84879 Set(3) {
  'ASSORTED COLOUR BIRD ORNAMENT',
  'Dotcom multiples',
  'damaged'
}
22142 Set(2) { 'CHRISTMAS CRAFT WHITE FAIRY', 'check' }
35004B Set(2) { 'SET OF 3 BLACK FLYING DUCKS', '?' }
82582 Set(4) { 'AREA PATROLLED METAL SIGN', '?', 'missings', '??' }
21181 Set(7) {
  'PLEASE ONE PERSON  METAL SIGN',
  'PLEASE ONE PERSON METAL SIGN',
  'missing',
  'on cargo order',
  'adjustment',
  'check',
  'dotcom'
}
22130 Set(3) {
  'PARTY CONE CHRISTMAS DECORATION',
  'sold in wrong qnty',
  'sold as set on dotcom'
}
21360 Set(2) { 'JOY LARGE WOOD LETTERS', 'Show Samples' }
21351 Set(2) { 'CINAMMON & ORANGE WREATH', 'damaged' }
21352 Set(2) { 'EUCALYPTUS & PINECONE  WREATH', 'check' }
35400 Set(2) { 'WOODEN BOX ADVENT CALENDAR', 'damages' }
37370 Set(3) {
  'RETRO COFFEE MUGS ASSORTED',
  'sold as set/6 by dotcom',
  'damages/dotcom?'
}
22271 Set(2) { 'FELTCRAFT DOLL ROSIE', 'check' }
22272 Set(2) { 'FELTCRAFT DOLL MARIA', 'Damaged' }
21100 Set(4) {
  'CHARLIE AND LOLA CHARLOTTE BAG',
  'bad quality',
  'counted',
  'Damaged'
}
21033 Set(2) { 'JUMBO BAG CHARLIE AND LOLA TOYS', 'taig adjust no stock' }
20711 Set(3) { 'JUMBO BAG TOYS', 'check', 'lost in space' }
85132A Set(2) { 'CHARLIE + LOLA BISCUITS TINS', 'damaged' }
85132C Set(2) { 'CHARLIE AND LOLA FIGURES TINS', 'damages' }
22138 Set(3) { 'BAKING SET 9 PIECE RETROSPOT', 'mouldy', 'damages' }
22139 Set(4) {
  'RETRO SPOT TEA SET CERAMIC 11 PC',
  '11 PC CERAMIC TEA SET POLKADOT',
  'RETROSPOT TEA SET CERAMIC 11 PC',
  'amazon'
}
22352 Set(2) {
  'LUNCHBOX WITH CUTLERY RETROSPOT',
  'LUNCH BOX WITH CUTLERY RETROSPOT'
}
```

We found out that 355 StockCodes have no usable Description, 3736 have one, and 1214 have more than one.

Because of this, we need to select one suitable Description for each product, while keeping the original Description in each transaction line.

# **Cleaning CSV data from v2 to v3**

## [**data_v2/scripts/exportV3.ts**](https://github.com/ryuto2357/database-aol/blob/main/data_v2/scripts/exportV3.ts)

This code runs to clean the StockCode, Description, and Customer ID formats.

We used `trim()` to remove extra spaces from StockCode and Description. We also removed the `.0` suffix from Customer IDs, for example `13085.0` becomes `13085`.

Finally, we used `stringify()` to save the cleaned data as `data_v3/data/data_v3.csv`.

We kept all 1067371 rows without removing any data.

# **Separating CSV into 5 Tables**

After cleaning the data, we decided to separate it into 5 tables: **Country, Customer, Product, Invoice, and InvoiceLine**.

We separated them to reduce duplicated data and achieve 3NF normalization.

- **Country:** Stores each unique country, so we don't repeat country names in every transaction.
- **Customer:** Stores each unique Customer ID and its information.
- **Product:** Stores each unique StockCode, its Description, UnitPrice, and inventory information.
- **Invoice:** Stores information about each invoice, including CustomerID, CountryID, InvoiceDate, and Status.
- **InvoiceLine:** Stores every transaction line, including Quantity and historical UnitPrice.

We decided to keep CountryID in Invoice because some customers have transactions in different countries. We also kept UnitPrice and OriginalDescription in InvoiceLine to preserve historical transaction data.

## [import_csv/scripts/countries.ts](https://github.com/ryuto2357/database-aol/blob/main/import_csv/scripts/countries.ts)

This code runs to get all unique countries, sort them alphabetically, and assign a CountryID to each country. We found 43 unique countries.

## [import_csv/scripts/customers.ts](https://github.com/ryuto2357/database-aol/blob/main/import_csv/scripts/customers.ts)

This code runs to get all unique Customer IDs, excluding blank values. We also generated demo CustomerName and Email values for each customer.

## [import_csv/scripts/products.ts](https://github.com/ryuto2357/database-aol/blob/main/import_csv/scripts/products.ts)

This code runs to get all unique StockCodes. We selected the latest suitable Description and UnitPrice for each product, excluding invalid descriptions and prices. We also set the default StockQuantity to 100 for stock-tracked products, and 0 for non-stock products.

## [import_csv/scripts/invoices.ts](https://github.com/ryuto2357/database-aol/blob/main/import_csv/scripts/invoices.ts)

This code runs to get all unique invoices. We assigned CustomerID, CountryID, InvoiceDate, and InvoiceType to each invoice. We also set the default Status to Completed.

## [import_csv/scripts/invoiceLines.ts](https://github.com/ryuto2357/database-aol/blob/main/import_csv/scripts/invoiceLines.ts)

This code runs to separate every transaction row into InvoiceLine. We assigned a unique LineID to each row and kept the original Quantity, UnitPrice, and Description to preserve historical data.

Finally, we used `stringify()` to export the 5 tables into separate CSV files inside `import_csv/data/`.

# Database Design

After separating the data into 5 CSV files, we designed an ERD to show the relationships between the tables.

## Entity Relationship Diagram (ERD)

![image.png](Documentation%20KoDes%20Retail/image.png)

We designed the tables to achieve 3NF normalization, so we can reduce duplicated data and keep the relationships consistent.

The relationships are:

- **Customer → Invoice:** One customer can have many invoices, but an invoice can also have no CustomerID because some data is missing.
- **Country → Invoice:** One country can have many invoices, but each invoice belongs to one country.
- **Invoice → InvoiceLine:** One invoice can contain many transaction lines.
- **Product → InvoiceLine:** One product can appear in many transaction lines.

# Creating the Database

## [sql/schema.sql](https://github.com/ryuto2357/database-aol/blob/main/sql/schema.sql)

After separating the data into 5 CSV files, we used MariaDB to create our relational database.

First, we created the database `kodes_retail`. We used `utf8mb4_bin` to make StockCode case-sensitive, because StockCodes like `M` and `m` are different.

```sql
CREATE DATABASE kodes_retail
CHARACTER SET utf8mb4
COLLATE utf8mb4_bin;

USE kodes_retail;
```

### Creating Country and Customer

We created the Country and Customer tables to store unique countries and customers.

```sql
CREATE TABLE Country (
    CountryID INT AUTO_INCREMENT PRIMARY KEY,
    CountryName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Customer (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    Email VARCHAR(255) UNIQUE
);
```

### Creating Product

We created the Product table to store each unique StockCode, its Description, UnitPrice, and inventory information.

We used `CHECK` to prevent negative prices and stock quantities. We also added `IsStockTracked` to separate physical products from non-stock items.

```sql
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
```

### Creating Invoice

We created the Invoice table to store information about each unique invoice.

We allowed CustomerID to be NULL because some transactions have missing Customer IDs. We also added Status, CancelledAt, and CancellationReason to support cancelling invoices without deleting historical data.

```sql
CREATE TABLE Invoice (
    InvoiceNo VARCHAR(16) PRIMARY KEY,
    CustomerID INT,
    CountryID INT NOT NULL,
    InvoiceDate DATETIME NOT NULL,
    InvoiceType VARCHAR(20) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    CancelledAt DATETIME,
    CancellationReason VARCHAR(255),

    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    FOREIGN KEY (CountryID) REFERENCES Country(CountryID)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    CHECK (InvoiceType IN ('Sale', 'Return', 'Adjustment')),
    CHECK (Status IN ('Completed', 'Cancelled'))
);
```

### Creating InvoiceLine

Finally, we created InvoiceLine to store every transaction line.

We kept the original UnitPrice and Description because these values can be different from the current Product information.

```sql
CREATE TABLE InvoiceLine (
    LineID BIGINT AUTO_INCREMENT PRIMARY KEY,
    InvoiceNo VARCHAR(16) NOT NULL,
    StockCode VARCHAR(20) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(12,3) NOT NULL,
    OriginalDescription VARCHAR(255),

    FOREIGN KEY (InvoiceNo) REFERENCES Invoice(InvoiceNo)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    FOREIGN KEY (StockCode) REFERENCES Product(StockCode)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);
```

# Phase 3 - SQL Queries

## [sql/queries.sql](https://github.com/ryuto2357/database-aol/blob/main/sql/queries.sql)

After creating the database and importing the 5 CSV files, we wrote 5 SQL queries to perform the required operations and analyze the data.

### Query 1 - Price Adjustment

We used `UPDATE` to increase the UnitPrice by 8% for products with a price below 5.00. We used `ROUND()` to keep 3 decimal places.

```sql
-- Query 1
UPDATE Product
SET UnitPrice = ROUND(UnitPrice * 1.08, 3)
WHERE UnitPrice < 5.00;
```

We only updated the current price in Product. The original UnitPrice in InvoiceLine was not changed.

### Query 2 - Order Cancellation

We used `UPDATE` to cancel an invoice by changing its Status to `Cancelled`. We also saved the cancellation time using `NOW()` and added a cancellation reason.

```sql
-- Query 2
UPDATE Invoice
SET
    Status = 'Cancelled',
    CancelledAt = NOW(),
    CancellationReason = 'Customer request'
WHERE InvoiceNo = '489434';
```

We did not delete the invoice or its InvoiceLine records, so the historical transaction data is still available.

### Query 3 - Regional Sales Breakdown

We used `JOIN` to connect Country, Invoice, and InvoiceLine. We calculated the revenue with `SUM()` and counted unique invoices with `COUNT(DISTINCT)`. Then we used `GROUP BY` to show the results for each country.

```sql
-- Query 3
SELECT
    Country.CountryName AS Country,
    SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) AS TotalRevenue,
    COUNT(DISTINCT Invoice.InvoiceNo) AS TotalInvoices
FROM Country
JOIN Invoice ON Country.CountryID = Invoice.CountryID
JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
WHERE Invoice.Status = 'Completed' AND Invoice.InvoiceType = 'Sale'
GROUP BY Country.CountryID
ORDER BY TotalRevenue DESC;
```

We only included completed Sale invoices. This gives us sales revenue without subtracting returns. In our results, the United Kingdom had the highest revenue.

### Query 4 - VIP High-Spender Identification

We wanted to find customers whose total spending is higher than the average spending of all registered customers.

First, we stored the number of customers in `@CustomerCount`. Then we used a nested query inside `HAVING` to calculate the average spending and compare it with each customer's TotalSpend.

```sql
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
GROUP BY Customer.CustomerID
HAVING TotalSpend > (
    SELECT SUM(InvoiceLine.Quantity * InvoiceLine.UnitPrice) / @CustomerCount
    FROM Invoice
    JOIN InvoiceLine ON Invoice.InvoiceNo = InvoiceLine.InvoiceNo
    WHERE Invoice.Status = 'Completed'
      AND Invoice.InvoiceType = 'Sale'
      AND Invoice.CustomerID IS NOT NULL
)
ORDER BY TotalSpend DESC;
```

We divided the total spending of identified customers by the number of all registered customers. This also includes customers with no completed sales in the average.

### Query 5 - Products Not Purchased in Germany

We wanted to find products that were never purchased in Germany but were purchased in at least 2 other countries.

We used a nested query with `NOT IN` to exclude products purchased in Germany. Then we used `COUNT(DISTINCT Invoice.CountryID)` and `HAVING` to keep products purchased in at least 2 countries.

```sql
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
GROUP BY Product.StockCode
HAVING CountryCount >= 2
ORDER BY CountryCount DESC;
```

We only counted completed Sale invoices with positive quantities and a known CustomerID. Since the products bought in Germany are excluded, `CountryCount >= 2` means at least 2 other countries.

# Phase 4 - Advanced SQL

## [sql/advanced.sql](https://github.com/ryuto2357/database-aol/blob/main/sql/advanced.sql)

After finishing the 5 queries, we created a trigger and a stored procedure in MariaDB.

### Inventory Trigger

We created a trigger called `UpdateInventory` to automatically update StockQuantity when a new row is inserted into InvoiceLine.

```sql
-- Create Trigger
CREATE TRIGGER UpdateInventory
AFTER INSERT ON InvoiceLine
FOR EACH ROW
UPDATE Product
JOIN Invoice ON Invoice.InvoiceNo = NEW.InvoiceNo
SET Product.StockQuantity = Product.StockQuantity - NEW.Quantity
WHERE Product.StockCode = NEW.StockCode
    AND Product.IsStockTracked = TRUE;
```

We used `AFTER INSERT` so the trigger runs automatically after adding a new InvoiceLine. `NEW.Quantity` and `NEW.StockCode` refer to the values of the newly inserted row.

For example, if a product has 100 units and we insert a sale with Quantity `5`, its stock becomes `95`. If we insert a return with Quantity `-5`, its stock increases by 5.

We only update products with `IsStockTracked = TRUE`. The original CSV did not contain real stock balances, so we used 100 units as the default stock for tracked products for testing.

This trigger only runs when a new InvoiceLine is inserted. It does not automatically reverse stock changes when an invoice is cancelled or an existing line is changed.

### Customer Invoice History Procedure

We created a stored procedure called `GetCustomerInvoiceHistory` to get the invoice history of a customer using their CustomerID.

```sql
-- Create Function
DELIMITER nahida

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
END nahida

DELIMITER ;
```

We used `IN custID INT` to receive the CustomerID. We then used `JOIN` to connect Invoice and InvoiceLine, and `SUM()` with `GROUP BY` to calculate the total for each invoice.

We used `ORDER BY InvoiceDate DESC` to show the newest invoices first. The result includes completed invoices, cancelled invoices, and returns because we wanted to show the customer's invoice history.

We used `DELIMITER ///` because the procedure contains a semicolon inside `BEGIN ... END`. After creating the procedure, we changed the delimiter back to `;`.

We can run the procedure using:

```sql
CALL GetCustomerInvoiceHistory(13085);
```

This returns the InvoiceNo, InvoiceDate, InvoiceType, Status, and InvoiceTotal for customer `13085`.