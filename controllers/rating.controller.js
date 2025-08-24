import Rating from "../models/rating.model.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";

// Submit a rating
const submitRating = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;
    const { ratings, comments } = req.body;

    // Validate the group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user is a member of the group they're trying to rate
    const isMember = group.members.some(member => member.equals(userId));
    if (isMember) {
      return res.status(403).json({ error: 'Cannot rate your own group' });
    }

    // Check if user has already rated this group
    const existingRating = await Rating.findOne({ group: groupId, rater: userId });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this group' });
    }

    // Calculate overall score
    const overall = Object.values(ratings).reduce((sum, val) => sum + val, 0);

    // Create new rating
    const newRating = new Rating({
      group: groupId,
      rater: userId,
      ratings,
      overall,
      comments
    });

    await newRating.save();

    // Update group's average rating
    await updateGroupAverageRating(groupId);

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get ratings for a group
const getGroupRatings = async (req, res) => {
  try {
    const { groupId } = req.params;
    const ratings = await Rating.find({ group: groupId })
      .populate('rater', 'name email')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to update group's average rating
async function updateGroupAverageRating(groupId) {
  const ratings = await Rating.find({ group: groupId });
  const average = ratings.reduce((sum, rating) => sum + rating.overall, 0) / ratings.length;
  await Group.findByIdAndUpdate(groupId, { averageRating: average });
}

export {
    getGroupRatings,
    submitRating
}