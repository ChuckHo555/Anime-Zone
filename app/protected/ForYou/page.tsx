import RecommendationList from "@/app/components/(scripts)/ForYou";
import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";
import VerifyUser from "@/app/components/Auth/VerifyUser";


export default async function RecommendationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const animeId = resolvedSearchParams.animeId;

  return (
    <div className="recommendation-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className={`text-4xl font-bold mb-6`}>For You</h1>
      <VerifyUser />
      <RecommendationList />

      {animeId && <DetailedAnimeModal animeId={animeId} />}
    </div>
  );
}
