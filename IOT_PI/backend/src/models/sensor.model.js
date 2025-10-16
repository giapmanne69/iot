import { pool } from '../config/db.js';

export async function insertSensor({temperature, humidity, light, time}) {
  if (time) {
    await pool.execute(
      'INSERT INTO data_sensor (time, temperature, humidity, light) VALUES (?, ?, ?, ?)',
      [time, temperature, humidity, light]
    );
  } else {
    await pool.execute(
      'INSERT INTO data_sensor (temperature, humidity, light) VALUES (?, ?, ?, ?)',
      [temperature, humidity, light]
    );
  }
}

export async function getSensors({
  term,
  fieldToSearch = "",
  fieldToSort = "",
  sort,
  pageSize = 10,
  pageOrder = 1,
}) {
  const validFields = ["id", "time", "humidity", "temperature", "light", "all"];
  const searchField = validFields.includes(fieldToSearch) ? fieldToSearch : "id";
  const sortField = validFields.includes(fieldToSort) ? fieldToSort : "id";
  const sortOrder = sort === "ASC" ? "ASC" : "DESC";
  const offset = (pageOrder - 1) * pageSize;
  let sql = `SELECT * FROM data_sensor`;
  let params = [];

  // 🔍 Trường hợp có tìm kiếm
  if (term) {
    if (searchField === "all") {
      sql += ` WHERE 
        CAST(id AS CHAR) LIKE ? OR 
        CAST(time AS CHAR) LIKE ? OR 
        CAST(humidity AS CHAR) LIKE ? OR 
        CAST(temperature AS CHAR) LIKE ? OR 
        CAST(light AS CHAR) LIKE ?`;
      // push 5 lần để map với 5 dấu ?
      for (let i = 0; i < 5; i++) params.push(`%${term}%`);
    } else {
      sql += ` WHERE CAST(${searchField} AS CHAR) LIKE ?`;
      params.push(`%${term}%`);
    }
  }

  sql += ` ORDER BY ${sortField} ${sortOrder}`;
  
  // Lấy tổng số bản ghi trước khi phân trang
  const [allRows] = await pool.query(sql, params);
  const totalRecords = allRows.length;

  // Thêm LIMIT/OFFSET để phân trang
  sql += ` LIMIT ? OFFSET ?`;
  params.push(pageSize, offset);

  const [rows] = await pool.query(sql, params);
  return { data: rows, records: totalRecords };
}

export async function homeGetSensors() {
  const sql = 'SELECT * FROM data_sensor ORDER BY id DESC';
  const [rows] = await pool.query(sql);
  return rows.reverse();
}