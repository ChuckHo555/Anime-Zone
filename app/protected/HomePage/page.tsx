import { AnimeCardProps } from "@/util/constants";
import AnimeCarousel from "@/app/components/(scripts)/Carousel";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";
import { Jaro } from "next/font/google";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const jaro = Jaro({
  subsets: ["latin"],
  weight: "400",
});

async function fetchPopularAnime() {
  const res = await fetch(`${baseUrl}/api/getAnime?type=popular`);

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
    <div className="home-container">
      <div className="user-header">
        <VerifyUser />
        <p className={`font-bold text-3xl ${jaro.className}`}>
          {" "}
          Get Started with these popular animes!
        </p>
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
