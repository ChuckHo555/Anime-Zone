import db from "@/util/connection";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { userId, profilePicUrl, username } = body;

    if (!userId) {
      console.error("Missing userId in request body");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query to check if user already exists
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    console.log("Database query result:", rows);

    // Insert user if not found
    if (rows.length === 0) {
      console.log("User not found. Inserting into database...");
      await db.query("INSERT INTO users (userId, profilePicUrl, username) VALUES (?, ?, ?)", [
        userId,
        profilePicUrl,
        username,
      ]);
      console.log("User inserted successfully.");
    } else {
      console.log("User already exists in database.");
    }

    return NextResponse.json({ message: "User stored successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in getUser API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
