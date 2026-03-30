---
slug: "banking-fraud-data-collection"
lang: "en"
title: "Banking Fraud Data Collection Project"
summary: "Form-based collection prototype for fictive banking transactions, combining HTML, JavaScript, PHP, and MySQL to capture behavioral signals related to risk and fraud scenarios."
---

# Overview

## Project scope
This project focuses on the data-intake layer of a fraud-oriented workflow.
Rather than starting from an existing transactional database, it creates a small web application designed to collect structured answers around fictive banking transactions, risk attitude, and declared willingness to commit fraud.

The repository therefore sits upstream of any predictive fraud model.
Its role is to define what is collected, how it is validated, and how the information is stored.
That scope is narrower than a full fraud analytics stack, but it addresses a real technical need: usable analysis begins with a usable data capture process.

## Functional perimeter
The application records identity placeholders, gender, country, state, city, transaction category, amount, a fraud-related answer, a money-preference score, and a risk-choice field.
Those variables are simple, but they show a deliberate attempt to combine transactional context with behavioral declarations.

The overall design makes the project closer to a data collection prototype than to a pure front-end exercise.
The point is not visual sophistication.
The point is the construction of a form-to-database path that can store structured answers consistently.

# Method

## Application architecture
The implementation is split across `index.html`, `app.js`, `connect.php`, and `database.sql`.
`index.html` defines the form and its fields.
`app.js` performs client-side validation and loads country, state, and city options dynamically.
`connect.php` receives the POST request and inserts the record into MySQL.
`database.sql` defines the `transactions` table used for storage.

The schema is deliberately compact.
It includes an auto-increment primary key plus fields for transaction context, behavioral responses, and a timestamp.
This is a coherent choice for a prototype because it keeps the storage model readable while remaining rich enough for later descriptive or classification work.

## Input validation and enrichment
On the client side, the form checks that the name field is not empty and that the amount stays within a `1` to `5000` euro range.
The interface also enriches geographic information through the CountryStateCity API, allowing the country, state, and city selectors to update dynamically.
This improves structure at input time instead of leaving geographic cleanup entirely for post-processing.

The backend uses a prepared `INSERT` statement.
That is an important detail because it shows awareness of safer database interaction patterns.
Even in a simple prototype, parameter binding is a more disciplined choice than manual string concatenation.

## Technical limitations visible in the code
The repository also exposes several implementation issues that are analytically useful to acknowledge.
In `connect.php`, the conversion rule checks whether `$_POST['fraud'] === 'Oui'`, while the form actually submits lowercase values `oui` and `non`.
In practice, that means the stored fraud flag is likely to collapse toward `0`.

The backend also contains a `var_dump($_POST)` debug statement, and the JavaScript file includes a client-side API key.
These elements indicate that the project is a working prototype rather than a hardened production service.
They do not erase the value of the architecture, but they define its maturity level clearly.

- [v] The repository covers the full path from web form to SQL persistence.
- [v] The use of a prepared statement shows awareness of safer insertion practices.
- [v] Dynamic geographic selectors improve the structure of collected data at input time.
- [!] The fraud-status mapping is inconsistent between front-end values and backend conversion logic.
- [!] Debug output and exposed client-side credentials limit the project from a security and deployment standpoint.

## Deployment logic
The documentation includes both local deployment with XAMPP and a lightweight external-hosting scenario through InfinityFree.
This is useful because it shows that the project was approached as a runnable application, not only as disconnected files.

At the same time, the repository remains intentionally simple.
There is no authentication, no audit trail, no server-side rate limiting, and no advanced fraud feature engineering layer.
The technical contribution lies in the collection pipeline itself.

# Value

## What the project demonstrates
The project demonstrates the ability to design a small full-stack collection workflow with a clear storage target.
It shows how front-end form design, JavaScript enrichment, PHP request handling, and SQL schema definition can be combined into a single operational chain.

It also highlights something valuable from an engineering perspective: the capacity to inspect one’s own implementation critically.
The current codebase reveals both sound elements, such as prepared SQL insertion, and weak points, such as inconsistent boolean encoding.
That contrast makes the project informative rather than artificially polished.

## Portfolio relevance
Taken together, the repository shows an understanding that analytical systems depend on data capture quality.
A large part of applied data work consists not in model selection, but in making sure variables are collected in a structured, queryable, and minimally validated form.

This project is analytically useful in two ways.
First, it demonstrates a concrete form-to-database implementation.
Second, it makes visible the practical issues that separate a functioning prototype from a robust data product.
That combination gives the project technical honesty and operational relevance.

- [v] The project highlights full-stack integration around structured data capture.
- [v] It shows how behavioral variables can be encoded alongside transaction context.
- [v] The repository makes architecture, schema, and deployment assumptions explicit.
- [!] Its strongest contribution lies in prototype design and collection logic rather than in downstream fraud modeling.
