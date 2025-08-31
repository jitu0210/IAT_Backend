import express from "express";
import {
  getAllGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  rateGroup,
  removeRating,
  initializeGroups,
  getLiveRatings,
  getGroupTotals   // ✅ added import
} from "../controllers/group.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all groups
router.get("/", protect, getAllGroups);

// Group totals (live ratings summary)
router.get("/group-totals", protect, getGroupTotals);

// Initialize groups (admin only)
router.post("/initialize", protect, initializeGroups);

// Get specific group
router.get("/:groupId", protect, getGroup);

// Join a group
router.post("/:groupId/join", protect, joinGroup);

// Leave a group
router.post("/:groupId/leave", protect, leaveGroup);

// Rate a group
router.post("/:groupId/rate", protect, rateGroup);

// Remove rating
router.delete("/:groupId/rating", protect, removeRating);

export default router;
