import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  email: String,
  branch: String,
});

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: String,
  communication: { type: Number, min: 1, max: 40 },
  presentation: { type: Number, min: 1, max: 40 },
  content: { type: Number, min: 1, max: 40 },
  helpfulForCompany: { type: Number, min: 1, max: 40 },
  helpfulForInterns: { type: Number, min: 1, max: 40 },
  participation: { type: Number, min: 1, max: 40 },
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [memberSchema], // ✅ members array
    ratings: [ratingSchema], // ✅ ratings array
    totalRating: {
      type: Number,
      default: 0,
    },
    previousTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔹 Helper method to recalc avg rating
groupSchema.methods.updateStats = function () {
  if (this.ratings.length === 0) {
    this.totalRating = 0;
    return;
  }

  let totalPoints = 0;
  this.ratings.forEach((r) => {
    totalPoints +=
      r.communication +
      r.presentation +
      r.content +
      r.helpfulForCompany +
      r.helpfulForInterns +
      r.participation;
  });

  this.totalRating = totalPoints / this.ratings.length;
};

const Group = mongoose.model("Group", groupSchema);
export default Group;
