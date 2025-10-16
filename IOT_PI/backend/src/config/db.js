import { createPool } from 'mysql2/promise';
import 'dotenv/config';

export const pool = createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  timezone: 'Z',
});

export async function ensureSchema() {
  const createDataSensor = `
    CREATE TABLE IF NOT EXISTS data_sensor (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      temperature FLOAT,
      humidity FLOAT,
      light FLOAT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  const createActionHistory = `
    CREATE TABLE IF NOT EXISTS action_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      device VARCHAR(45),
      status VARCHAR(45)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await pool.query(createDataSensor);
  await pool.query(createActionHistory);
}
