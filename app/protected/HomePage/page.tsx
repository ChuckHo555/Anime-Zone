import { AnimeCardProps } from "@/util/constants";
import AnimeCarousel from "@/app/components/Carousel";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import DetailedAnimeModal from "@/app/components/DetailedModal";

async function fetchPopularAnime() {
  const res = await fetch("http://localhost:3000/api/getAnime?type=popular");

  if (!res.ok) {
    throw new Error("Failed to fetch popular anime");
  }

  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const popularList: AnimeCardProps["anime"][] = await fetchPopularAnime();

  const animeId = resolvedSearchParams.modal;
  return (
    <div className="home-container relative">
      <div className="user-header">
        <VerifyUser />
          Get Started with these popular animes!
        </div>

      {/* Carousel Section */}
      <div className="home-wrapper overflow-hidden">
        <AnimeCarousel animes={popularList} />
      </div>

      {/* Display Modal if 'modal' exists in the URL */}
      {animeId && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          {/* Dynamically Render Anime Modal */}
          <div className="max-w-3xl w-full p-4">
            <DetailedAnimeModal animeId={animeId} />
          </div>
        </div>
      )}
    </div>
  );
}
