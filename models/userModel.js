const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const jobsHistorySchema = new mongoose.Schema({

  title: {
      type: String,
      trim: true,
      maxlength: 70,
  },

  description: {
      type: String,
      trim: true
  },
  salary: {
      type: String,
      trim: true,
  },
  location: {
      type: String,
  },
  interviewDate: {
      type: Date,
  },
  applicationStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
  },

  user: {
      type: ObjectId,
      ref: "User",
      required: true
  },

}, { timestamps: true })

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: [true, 'first name is required'],
    maxlength: 32,
  },
  lastname: {
    type: String,
    trim: true,
    required: [true, 'last name is required'],
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'e-mail is required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'password is required'],
    minlength: [6, 'password should be at least 6 characters'],
  },

  jobsHistory: [jobsHistorySchema],

  role: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Encrypt password before saving or exporting
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check if (compare) password matches
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return a JWT token
userSchema.methods.getJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
};

module.exports = mongoose.model("User", userSchema);
