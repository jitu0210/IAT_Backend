import mongoose from "mongoose";
import Project from "../models/project.model.js";

// ---------------- Create Project ---------------- //
// controllers/project.controller.js - addProject function
export const addProject = async (req, res) => {
  try {
    const { name, description, deadline, progress, links } = req.body;

    // Basic validation
    if (!name || !deadline) {
      return res.status(400).json({ error: "Name and deadline are required" });
    }

    // Filter out any empty links
    const filteredLinks = links ? links.filter(link => link.title && link.url) : [];

    // Default checkpoints (all 42 checkpoints)
    const defaultCheckpoints = [
      // Project Initiation and Planning (9 checkpoints)
      { label: "Bid Award & Contract Review", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Project Kick-off Meeting", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Define Project Scope & Objectives", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Stakeholder Identification & Analysis", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Requirements Gathering & Analysis", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Feasibility Study & Risk Assessment", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Resource Planning", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Budget Allocation & Financial Planning", value: 100/42, section: "Project Initiation and Planning", status: "not started" },
      { label: "Project Management Plan Development", value: 100/42, section: "Project Initiation and Planning", status: "not started" },

      // Preliminary Design & Concept Development (4 checkpoints)
      { label: "Detailed Requirements Specification for Testing Unit", value: 100/42, section: "Preliminary Design & Concept Development", status: "not started" },
      { label: "Concept Design & Development", value: 100/42, section: "Preliminary Design & Concept Development", status: "not started" },
      { label: "Preliminary Design Review (PDR) Preparation", value: 100/42, section: "Preliminary Design & Concept Development", status: "not started" },
      { label: "PDR Presentation & Approval", value: 100/42, section: "Preliminary Design & Concept Development", status: "not started" },

      // Detailed Design & Engineering (5 checkpoints)
      { label: "System Level Design", value: 100/42, section: "Detailed Design & Engineering", status: "not started" },
      { label: "Sub-System Detailed Design", value: 100/42, section: "Detailed Design & Engineering", status: "not started" },
      { label: "Component Selection & Sourcing Strategy", value: 100/42, section: "Detailed Design & Engineering", status: "not started" },
      { label: "Drawings & Documentation Package Development", value: 100/42, section: "Detailed Design & Engineering", status: "not started" },
      { label: "Design Validation & Simulation", value: 100/42, section: "Detailed Design & Engineering", status: "not started" },

      // Procurement & Manufacturing (4 checkpoints)
      { label: "Bill of Material (BOM) Finalization", value: 100/42, section: "Procurement & Manufacturing", status: "not started" },
      { label: "Purchase Order (PO) Issuance & Tracking", value: 100/42, section: "Procurement & Manufacturing", status: "not started" },
      { label: "Component Manufacturing & Assembly", value: 100/42, section: "Procurement & Manufacturing", status: "not started" },
      { label: "Quality Control & Inspection of Manufactured Parts", value: 100/42, section: "Procurement & Manufacturing", status: "not started" },

      // Assembly & Integration (5 checkpoints)
      { label: "Assembly & Integration", value: 100/42, section: "Assembly & Integration", status: "not started" },
      { label: "Sub-system Assembly", value: 100/42, section: "Assembly & Integration", status: "not started" },
      { label: "Integration of Sub-systems into Main Testing Unit", value: 100/42, section: "Assembly & Integration", status: "not started" },
      { label: "Cabling & Wiring Installation", value: 100/42, section: "Assembly & Integration", status: "not started" },
      { label: "Initial Power-up & Basic Functionality Tests", value: 100/42, section: "Assembly & Integration", status: "not started" },

      // Testing & Validation (7 checkpoints)
      { label: "Factory Acceptance Test (FAT) Plan Development", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "FAT Execution", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "Defect Identification & Resolution", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "Client/User Acceptance Test (UAT) Plan Development", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "UAT Execution", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "Performance & Safety Compliance Testing", value: 100/42, section: "Testing & Validation", status: "not started" },
      { label: "Test Report Generation & Review", value: 100/42, section: "Testing & Validation", status: "not started" },

      // Deployment & Training (5 checkpoints)
      { label: "Packaging & Transportation of Testing Unit", value: 100/42, section: "Deployment & Training", status: "not started" },
      { label: "On-site Installation & Setup", value: 100/42, section: "Deployment & Training", status: "not started" },
      { label: "Site Acceptance Test (SAT) Execution", value: 100/42, section: "Deployment & Training", status: "not started" },
      { label: "Operational Training for End-Users", value: 100/42, section: "Deployment & Training", status: "not started" },
      { label: "Maintenance Training for Technical Staff", value: 100/42, section: "Deployment & Training", status: "not started" },

      // Project Closure & Post-Deployment (3 checkpoints)
      { label: "Final Documentation Handover", value: 100/42, section: "Project Closure & Post-Deployment", status: "not started" },
      { label: "Warranty & Support Agreement Finalization", value: 100/42, section: "Project Closure & Post-Deployment", status: "not started" },
      { label: "Final Project Report & Financial Closure", value: 100/42, section: "Project Closure & Post-Deployment", status: "not started" }
    ];

    const project = await Project.create({ 
      name, 
      description, 
      deadline: new Date(deadline),
      progress: progress || 0,
      links: filteredLinks,
      checkpoints: defaultCheckpoints
    });

    return res.status(201).json(project);
  } catch (err) {
    console.error("Add project error:", err);
    return res.status(500).json({ 
      error: err.message || "Internal server error",
      details: err.errors 
    });
  }
};

// ---------------- Get All Projects ---------------- //
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Get Single Project ---------------- //
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    
    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    return res.status(200).json(project);
  } catch (err) {
    console.error("Get project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/project.controller.js
// ... existing imports and functions ...

// ---------------- Update Project Checkpoints ---------------- //
export const updateProjectCheckpoints = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkpoints } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update checkpoints
    project.checkpoints = checkpoints;
    
    // Recalculate progress based on completed checkpoints
    const completedValue = checkpoints
      .filter(cp => cp.status === "completed")
      .reduce((sum, cp) => sum + cp.value, 0);
    
    project.progress = Math.min(100, Math.max(0, completedValue));
    
    await project.save();
    
    return res.status(200).json(project);
  } catch (err) {
    console.error("Update checkpoints error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Update Single Checkpoint ---------------- //
export const updateCheckpoint = async (req, res) => {
  try {
    const { id, checkpointId } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Find the checkpoint by _id
    const checkpoint = project.checkpoints.id(checkpointId);
    if (!checkpoint) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }

    // Update checkpoint
    Object.assign(checkpoint, updates);
    
    await project.save();
    
    return res.status(200).json(project);
  } catch (err) {
    console.error("Update checkpoint error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Delete Project ---------------- //
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Update Project ---------------- //
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, progress } = req.body;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = deadline;
    if (progress !== undefined) project.progress = progress;

    await project.save();
    return res.status(200).json(project);
  } catch (err) {
    console.error("Update project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Update Project Progress ---------------- //
export const updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ error: "Valid progress value (0-100) is required" });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { progress },
      { new: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json(project);
  } catch (err) {
    console.error("Update progress error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};