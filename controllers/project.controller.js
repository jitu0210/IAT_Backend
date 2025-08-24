import mongoose from "mongoose";
import Project from "../models/project.model.js";

// ---------------- Create Project ---------------- //
export const addProject = async (req, res) => {
  try {
    const { name, description, deadline, progress, links } = req.body;

    // Basic validation
    if (!name || !deadline) {
      return res.status(400).json({ error: "Name and deadline are required" });
    }

    // Filter out any empty links
    const filteredLinks = links ? links.filter(link => link.title && link.url) : [];

    const project = await Project.create({ 
      name, 
      description, 
      deadline: new Date(deadline),
      progress: progress || 0,
      links: filteredLinks
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