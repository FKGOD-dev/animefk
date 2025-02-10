import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // Redirige al inicio
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        ExploraAnime
      </Link>

      <div className="flex gap-4">
        <Link href="/explorar" className="hover:underline">Explorar</Link>
        <Link href="/blog" className="hover:underline">Blog</Link>

        {isLoggedIn ? (
          <>
            <Link href="/mis-favoritos" className="hover:underline">Mis Favoritos</Link>
            <Link href="/perfil" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200">Perfil</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/register" className="hover:underline">Registrarse</Link>
            <Link href="/login" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200">Iniciar Sesión</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
