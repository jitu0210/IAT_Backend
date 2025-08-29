// models/project.model.js
import mongoose from "mongoose";

// models/project.model.js
const checkpointSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // This will auto-generate ObjectIds
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  section: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["not started", "on schedule", "in progress", "at risk", "completed"],
    default: "not started",
  },
  targetDate: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  deadline: {
    type: Date,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  links: [{
    title: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  }],
  checkpoints: [checkpointSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;

// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     default: "",
//   },
//   deadline: {
//     type: Date,
//     required: true,
//   },
//   progress: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100,
//   },
//   links: [{
//     title: {
//       type: String,
//       required: false
//     },
//     url: {
//       type: String,
//       required: false,
//       validate: {
//         validator: function(v) {
//           // Simple URL validation - can be enhanced
//           return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
//         },
//         message: props => `${props.value} is not a valid URL!`
//       }
//     }
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Project = mongoose.model("Project", projectSchema);

// export default Project;