import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";

type AnimeModalPageProps = {
  params: Promise<{ animeId: string }>;  
};

export default async function AnimeModalPage({
  params,
}: AnimeModalPageProps) {

  const resolvedParams = await params;

  return <DetailedAnimeModal animeId={resolvedParams.animeId} />;
}
