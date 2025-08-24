// controllers/group.controller.js
import Group from '../models/group.model.js';
import mongoose from 'mongoose';

// Get all groups
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('members', 'name email').populate('ratings.userId', 'name');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single group by ID
export const getGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group = await Group.findById(id).populate('members', 'name email').populate('ratings.userId', 'name');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if group with same name already exists
    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group with this name already exists' });
    }
    
    const group = new Group({
      name,
      members: [req.userId] // Add the creator as a member
    });
    
    const newGroup = await group.save();
    await newGroup.populate('members', 'name email');
    
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, members } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is authorized to update this group
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to update this group' });
    }
    
    if (name) group.name = name;
    if (members) group.members = members;
    
    const updatedGroup = await group.save();
    await updatedGroup.populate('members', 'name email').populate('ratings.userId', 'name');
    
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is authorized to delete this group
    if (!group.members.includes(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });
    }
    
    await Group.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a rating to a group
export const addRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      communication, 
      presentation, 
      content, 
      helpfulForCompany, 
      helpfulForInterns, 
      participation, 
      comments 
    } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member of this group (can't rate your own group)
    if (group.members.includes(req.userId)) {
      return res.status(400).json({ message: 'You cannot rate a group you are a member of' });
    }
    
    // Check if user has already rated this group
    const existingRating = group.ratings.find(rating => 
      rating.userId.toString() === req.userId
    );
    
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this group' });
    }
    
    // Validate rating values (0-40)
    const ratingValues = [communication, presentation, content, helpfulForCompany, helpfulForInterns, participation];
    for (const value of ratingValues) {
      if (value < 0 || value > 40) {
        return res.status(400).json({ message: 'Rating values must be between 0 and 40' });
      }
    }
    
    // Create new rating
    const newRating = {
      userId: req.userId,
      communication,
      presentation,
      content,
      helpfulForCompany,
      helpfulForInterns,
      participation,
      comments: comments || ''
    };
    
    // Add rating to group
    group.ratings.push(newRating);
    
    // Update aggregated ratings
    group.updateRatings();
    
    // Save the group with new rating
    const updatedGroup = await group.save();
    await updatedGroup.populate('members', 'name email').populate('ratings.userId', 'name');
    
    res.status(201).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get ratings for a group
export const getRatings = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    const group = await Group.findById(id)
      .populate('ratings.userId', 'name email')
      .select('ratings');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.status(200).json(group.ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to group
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }
    
    // Add user to members
    group.members.push(userId);
    
    const updatedGroup = await group.save();
    await updatedGroup.populate('members', 'name email').populate('ratings.userId', 'name');
    
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove member from group - FIXED
// Remove member from group - FIXED (using URL params)
export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params; // Get userId from URL params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is trying to remove themselves
    if (req.userId !== userId) {
      return res.status(403).json({ message: 'You can only remove yourself from a group' });
    }
    
    // Check if user is a member
    const isMember = group.members.some(memberId => memberId.toString() === userId);
    if (!isMember) {
      return res.status(400).json({ message: 'User is not a member of this group' });
    }
    
    // Remove user from members
    group.members = group.members.filter(memberId => memberId.toString() !== userId);
    
    const updatedGroup = await group.save();
    await updatedGroup.populate('members', 'name email').populate('ratings.userId', 'name');
    
    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};