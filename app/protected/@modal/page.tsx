import DetailedAnimeModal from "@/app/components/DetailedModal";

export default function AnimeModalPage({ params }: { params: { animeId: string } }) {
  return <DetailedAnimeModal animeId={params.animeId} />;
}
