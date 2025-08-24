import mongoose from "mongoose";

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
          // Simple URL validation - can be enhanced
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;