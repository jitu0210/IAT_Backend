import Form from "../models/form.model.js";

// Submit a new form (protected)
export const submitForm = async (req, res) => {
  try {
    const { name, branch, activities } = req.body;
    const userId = req.user._id; // Get userId from authenticated user

    if (!name || !branch || !activities) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create date with current time (server time)
    const submissionDate = new Date();
    
    // Check if a submission exists within the last 12 hours for the same user
    const last12Hours = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const existing = await Form.findOne({
      userId,
      date: { $gte: last12Hours },
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You can submit only once every 12 hours" });
    }

    const form = await Form.create({ 
      userId, 
      name, 
      branch, 
      activities, 
      date: submissionDate // Store the actual submission time
    });
    
    res.status(201).json(form);
  } catch (err) {
    console.error("SubmitForm Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all submissions (protected)
export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ date: -1 });
    res.status(200).json(forms);
  } catch (err) {
    console.error("GetAllForms Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get submissions in the last 12 hours (protected)
export const getDailyForms = async (req, res) => {
  try {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const forms = await Form.find({ date: { $gte: twelveHoursAgo } }).sort({
      date: -1,
    });
    res.status(200).json(forms);
  } catch (err) {
    console.error("GetRecentForms Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user submission history (protected)
export const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify the requesting user can only access their own history
    if (req.user._id.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const userHistory = await Form.find({ userId })
      .sort({ date: -1 });
      
    res.status(200).json(userHistory);
  } catch (err) {
    console.error("GetUserHistory Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all user activities with proper date/time formatting
export const getAllUserActivities = async (req, res) => {
  try {
    const forms = await Form.find()
      .sort({ date: -1 });
    
    // Format the data to include separate date and time fields
    const formattedData = forms.map(form => {
      const submissionDate = new Date(form.date);
      
      return {
        id: form._id,
        name: form.name,
        branch: form.branch,
        activities: form.activities,
        date: submissionDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: submissionDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        datetime: form.date
      };
    });
    
    res.status(200).json(formattedData);
  } catch (err) {
    console.error("GetAllUserActivities Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};