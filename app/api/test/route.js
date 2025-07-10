import { TrollFession } from "../../models";
import { dbConnect } from "../../mongoose";

export async function GET() {
  try {
    await dbConnect();
    const count = await TrollFession.countDocuments();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Database connected successfully",
        postCount: count,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
