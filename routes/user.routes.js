import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getDepartmentCounts,
  verifyToken
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/all-interns", getAllUsers);
router.get("/department-counts", getDepartmentCounts);  
router.get("/verify-token", verifyToken);

export default router;