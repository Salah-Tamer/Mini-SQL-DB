# Mini SQL Database

A lightweight, file-based SQL database built in JavaScript, offering a simple and efficient way to manage structured data. It supports SQL-like queries, uses indexing for faster performance, and ensures safe concurrent access with built-in locking mechanisms.
## Features

- File-based storage using JSON files.
- SQL-like querying for easy data manipulation.
- Schema management for defining and validating table structures.
- Indexing support to improve query performance.
- Backup and restore functionality for data persistence.
- Concurrency control with table locking mechanisms.
- Logging utilities for debugging and monitoring.

## Folder Structure

```plaintext
mini-sql-db/
|--- lib/
|    |--- storage.js     # Creating JSON files to store data and run read/write operations
|    |--- schema.js      # Table schema management and validation
|    |--- query.js       # Query parsing and execution
|    |--- indexing.js    # Indexing and search operations
|    |--- backup.js      # Backup and restore operations
|    |--- mutex.js       # Mutex implementation for table locks
|    |--- locks.js       # Locking and unlocking tables
|--- logger/
|    |--- logger.js      # Logging utilities
|--- test/
|    |--- test_db.js     # All test functions
|--- .env                # Environment variables (Create your own)
|--- .gitignore          # Ignored files and folders
|--- .npmrc              # NPM configuration
|--- .prettierrc         # Prettier configuration
|--- eslint.config.js    # ESLint configuration
|--- index.js            # Entry point (re-exports required functions)
|--- package.json
|--- README.md
```

## Setup

- Clone the project
- Run `npm install` inside the project
- Create a `.env` file at root
- Add `MINI_SQL_DB_PATH="./database/"` in `.env` file

## Test

- Run `node test/test_db.js` # This is the test file of all library functions
