const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // or use DATABASE_URL if using a full connection string
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});

connection.connect((err) => {
  if (err) {
    console.log("Error conecting to the database: ", err.stack());
  }
  console.log("Connected to the MySQL database.");
});

module.exports = connection;
