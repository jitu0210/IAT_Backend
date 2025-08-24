// models/form.model.js
import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true // This should remain required
  },
  name: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  activities: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Form", formSchema);