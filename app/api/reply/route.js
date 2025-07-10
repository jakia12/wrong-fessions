import { TrollFession } from "../../models";
import { dbConnect } from "../../mongoose";

export async function POST(req) {
  try {
    const { id, content } = await req.json();
    console.log("Reply API called with:", { id, content });

    if (
      !id ||
      !content ||
      typeof content !== "string" ||
      content.length === 0 ||
      content.length > 500
    ) {
      console.log("Invalid request data");
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }

    await dbConnect();
    console.log("Database connected, updating post:", id);

    const result = await TrollFession.findByIdAndUpdate(id, {
      $push: { replies: { content } },
    });

    console.log("Update result:", result);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in reply API:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
