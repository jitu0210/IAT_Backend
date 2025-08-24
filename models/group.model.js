// models/group.model.js
import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  communication: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  presentation: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  content: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  helpfulForCompany: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  helpfulForInterns: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  participation: {
    type: Number,
    min: 0,
    max: 40,
    required: true
  },
  comments: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Method to update aggregated ratings
// Method to update aggregated ratings
groupSchema.methods.updateRatings = function() {
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

  this.ratingCount = this.ratings.length;
  
  // Calculate averages for each category
  this.avgCommunication = this.ratings.reduce((sum, rating) => sum + rating.communication, 0) / this.ratingCount;
  this.avgPresentation = this.ratings.reduce((sum, rating) => sum + rating.presentation, 0) / this.ratingCount;
  this.avgContent = this.ratings.reduce((sum, rating) => sum + rating.content, 0) / this.ratingCount;
  this.avgHelpfulForCompany = this.ratings.reduce((sum, rating) => sum + rating.helpfulForCompany, 0) / this.ratingCount;
  this.avgHelpfulForInterns = this.ratings.reduce((sum, rating) => sum + rating.helpfulForInterns, 0) / this.ratingCount;
  this.avgParticipation = this.ratings.reduce((sum, rating) => sum + rating.participation, 0) / this.ratingCount;
  
  // Calculate total rating (sum of all averages)
  this.totalRating = this.avgCommunication + this.avgPresentation + this.avgContent + 
                    this.avgHelpfulForCompany + this.avgHelpfulForInterns + this.avgParticipation;
};

// Pre-save middleware to update ratings
groupSchema.pre('save', function(next) {
  if (this.isModified('ratings')) {
    this.updateRatings();
  }
  next();
});

export default mongoose.model('Group', groupSchema);