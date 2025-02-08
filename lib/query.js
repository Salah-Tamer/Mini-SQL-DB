// lib/query.js

import { logError, logSuccess } from "../logger/logger.js";
import { getTableFilePath, readJSON, writeJSON } from "./storage.js";

/**
 * @module query
 * @description Parses and executes SQL queries
 */

/**
 * insert a row into a table
 * @param {string} query - SQL query to insert data
 */

export function insertInto(query) {
  const match = query.match(/INSERT INTO (\w+) \((.+)\) VALUES \((.+)\)/i);

  if (!match) {
    logError("Invalid INSERT INTO query");
    throw new Error("Invalid INSERT INTO query");
    //TODO: Make it smart by checking what is missing in the query
  }

  const tableName = match[1];
  const columns = match[2].split(",").map((col) => col.trim());
  const values = match[3].split(",").map((val) => val.trim().replace(/'/g, "").replace(/"/g, ""));

  const schema = readJSON(getTableFilePath(tableName, "schema"));
  const data = readJSON(getTableFilePath(tableName, "data"));

  if (!schema) {
    logError(`Table ${tableName}.schema doesn't exist`);
    throw new Error(`Table ${tableName}.schema doesn't exist`);
  }

  const row = {};
  columns.forEach((col, index) => {
    if (!schema[col]) {
      logError(`Column ${col} doesn't exist in the table "${tableName}"`);
      throw new Error(`Column ${col} doesn't exist in the table "${tableName}"`);
    }

    row[col] = schema[col] === "INT" ? parseInt(values[index], 10) : values[index];
    // TODO: Check for boolean.
  });

  data.push(row);
  writeJSON(getTableFilePath(tableName, "data"), data);
  logSuccess(`Row inserted into table "${tableName}"!`);
}

/**
 * Select rows from a table based on a query.
 * @param {string} query - SQL query to select data.
 */

export function select(query) {
  const match = query.match(/SELECT (.+) FROM (\w+)/i);
  if (!match) {
    logError("Invalid SELECT query");
    throw new Error("Invalid SELECT query");
  }

  const columns = match[1].split(",").map((col) => col.trim());
  const tableName = match[2];

  const data = readJSON(getTableFilePath(tableName, "data"));
  if (!data) {
    logError(`Table "${tableName} doesn't exist`);
    throw new Error(`Table "${tableName} doesn't exist`);
  }

  const result = data.map((row) => {
    if (columns[0] === "*") {
      return row;
    }
    const selectedRow = {};
    columns.forEach((col) => (selectedRow[col] = row[col]));
    return selectedRow;
  });

  console.table(result);
  logSuccess(`SELECT Query executed successfully`);
}

export function selectWhere(query) {
  const match = query.match(/SELECT (.+) FROM (\w+)(?: WHERE (.+))?/i);
  if (!match) {
    logError("Invalid SELECT query");
    throw new Error("Invalid SELECT query");
  }

  const columns = match[1].split(",").map((col) => col.trim());
  const tableName = match[2];
  const condition = match[3] ? match[3].trim() : null;

  const data = readJSON(getTableFilePath(tableName, "data"));
  if (!data) {
    logError(`Table "${tableName}" doesn't exist`);
    throw new Error(`Table "${tableName}" doesn't exist`);
  }

  const validColumns = Object.keys(data[0]); // Get columns from the first row
  if (columns[0] !== "*" && !columns.every((col) => validColumns.includes(col))) {
    logError(`Invalid column(s)`);
    throw new Error(`Invalid column(s)`);
  }

  let filteredData = data;
  if (condition) {
    const conditions = condition.split(/\s+(AND|OR)\s+/i);
    filteredData = data.filter((row) => {
      let result = evaluateCondition(conditions[0], row);

      for (let i = 1; i < conditions.length; i += 2) {
        const operator = conditions[i].toUpperCase(); //AND, OR
        const nextCondition = conditions[i + 1];

        if (operator === "AND") {
          result = result && evaluateCondition(nextCondition, row);
        } else if (operator === "OR") {
          result = result || evaluateCondition(nextCondition, row);
        }
      }

      return result;
    });

    const result = filteredData.map((row) => {
      if (columns[0] === "*") {
        return row;
      }
      const selectedRow = {};
      columns.forEach((col) => (selectedRow[col] = row[col]));
      return selectedRow;
    });

    console.table(result);
    logSuccess(`SELECT Query executed successfully`);
  }
}

/**
 * Evaluates a single condition like "age > 25" or "name = 'John'".
 * @param {string} condition - The condition string.
 * @param {object} row - A single row of the table.
 * @returns {boolean} - Whether the row satisfies the condition.
 */
function evaluateCondition(condition, row) {
  const conditionMatch = condition.match(/(\w+)\s*(=|!=|>|<|>=|<=)\s*(['"]?[\w\s]+['"]?)/);
  if (!conditionMatch) {
    return false;
  }

  const [, column, operator, value] = conditionMatch;
  const parsedValue = isNaN(value) ? value.replace(/['"]/g, "") : Number(value);

  if (!(column in row)) {
    return false;
  }
  const rowValue = row[column];

  switch (operator) {
    case "=":
      return rowValue === parsedValue;
    case "!=":
      return rowValue !== parsedValue;
    case ">":
      return rowValue > parsedValue;
    case "<":
      return rowValue < parsedValue;
    case ">=":
      return rowValue >= parsedValue;
    case "<=":
      return rowValue <= parsedValue;
    default:
      return false;
  }
}
