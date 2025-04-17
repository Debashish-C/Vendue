import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "shishdeba",
  host: "localhost",
  port: 5432,
  database: "vendue_db",
});

export const query = (text, params) => pool.query(text, params);
