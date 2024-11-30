import SearchBar from "@/app/components/SearchBar";
import DetailedAnimeModal from "@/app/components/DetailedModal";
import { AnimeCardProps } from "@/util/constants";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams; // Await searchParams
  const animeId = resolvedSearchParams.animeId; // Extract animeId from resolved params

  return (
    <div className="search-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Search Anime</h1>

      {/* Search Bar */}
      <SearchBar placeholder="Search your anime..." />

      {/* Detailed Modal */}
      {animeId && <DetailedAnimeModal animeId={animeId} />}
    </div>
  );
}
