import db from "@/util/connection";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { userId, username } = body;

    if (!userId) {
      console.error("Missing userId in request body");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE userId = ?",
      [userId]
    );
    console.log("Database query result:", rows);

    if (rows.length === 0) {
      console.log("User not found. Inserting into database...");
      await db.query("INSERT INTO users (userId, username) VALUES (?, ?)", [
        userId,
        username,
      ]);
      console.log("User inserted successfully.");
    } else {
      const existingUser = rows[0];
      if (existingUser.username !== username) {
        console.log("Username has changed. Updating the database...");
        await db.query("UPDATE users SET username = ? WHERE userId = ?", [
          username,
          userId,
        ]);
        console.log("Username updated successfully.");
      } else {
        console.log("Username has not changed.");
      }
    }

    return NextResponse.json(
      { message: "User stored successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in getUser API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
