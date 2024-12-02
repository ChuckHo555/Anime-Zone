import YourListComponent from "@/app/components/(scripts)/YourLists";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";
import { Jaro } from "next/font/google";

const jaro = Jaro({
  subsets: ["latin"],
  weight: "400",
});

export default async function YourList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const animeId = resolvedSearchParams.animeId;
  return (
    <div className="your-list-page-container bg-gray-900 text-white min-h-screen flex flex-col items-center py-8">
      <h1 className={`text-4xl font-bold mb-6 ${jaro.className}`}>
        Your Anime Lists
      </h1>
      <VerifyUser />

      {/* Main Content */}
      <YourListComponent />

      {animeId && <DetailedAnimeModal animeId={animeId} />}
    </div>
  );
}
