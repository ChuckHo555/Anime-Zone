import { AnimeCardProps } from "@/util/constants";
import AnimeCarousel from "@/app/components/(scripts)/Carousel";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import DetailedAnimeModal from "@/app/components/(utility)/DetailedModal";


export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const animeId = resolvedSearchParams.modal;
  return (
    <div className="home-container">
      <div className="user-header">
        <VerifyUser />
        <p className={`font-bold text-3xl`}>
          {" "}
          Get Started with these popular animes!
        </p>
      </div>
      <div className="home-wrapper overflow-hidden">
        <AnimeCarousel/>
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
