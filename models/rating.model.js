import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ratings: {
    communication: { type: Number, min: 0, max: 10, required: true },
    presentation: { type: Number, min: 0, max: 10, required: true },
    content: { type: Number, min: 0, max: 10, required: true },
    helpfulForCompany: { type: Number, min: 0, max: 5, required: true },
    helpfulForInterns: { type: Number, min: 0, max: 5, required: true },
    participants: { type: Number, min: 0, max: 5, required: true },
  },
  overall: { type: Number, min: 0, max: 40, required: true },
  comments: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
