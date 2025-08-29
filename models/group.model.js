import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  communication: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  presentation: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  content: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  helpfulForCompany: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  helpfulForInterns: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  participation: {
    type: Number,
    required: true,
    min: 0,
    max: 40
  },
  comments: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days in seconds (7 * 24 * 60 * 60)
  }
});

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      default: "Not specified"
    },
    joinDate: {
      type: Date,
      default: Date.now
    }
  }],
  ratings: [ratingSchema],
  totalRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  avgCommunication: {
    type: Number,
    default: 0
  },
  avgPresentation: {
    type: Number,
    default: 0
  },
  avgContent: {
    type: Number,
    default: 0
  },
  avgHelpfulForCompany: {
    type: Number,
    default: 0
  },
  avgHelpfulForInterns: {
    type: Number,
    default: 0
  },
  avgParticipation: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update group statistics when a rating is added
groupSchema.methods.updateStats = function() {
  if (this.ratings.length === 0) {
    this.totalRating = 0;
    this.ratingCount = 0;
    this.avgCommunication = 0;
    this.avgPresentation = 0;
    this.avgContent = 0;
    this.avgHelpfulForCompany = 0;
    this.avgHelpfulForInterns = 0;
    this.avgParticipation = 0;
    return;
  }

  const totalComm = this.ratings.reduce((sum, r) => sum + r.communication, 0);
  const totalPres = this.ratings.reduce((sum, r) => sum + r.presentation, 0);
  const totalCont = this.ratings.reduce((sum, r) => sum + r.content, 0);
  const totalComp = this.ratings.reduce((sum, r) => sum + r.helpfulForCompany, 0);
  const totalInt = this.ratings.reduce((sum, r) => sum + r.helpfulForInterns, 0);
  const totalPart = this.ratings.reduce((sum, r) => sum + r.participation, 0);
  
  this.ratingCount = this.ratings.length;
  this.avgCommunication = totalComm / this.ratingCount;
  this.avgPresentation = totalPres / this.ratingCount;
  this.avgContent = totalCont / this.ratingCount;
  this.avgHelpfulForCompany = totalComp / this.ratingCount;
  this.avgHelpfulForInterns = totalInt / this.ratingCount;
  this.avgParticipation = totalPart / this.ratingCount;
  this.totalRating = (totalComm + totalPres + totalCont + totalComp + totalInt + totalPart) / this.ratingCount;
};

const Group = mongoose.model('Group', groupSchema);

export default Group;