const mysql = require('mysql');

require('dotenv').config();

var pool = mysql.createPool({
  connectionLimit: 500,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
});

exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result, fields) => {
      if (error) return reject(error);

      return resolve(result.length == 1 ? result[0] : result);
    });
  });
};

exports.pool = pool;
