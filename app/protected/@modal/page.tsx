import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";

type AnimeModalPageProps = {
  params: { animeId: string };
};

export default function AnimeModalPage({
  params,
}: AnimeModalPageProps) {
  return <DetailedAnimeModal animeId={params.animeId} />;
}
