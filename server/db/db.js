import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "shishdeba",
  host: "localhost",
  port: 5432,
  database: "vendue_db"
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client:', err.stack);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query:', err.stack);
    }
    console.log('Database connected successfully! Current time:', result.rows[0].now);
  });
});

// Error handling for pool
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

export const query = (text, params) => pool.query(text, params);