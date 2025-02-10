import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function BlogPost({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className="text-center text-xl">Cargando...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center">{post.title}</h1>
        <p className="text-center text-gray-500">{post.date}</p>
        <img src={post.image_url} alt={post.title} className="w-full rounded-lg shadow-lg my-4" />
        <p className="text-lg text-gray-700">{post.content}</p>
      </div>
    </div>
  );
}

// 🔹 Obtener los datos de un artículo basado en el ID
export async function getServerSideProps({ params }) {
  const res = await fetch("https://api.jikan.moe/v4/anime");
  const data = await res.json();

  const article = data.data[params.id - 1];

  if (!article) {
    return { notFound: true };
  }

  return {
    props: {
      post: {
        id: params.id,
        title: article.title,
        date: new Date().toLocaleDateString(),
        content: `Aquí va un artículo más detallado sobre ${article.title}.`,
        image_url: article.images.jpg.image_url,
      },
    },
  };
}
