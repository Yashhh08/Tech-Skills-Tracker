import { Document, Schema, model, models } from "mongoose";

export interface IAnswer extends Document {
    content: string,
    author: Schema.Types.ObjectId,
    question: Schema.Types.ObjectId,
    upvotes: Schema.Types.ObjectId[],
    downvotes: Schema.Types.ObjectId[],
    createdAt: Date
}

const answerSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
})

const Answer = models.Answer || model("Answer", answerSchema);

export default Answer;