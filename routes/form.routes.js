// routes/form.routes.js
import express from "express";
import { 
  submitForm, 
  getAllForms, 
  getDailyForms, 
  getUserHistory,
  getAllUserActivities,
} from "../controllers/form.controller.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All form routes are protected
router.post("/submit-form", protect, submitForm);
router.get("/all-forms", protect, getAllForms);
router.get("/daily-forms", protect, getDailyForms);
router.get("/user-history/:userId", protect, getUserHistory);
router.get("/intern-activities", getAllUserActivities);

export default router;