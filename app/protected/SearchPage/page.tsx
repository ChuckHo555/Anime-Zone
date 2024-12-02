import SearchBar from "@/app/components/(utility)/SearchBar";
import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import { Jaro } from "next/font/google";

const jaro = Jaro({
  subsets: ["latin"],
  weight: ["400", "400"],
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const animeId = resolvedSearchParams.animeId;

  return (
    <div className="search-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className={`text-4xl font-bold mb-6 ${jaro.className}`}>
        Search Anime
      </h1>
      <VerifyUser />

      <SearchBar placeholder="Search your anime..." />

      {animeId && <DetailedAnimeModal animeId={animeId} />}
    </div>
  );
}
