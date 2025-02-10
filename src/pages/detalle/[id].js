import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function AnimeDetalle({ anime }) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className="text-center text-xl">Cargando...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center">{anime.title}</h1>
        <img src={anime.image_url} alt={anime.title} className="w-full rounded-lg shadow-lg my-4" />
        <p className="text-lg text-gray-700">{anime.description}</p>
        <p className="mt-4"><strong>Género:</strong> {anime.genre}</p>
        <p><strong>Calificación:</strong> {anime.rating}/10 ⭐</p>
        <p><strong>Año de estreno:</strong> {anime.release_year || "Desconocido"}</p>
      </div>
    </div>
  );
}

// 🔹 Obtener los datos de un anime desde MySQL
export async function getServerSideProps({ params }) {
  const res = await fetch(`http://localhost:3000/api/anime/${params.id}`);
  const data = await res.json();

  return {
    props: { anime: data },
  };
}
