import pool from "@/utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // 🔹 Buscar el usuario en la base de datos
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const user = users[0];

    console.log("Contraseña ingresada:", password);
    console.log("Contraseña en BD:", user.password);

    // 🔹 Comparar la contraseña encriptada
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("¿Contraseña válida?", isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    // 🔹 Generar token JWT
    const token = jwt.sign({ id: user.id, username: user.username }, "secreto_super_seguro", { expiresIn: "1h" });

    res.status(200).json({ message: "Login exitoso", token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
