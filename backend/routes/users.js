// user profile endpoints

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserQuest = require("../models/UserQuest");
const Quest = require("../models/Quest");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/avatars/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // unique filename... userID_time_.ext
    const uniqueName = `${req.user.userId}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload an image file"), false);
    }
  },
});

// middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }
  jwt.verify(token, process.env.JWT_SECRET || "blah", (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
};

// GET /api/users/profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "friends",
      "username avatar"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    console.error("error getting profile: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/users/profile
// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Error with updating profile: ", error);

    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Username or email alreadu exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/users/friends
// friend list
router.get("/friends", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate(
      "friends",
      "username avatar questsCompleted"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, friends: user.friends });
  } catch (error) {
    console.error("Error retrieving friends: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/users/quests
// Get user's completed quests (w/ filtering)
router.get("/quests", authenticateToken, async (req, res) => {
  try {
    const { filter = "all " } = req.query;

    //build filter query
    let matchQuery = { user: req.userId };

    if (filter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchQuery.completedAt = { $gte: weekAgo };
    } else if (filter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchQuery.completedAt = { $gte: monthAgo };
    } else if (filter === "favorites") {
      matchQuery.isFavorite = true;
    }

    const quests = await UserQuest.find(matchQuery)
      .populate("quest")
      .sort({ completedAt: -1 })
      .limit(10);
    res.json({
      success: true,
      quests,
    });
  } catch (error) {
    console.error("Error retrieving user quests: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/users/quest/:questId/complete
// Mark a quest as completed
router.post(
  "/quests/:questId/complete",
  authenticateToken,
  async (req, res) => {
    try {
      const { questId } = req.params;

      // check if quest exists...
      const quest = await Quest.findById(questId);
      if (!quest) {
        return res
          .status(404)
          .json({ success: false, message: "Quest not found" });
      }
      // check if quest already completed this quest
      const existingCompletion = await UserQuest.findOne({
        user: req.userId,
        quest: questId,
      });

      if (existingCompletion) {
        return res.status(409).json({
          success: false,
          message: "Quest already completed",
        });
      }

      // create new completion record..
      const userQuest = new UserQuest({
        user: req.userId,
        quest: questId,
      });

      await userQuest.save();

      //update user quest count..
      const user = await User.findById(req.userId);
      user.questsCompleted += 1;
      await user.save();

      res.json({
        success: true,
        message: "Quest completed successfully!",
        userQuest,
      });
    } catch (error) {
      console.error("Error completing quest: ", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);
// POST /api/users/avatar
// upload user avatar
router.post("/avatar", authenticateToken, (req, res) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = "uploads/avatars/";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // Now req.userId is available
      const uniqueName = `${req.userId}_${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName);
    },
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Please upload an image file"), false);
      }
    },
  }).single("avatar");

  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided." });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { avatar: avatarUrl },
        { new: true, select: "-password" }
      );

      res.json({
        success: true,
        avatarUrl: avatarUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Image upload error: ", error);
      res.status(500).json({ success: false, message: "failed to upload" });
    }
  });
});

// GET /api/users/search?query=abc
// Search users by username/email (excluding myself)
router.get("/search", authenticateToken, async (req, res) => {
  try {
    const query = (req.query.query || "").trim();

    if (!query) {
      return res.json({ success: true, users: [] });
    }

    // Regex escape to avoid breaking regex with special chars
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapeRegex(query), "i");

    const users = await User.find({
      _id: { $ne: req.userId }, // exclude myself
      $or: [{ username: { $regex: regex } }, { email: { $regex: regex } }],
    })
      .select("username avatar") // return only what you need
      .limit(20);

    return res.json({ success: true, users });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/users/friends/add
// add friends to list
// body: { friendId }
router.post("/friends/add", authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) {
      return res
        .status(400)
        .json({ success: false, message: "friendId is required" });
    }

    // prevent myself
    if (String(friendId) === String(req.userId)) {
      return res
        .status(400)
        .json({ success: false, message: "you cannot add yourself" });
    }

    // Check the existence of friend
    const friendUser = await User.findById(friendId).select("_id username");
    if (!friendUser) {
      return res
        .status(404)
        .json({ success: false, message: " User not found" });
    }

    // check whether already friend
    const meDoc = await User.findById(req.userId).select("friends");
    const alreadyFriend = meDoc.friends?.some((id) => String(id) --- String(friendId));
    if(alreadyFriend){
        return res.status(409).json({success: false, message: "Already added as a friend"})
    }

    // add friend to DB
    await Promise.all([
      User.findByIdAndUpdate(req.userId, { $addToSet: { friends: friendId } }),
    ]);
    const me = await User.findById(req.userId).populate(
      "friends",
      "username avatar questsCompleted"
    );

    return res.json({
      success: true,
      message: "Friend added",
      friends: me.friends,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
