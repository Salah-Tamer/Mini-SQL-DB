// test/test_db.js

import { createIndex, searchWithIndex } from "../lib/indexing.js";
import { insertInto, select } from "../lib/query.js";
import { createTable } from "../lib/schema.js";
import { logger } from "../logger/logger.js";
import pc from "picocolors";

function testCreateTable_v1() {
  const createTableQuery = "CREATE TABLE users (id int, name txt, age int, student boolean)";
  try {
    createTable(createTableQuery);
    logger("TEST", pc.magenta, console.info, "Table creation test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Table creation test failed\n", error);
  }
}

function testInsertInto_v1() {
  const insertQuery_1 = "INSERT INTO users (id, name, age, student) VALUES (1, 'Ahmed', 18, true)";
  const insertQuery_2 = "INSERT INTO users (id, name, age, student) VALUES (2, 'Salah', 19, true)";
  const insertQuery_3 = "INSERT INTO users (id, name, age, student) VALUES (3, 'Adham', 22, true)";
  const insertQuery_4 = "INSERT INTO users (id, name, age, student) VALUES (4, 'Omar', 25, false)";
  const insertQuery_5 =
    "INSERT INTO users (id, name, age, student) VALUES (4, 'Youssef', 19, true)";
  try {
    insertInto(insertQuery_1);
    insertInto(insertQuery_2);
    insertInto(insertQuery_3);
    insertInto(insertQuery_4);
    insertInto(insertQuery_5);
    logger("TEST", pc.magenta, console.error, "Insert Into test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Insert Into test failed\n", error);
  }
}

function testSelect_v1() {
  const selectQuery_1 = "SELECT id FROM users";
  const selectQuery_2 = "SELECT id, name FROM users";
  const selectQuery_3 = "SELECT * FROM users";
  try {
    select(selectQuery_1);
    select(selectQuery_2);
    select(selectQuery_3);
    logger("TEST", pc.magenta, console.error, "Select test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Select test failed\n", error);
  }
}

function testCreateIndex_v1() {
  try {
    createIndex("users", "name");
    createIndex("users", "age");
    logger("TEST", pc.magenta, console.error, "Create Index test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Create Index test failed\n", error);
  }
}

function testSearchWithIndex_v1() {
  try {
    searchWithIndex("users", "name", "Salah");
    searchWithIndex("users", "age", 19);
    logger("TEST", pc.magenta, console.error, "Search Index test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Search Index test failed\n", error);
  }
}

function main() {
  testCreateTable_v1();
  testInsertInto_v1();
  testSelect_v1();
  testCreateIndex_v1();
  testSearchWithIndex_v1();
}

main();
