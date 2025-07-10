"use server";

import { revalidatePath } from "next/cache";
import { TrollFession } from "./models";
import { dbConnect } from "./mongoose";

// Server Action: Create a new troll-fession
export async function createTrollFession(formData) {
  const content = formData.get("content");
  if (
    !content ||
    typeof content !== "string" ||
    content.length === 0 ||
    content.length > 500
  )
    return;
  await dbConnect();
  await TrollFession.create({ content });
  revalidatePath("/");
}

// Server Action: Like/dislike a troll-fession
export async function voteTrollFession(id, type) {
  if (!id || (type !== "like" && type !== "dislike")) {
    throw new Error("Invalid request");
  }
  await dbConnect();
  const update =
    type === "like" ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
  await TrollFession.findByIdAndUpdate(id, update);
  revalidatePath("/");
}

// Server Action: Reply to a troll-fession
export async function replyTrollFession(id, content) {
  if (
    !id ||
    !content ||
    typeof content !== "string" ||
    content.length === 0 ||
    content.length > 500
  ) {
    throw new Error("Invalid request");
  }
  await dbConnect();
  await TrollFession.findByIdAndUpdate(id, {
    $push: { replies: { content } },
  });
  revalidatePath("/");
}
