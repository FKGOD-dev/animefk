import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Cambia esto si tienes otro usuario
  password: "Nicolas50$", // Si tienes una contraseña, agrégala aquí
  database: "explora_anime",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
