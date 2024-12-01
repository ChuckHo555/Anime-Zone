import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise";

// GET: Fetch user notes
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const [rows] = (await db.query(
      `SELECT animeId, note, userRating FROM user_notes WHERE userId = ?`,
      [userId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    return NextResponse.json(rows || []); // Ensure it always returns an array
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  const { userId, animeId, note, userRating } = await request.json();

  if (!userId || !animeId) {
    return NextResponse.json({ error: "Missing userId or animeId" }, { status: 400 });
  }

  // Ensure userRating is valid
  const parsedRating = parseInt(userRating, 10);
  if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 100) {
    return NextResponse.json({ error: "userRating must be an integer between 0 and 100" }, { status: 400 });
  }

  try {
    const query = `
      INSERT INTO user_notes (userId, animeId, note, userRating)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        note = VALUES(note),
        userRating = VALUES(userRating)
    `;

    await db.query(query, [userId, animeId, note, parsedRating]);

    return NextResponse.json({ message: "User note and rating updated successfully" });
  } catch (error) {
    console.error("Error updating user notes:", error);
    return NextResponse.json({ error: "Failed to update user notes" }, { status: 500 });
  }
}

