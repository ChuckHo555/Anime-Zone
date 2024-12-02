import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";

export default function AnimeModalPage({
  params,
}: {
  params: { animeId: string };
}) {
  return <DetailedAnimeModal animeId={params.animeId} />;
}
