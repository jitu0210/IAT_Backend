import Group from "../models/group.model.js";
import User from "../models/user.model.js";

// Get all groups with user-specific data
export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user?.id;
    const groups = await Group.find().sort({ totalRating: -1 });
    
    // Add user-specific data to each group
    const groupsWithUserData = groups.map(group => {
      const groupObj = group.toObject();
      
      // Check if user is a member
      groupObj.isMember = userId ? group.members.some(member => 
        member.userId.toString() === userId
      ) : false;
      
      // Check if user has rated this group
      groupObj.hasRated = userId ? group.ratings.some(rating => 
        rating.userId.toString() === userId
      ) : false;
      
      return groupObj;
    });
    
    res.json(groupsWithUserData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join a group
export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is already in any group
    const userGroups = await Group.find({ 
      "members.userId": userId 
    });
    
    if (userGroups.length > 0) {
      return res.status(400).json({ 
        message: 'You can only join one group at a time. Leave your current group first.' 
      });
    }
    
    // Check if user is already a member of this group
    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );
    
    if (isMember) {
      return res.status(400).json({ 
        message: 'You are already a member of this group' 
      });
    }
    
    // Add user to group members
    group.members.push({
      userId: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch
    });
    
    // Add group to user's joined groups
    user.joinedGroups.push(group._id);
    
    await Promise.all([group.save(), user.save()]);
    
    res.json({ message: 'Joined group successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Leave a group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is a member
    const memberIndex = group.members.findIndex(member => 
      member.userId.toString() === userId
    );
    
    if (memberIndex === -1) {
      return res.status(400).json({ 
        message: 'You are not a member of this group' 
      });
    }
    
    // Remove user from group members
    group.members.splice(memberIndex, 1);
    
    // Remove group from user's joined groups
    const user = await User.findById(userId);
    user.joinedGroups = user.joinedGroups.filter(id => 
      id.toString() !== groupId
    );
    
    await Promise.all([group.save(), user.save()]);
    
    res.json({ message: 'Left group successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a group
export const rateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const {
      communication,
      presentation,
      content,
      helpfulForCompany,
      helpfulForInterns,
      participation,
      comments
    } = req.body;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Check if user is trying to rate their own group
    const isMember = group.members.some(member => 
      member.userId.toString() === userId
    );
    
    if (isMember) {
      return res.status(400).json({ 
        message: 'You cannot rate your own group' 
      });
    }
    
    // Check if user has already rated this group
    const userRatingIndex = group.ratings.findIndex(rating => 
      rating.userId.toString() === userId
    );
    
    if (userRatingIndex !== -1) {
      return res.status(400).json({ 
        message: 'You have already rated this group' 
      });
    }
    
    const user = await User.findById(userId);
    
    // Add new rating
    const newRating = {
      userId: user._id,
      userName: user.name,
      communication,
      presentation,
      content,
      helpfulForCompany,
      helpfulForInterns,
      participation,
      comments
    };
    
    group.ratings.push(newRating);
    
    // Update group statistics
    group.updateStats();
    
    // Add rating record to user
    user.ratings.push({
      groupId: group._id,
      groupName: group.name,
      ratedAt: new Date()
    });
    
    await Promise.all([group.save(), user.save()]);
    
    res.json({ 
      message: 'Rating submitted successfully', 
      group,
      newRating 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a rating
export const removeRating = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    // Find and remove user's rating
    const ratingIndex = group.ratings.findIndex(rating => 
      rating.userId.toString() === userId
    );
    
    if (ratingIndex === -1) {
      return res.status(400).json({ 
        message: 'You have not rated this group' 
      });
    }
    
    group.ratings.splice(ratingIndex, 1);
    
    // Update group statistics
    group.updateStats();
    
    // Remove rating record from user
    const user = await User.findById(userId);
    user.ratings = user.ratings.filter(rating => 
      rating.groupId.toString() !== groupId
    );
    
    await Promise.all([group.save(), user.save()]);
    
    res.json({ message: 'Rating removed successfully', group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get group details
export const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get live ratings for real-time updates
export const getGroupTotals = async (req, res) => {
  try {
    // Fetch all groups
    const groups = await Group.find().lean();

    // Transform groups into totals
    const groupTotals = groups.map(group => {
      // Calculate total points for group from ratings array
      const currentTotal = group.ratings.reduce((sum, rating) => {
        return (
          sum +
          rating.communication +
          rating.presentation +
          rating.content +
          rating.helpfulForCompany +
          rating.helpfulForInterns +
          rating.participation
        );
      }, 0);

      // Assume previous total is stored in DB (example: group.previousTotal)
      // If not in schema yet, you need to add it
      const previousTotal = group.previousTotal || 0;

      return {
        groupId: group._id,
        groupName: group.name,
        previousTotal,
        currentTotal,
        difference: currentTotal - previousTotal,
      };
    });

    res.json(groupTotals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize predefined groups (run once)
export const initializeGroups = async (req, res) => {
  try {
    const predefinedGroups = [
      { name: "Path finder" },
      { name: "Nova" },
      { name: "Fusion force" },
      { name: "Wit squad" },
      { name: "Explorers" }
    ];
    
    // Check if groups already exist
    const existingGroups = await Group.find();
    if (existingGroups.length > 0) {
      return res.status(400).json({ message: 'Groups already initialized' });
    }
    
    const createdGroups = await Group.insertMany(predefinedGroups);
    res.json({ message: 'Groups initialized successfully', groups: createdGroups });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};