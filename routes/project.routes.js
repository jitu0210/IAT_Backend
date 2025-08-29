// routes/project.routes.js
import express from "express";
import {
  addProject,
  getAllProjects,
  getProject,
  deleteProject,
  updateProject,
  updateProjectProgress,
  updateProjectCheckpoints,
  updateCheckpoint,
} from "../controllers/project.controller.js";

const router = express.Router();

// Get all projects
router.get("/", getAllProjects);

// Get single Project
router.get('/:id', getProject);

// Create a new project
router.post("/", addProject);

// Update a project by ID (full update)
router.put("/:id", updateProject);

// Update just the progress of a project
router.patch("/:id/progress", updateProjectProgress);

// Update project checkpoints
router.put("/:id/checkpoints", updateProjectCheckpoints);

// Update a single checkpoint
router.patch("/:id/checkpoints/:checkpointId", updateCheckpoint);

// Delete a project by ID
router.delete("/:id", deleteProject);

export default router;