import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();

// ---------------- Helper Functions ---------------- //
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// ---------------- Register User ---------------- //
const registerUser = async (req, res) => {
  try {
    const { username, email, password, branch } = req.body;

    // validate
    if (!username || !email || !password || !branch) {
      return res.status(400).json({
        error: "Username, Email, Password, and branch are required",
      });
    }

    // check existing user
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        error: "User with same email or username already exists",
      });
    }

    // create user
    const newUser = await User.create({
      username,
      email,
      password,
      branch,
    });

    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshtoken"
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Login User ---------------- //
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email without validating the full document
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate token without saving the user (to avoid validation)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });
    
    // Return user data without the branch if it's not available
    const userData = user.toObject();
    delete userData.password;
    
    res.status(200).json({ 
      token,
      user: userData
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// ---------------- Logout User ---------------- //
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
    });
  }
};

// ---------------- Get All Users ---------------- //
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshtoken");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ---------------- Get Department Counts ---------------- //
const getDepartmentCounts = async (req, res) => {
  try {
    const departmentCounts = await User.aggregate([
      {
        $group: {
          _id: "$branch", // group by branch/department
          count: { $sum: 1 } // count users
        }
      },
      {
        $project: {
          _id: 0,
          department: "$_id",
          count: 1
        }
      }
    ]);

    return res.status(200).json(departmentCounts);
  } catch (error) {
    console.error("Error fetching department counts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Verify Token
export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ valid: true, user });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


// ---------------- Refresh Token ---------------- //
const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid refresh token" });

    const accessToken = generateAccessToken(decoded.userId);
    return res.status(200).json({ accessToken });
  });
};

export { registerUser, loginUser, logoutUser, getAllUsers, refreshToken, getDepartmentCounts };
