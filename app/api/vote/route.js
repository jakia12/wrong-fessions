import { TrollFession } from "../../models";
import { dbConnect } from "../../mongoose";

export async function POST(req) {
  const { id, type } = await req.json();
  if (!id || (type !== "like" && type !== "dislike")) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
  await dbConnect();
  const update =
    type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
  await TrollFession.findByIdAndUpdate(id, update);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
