// test/test_db.js

import { performWithLock } from "../lib/lock.js";
import { backupDatabase, restoreDatabase } from "../lib/backup.js";
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
    logger("TEST", pc.magenta, console.info, "Insert Into test passed\n");
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
    logger("TEST", pc.magenta, console.info, "Select test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Select test failed\n", error);
  }
}

function testCreateIndex_v1() {
  try {
    createIndex("users", "name");
    createIndex("users", "age");
    logger("TEST", pc.magenta, console.info, "Create Index test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Create Index test failed\n", error);
  }
}

function testSearchWithIndex_v1() {
  try {
    searchWithIndex("users", "name", "Salah");
    searchWithIndex("users", "age", 19);
    logger("TEST", pc.magenta, console.info, "Search Index test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Search Index test failed\n", error);
  }
}

function testBackupDatabase_v1() {
  try {
    backupDatabase("backup");
    logger("TEST", pc.magenta, console.info, "Backup test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Backup test failed\n", error);
  }
}

function testRestoreDatabase_v1() {
  try {
    restoreDatabase("backup");
    logger("TEST", pc.magenta, console.info, "Restore test passed\n");
  } catch (error) {
    logger("TEST", pc.red, console.error, "Restore test failed\n", error);
  }
}

async function testLock_v1() {
  try {
    const insertQueries = [
      "INSERT INTO users (id, name, age, student) VALUES (5, 'Mohsen', 30, false)",
      "INSERT INTO users (id, name, age, student) VALUES (6, 'Abdo', 14, true)",
    ];

    const performInsert = (query, taskName) =>
      performWithLock("users", async () => {
        // Removed "const"
        logger("TEST", pc.magenta, console.info, `${taskName} started`);
        await insertInto(query); // Ensure insertion completes before delay

        await new Promise((res) => setTimeout(res, 5000)); // 5 seconds
        logger("TEST", pc.magenta, console.info, `${taskName} completed`);
      });

    const promises = [
      performInsert(insertQueries[0], "Task 1"),
      performInsert(insertQueries[1], "Task 2"),
    ];

    await Promise.allSettled(promises);
    logger("TEST", pc.magenta, console.info, "Locks test passed\n");
  } catch (error) {
    logger("TEST", pc.magenta, console.error, "Locks test failed\n", error);
  }
}

function main() {
  testCreateTable_v1();
  testInsertInto_v1();
  testSelect_v1();
  testCreateIndex_v1();
  testSearchWithIndex_v1();
  testBackupDatabase_v1();
  testRestoreDatabase_v1();
  testLock_v1();
}

main();
