import { pool } from '../config/db.js';

export async function insertAction({device, action, time }) {
  await pool.execute(
    'INSERT INTO action_history (time, action, device) VALUES (?, ?, ?)',
    [time, action, device]
  );
}

export async function getActions({
  term = "",
  fieldToSearch = "",
  pageSize = 10,
  pageOrder = 1,
}) {
  const validFields = ["id", "time", "action", "device", "all"];
  const searchField = validFields.includes(fieldToSearch) ? fieldToSearch : "id";
  const offset = (pageOrder - 1) * pageSize;
  let sql = `SELECT * FROM action_history`;
  let params = [];

  if (term) {
    if (searchField === "all") {
      sql += ` WHERE 
        CAST(id AS CHAR) LIKE ? OR 
        CAST(time AS CHAR) LIKE ? OR 
        CAST(action AS CHAR) LIKE ? OR 
        CAST(device AS CHAR) LIKE ?`;
      for (let i = 0; i < 4; i++) params.push(`%${term}%`);
    } else {
      sql += ` WHERE CAST(${searchField} AS CHAR) LIKE ?`;
      params.push(`%${term}%`);
    }
  }

  sql += ` ORDER BY id DESC`;

  const [allRows] = await pool.query(sql, params);
  const totalRecords = allRows.length;

  sql += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  const [rows] = await pool.query(sql, params);
  return { data: rows, records: totalRecords };
}

export async function getLatestState(){
    const sql = `
    WITH RankedActions AS (
      SELECT
        id,
        action,
        device,
        time,
        ROW_NUMBER() OVER(PARTITION BY device ORDER BY id DESC) as rn
      FROM
        action_history
    )
    SELECT
      device,
      action
    FROM
      RankedActions
    WHERE
      rn = 1;
  `;
  const [rows] = await pool.query(sql);
  return rows;
}