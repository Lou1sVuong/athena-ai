import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  userAddress?: string;
}

const MessageSchema: Schema = new Schema({
  content: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "assistant"] },
  timestamp: { type: Date, default: Date.now },
  userAddress: { type: String },
});

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
