import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("id");
  const type = searchParams.get("type") || "general";
  const search = searchParams.get("search");

  try {
    let query;

    if (search) {
      query = `
        query {
          Page(page: 1, perPage: 10) {
            media(search: "${search}", type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              genres
            }
          }
        }
      `;
    } else if (animeId) {
      query = `
        query {
          Media(id: ${animeId}) {
            id
            title {
              romaji
              english
              native
            }
            description
            genres
            averageScore
            coverImage {
              large
            }
            episodes
            season
            seasonYear
          }
        }
      `;
    } else if (type === "popular") {
      query = `
        query {
          Page(page: 1, perPage: 10) {
            media(sort: POPULARITY_DESC, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              genres
            }
          }
        }
      `;
    } else if (type === "seasonal") {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      const seasons = ["WINTER", "SPRING", "SUMMER", "FALL"];
      const currentSeason = seasons[Math.floor((currentMonth + 1) / 3) % 4];

      query = `
        query {
          Page(page: 1, perPage: 10) {
            media(season: ${currentSeason}, seasonYear: ${currentYear}, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              genres
            }
          }
        }
      `;
    } else {
      // Default query
      query = `
        query {
          Page(page: 1, perPage: 20) {
            media(type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              averageScore
              genres
            }
          }
        }
      `;
    }

    const url = "https://graphql.anilist.co";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: "Error fetching data from AniList API" },
        { status: 500 }
      );
    }

    if (search) {
      return NextResponse.json(data.data.Page.media); 
    } else if (animeId) {
      return NextResponse.json(data.data.Media); 
    } else if (type === "popular" || type === "seasonal") {
      return NextResponse.json(data.data.Page.media); 
    } else {
      return NextResponse.json(data.data.Page.media); 
    }
  } catch (error) {
    console.error("Error fetching anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime" },
      { status: 500 }
    );
  }
}
