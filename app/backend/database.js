/** @format */

import sqlite3 from "sqlite3";

class Database {
  constructor() {
    this.db = new sqlite3.Database(
      "./app/storage/riot-ssr.sqlite3",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    );
    this.init();
  }
  async init() {
    const table = [
      `DROP TABLE IF EXISTS test_table`,
      `CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
      )`,
      `insert into test_table (title, content) values ('title-01', 'content-01')`,
      `insert into test_table (title, content) values ('title-02', 'content-02')`,
      `insert into test_table (title, content) values ('title-03', 'content-03')`,
    ];
    for (const sql of table) {
      await this.runSql(sql);
    }
  }
  async runSql(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, {}, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export default new Database();
