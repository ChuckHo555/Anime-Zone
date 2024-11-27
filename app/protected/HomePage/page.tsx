import { AnimeCardProps } from "@/util/constants";
import AnimeCarousel from "@/app/components/Carousel";
import VerifyUser from "@/app/components/Auth/VerifyUser";

async function fetchPopularAnime() {
  const res = await fetch("http://localhost:3000/api/getAnime?type=popular", {
  });

  if (!res.ok) {
    throw new Error("Failed to fetch popular anime");
  }

  return res.json();
}

export default async function HomePage() {
  const popularList: AnimeCardProps["anime"][] = await fetchPopularAnime();

  return (
    <div className="home-container">
      <div className="user-header">
        <VerifyUser/>
      </div>
      <div className="home-wrapper overflow-hidden">
        <AnimeCarousel animes={popularList} />
      </div>
    </div>
  );
}
