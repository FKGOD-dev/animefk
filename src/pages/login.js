import { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar"; // 🔹 Agregar el Navbar

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    alert("Inicio de sesión exitoso.");
    router.push("/perfil");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* 🔹 Agregar el Navbar aquí */}
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <input type="email" name="email" placeholder="Correo" className="w-full p-2 border mb-2" onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" className="w-full p-2 border mb-4" onChange={handleChange} />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
