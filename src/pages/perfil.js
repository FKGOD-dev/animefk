import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isClient, setIsClient] = useState(false); // 🔥 Evitar error de hidratación

  useEffect(() => {
    setIsClient(true); // 🔥 Se ejecuta solo en el cliente
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (typeof window === "undefined") return; // 🔥 Evitar SSR
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setNewUsername(data.username);
    }
  };

  const handleEditProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ username: newUsername }),
    });

    if (res.ok) {
      alert("Perfil actualizado correctamente");
      fetchUser();
      setIsEditing(false);
    } else {
      alert("Error al actualizar perfil");
    }
  };

  if (!isClient) {
    return <p className="text-center text-lg mt-10">Cargando...</p>; // 🔥 Evita el error de hidratación
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Perfil de Usuario</h1>

        {/* 🔹 Editar nombre de usuario */}
        {isEditing ? (
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newUsername} 
              onChange={(e) => setNewUsername(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <button onClick={handleEditProfile} className="bg-green-500 text-white px-4 py-2 rounded">Guardar</button>
            <button onClick={() => setIsEditing(false)} className="bg-red-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        ) : (
          <p className="text-xl">
            <strong>Nombre:</strong> {user?.username} 
            <button 
              onClick={() => setIsEditing(true)} 
              className="ml-2 text-blue-500 hover:underline"
            >
              ✏️ Editar
            </button>
          </p>
        )}

        <p className="text-xl"><strong>Correo:</strong> {user?.email}</p>
        <p className="text-xl"><strong>🆙 Nivel:</strong> {user?.level}</p>
        <p className="text-xl"><strong>🏆 Puntos:</strong> {user?.points}</p>

        {/* 🔹 Insignias */}
        <h2 className="text-2xl font-bold mt-6">🏅 Insignias</h2>
        <div className="flex gap-4 mt-2">
          {user?.badges && user.badges.length > 0 ? (
            user.badges.map((badge, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-300 text-black rounded-lg">{badge}</span>
            ))
          ) : (
            <p className="text-gray-500">Aún no tienes insignias.</p>
          )}
        </div>
      </div>
    </div>
  );
}
