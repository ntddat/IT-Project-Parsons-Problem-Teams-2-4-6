import { Schema } from "mongoose";

const ChatHistorySchema = new Schema({
    userID: Number,
    topic: String,
    context: String,
    question: String,
    prompt: String,
}, { collection: "chat_history" });

export default ChatHistorySchema;