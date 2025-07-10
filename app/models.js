import { Schema, model, models } from "mongoose";

const ReplySchema = new Schema({
  content: { type: String, required: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const TrollFessionSchema = new Schema({
  content: { type: String, required: true, maxlength: 500 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  replies: [ReplySchema],
});

export const Reply = models.Reply || model("Reply", ReplySchema);
export const TrollFession =
  models.TrollFession || model("TrollFession", TrollFessionSchema);
