import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            description
            genres
            averageScore
            popularity
            coverImage {
              large
            }
          }
        }
      }
    `;

    const url = 'https://graphql.anilist.co';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error('AniList API Error:', await response.text());
      return NextResponse.json(
        { error: 'Error fetching data from AniList API' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: 'Error fetching data from AniList API' },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data.Page.media);
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    return NextResponse.json({ error: 'Failed to fetch popular anime' }, { status: 500 });
  }
}
