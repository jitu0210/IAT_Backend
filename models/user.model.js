import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      enum: ["MBA", "Electrical", "Electronics", "CSE", "Mechanical"],
    },
    refreshtoken: {
      type: String,
    },

    // 🔹 Add joinedGroups array
    joinedGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],

    // 🔹 Add ratings array
    ratings: [
      {
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Group",
        },
        groupName: String,
        ratedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
