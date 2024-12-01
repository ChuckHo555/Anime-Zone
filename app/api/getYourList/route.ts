import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const tab = searchParams.get("tab");

  if (!userId || !tab) {
    return NextResponse.json({ error: "Missing userId or tab" }, { status: 400 });
  }

  try {
    let query = "";
    switch (tab) {
      case "Watch Later":
        query = `
          SELECT CAST(wl.animeId AS CHAR) AS animeId, vs.status
          FROM watchlater wl
          LEFT JOIN viewing_status vs ON wl.userId = vs.userId AND wl.animeId = vs.animeId
          WHERE wl.userId = ?
        `;
        break;
      case "Favorites":
        query = `
          SELECT CAST(f.animeId AS CHAR) AS animeId, vs.status
          FROM favorites f
          LEFT JOIN viewing_status vs ON f.userId = vs.userId AND f.animeId = vs.animeId
          WHERE f.userId = ?
        `;
        break;
      case "In Progress":
        query = `
          SELECT CAST(vs.animeId AS CHAR) AS animeId, vs.status
          FROM viewing_status vs
          WHERE vs.userId = ? AND vs.status = 'In Progress'
        `;
        break;
      case "Finished":
        query = `
          SELECT CAST(vs.animeId AS CHAR) AS animeId, vs.status
          FROM viewing_status vs
          WHERE vs.userId = ? AND vs.status = 'Finished'
        `;
        break;
      default:
        return NextResponse.json({ error: "Invalid tab" }, { status: 400 });
    }

    const [rows] = (await db.query(query, [userId])) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    console.log("getYourList Response:", rows); // Debug log
    return NextResponse.json(rows || []);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
  }
}

