import RecommendationList from "@/app/components/RecommendationList";
import DetailedAnimeModal from "@/app/components/DetailedModal";

export default async function RecommendationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams; 
  const animeId = resolvedSearchParams.animeId; 

  return (
    <div className="recommendation-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold mb-6">Recommended Anime</h1>

      <RecommendationList />

      {animeId && <DetailedAnimeModal animeId={animeId} />}
    </div>
  );
}
