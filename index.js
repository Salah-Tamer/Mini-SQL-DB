// index.js

//Storage
export { DATABASE_PATH, getTableFilePath, readJSON, writeJSON } from "./lib/storage.js";

//Schema
export { createTable } from "./lib/schema.js";

//Queries
export { insertInto, select } from "./lib/query.js";

//Indexing
export { createIndex, searchWithIndex } from "./lib/indexing.js";

//Backup
export { backupDatabase, restoreDatabase } from "./lib/backup.js";

//Lock
export { lockTable, performWithLock } from "./lib/lock.js";

//log
export { logError, logDebug, logInfo, logSuccess } from "./logger/logger.js";
