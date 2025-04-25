const Challenge = require("../models/challenge");
const { sendChallengeUpdate } = require("../services/websocket");
const User = require("../models/user");

exports.createChallenge = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const challenge = new Challenge({
      name,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
    });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: "Failed to create challenge", error });
  }
};

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate("participants.user", "name");
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challenges", error });
  }
};

exports.joinChallenge = async (req, res) => {
    try {
        console.log("Join challenge request:", req.body);
      const { challengeId } = req.params;
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  
      const alreadyJoined = challenge.participants.some(
        (p) => p.user.toString() === req.user.id
      );
      if (alreadyJoined) return res.status(400).json({ message: "Already joined" });
      const user = await User.findById(req.user.id);
    const username = user?.name || req.user?.username || "Anonymous User";
      challenge.participants.push({ user: req.user.id });
      await challenge.save();
  
      // Send real-time update to Fluvio
      sendChallengeUpdate({
        type: "join",
        challengeId: challengeId,
        userId: req.user.id,
        username: username || "A user", // Handle case where name might not exist
        message: `${username || "A user"} joined the challenge "${challenge.name}"`,
      });
  
      res.json({ message: "Joined challenge successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to join challenge", error });
    }
  };

  exports.updateProgress = async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { progress } = req.body;
        console.log("Progress update request:", req.body);
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
  
      const participant = challenge.participants.find(
        (p) => p.user.toString() === req.user.id
      );
      if (!participant) return res.status(400).json({ message: "Not a participant" });
      const user = await User.findById(req.user.id);
      const username = user?.name || req.user?.username || "Anonymous User";
      participant.progress += progress;
      if (participant.progress >= 100) participant.completed = true;
  
      await challenge.save();
  
      // Send real-time update to Fluvio
      await sendChallengeUpdate({
        type: "progress",
        challengeId,
        userId: req.user.id,
        progress: participant.progress,
        message: `${username} updated progress in "${challenge.name}" to ${participant.progress}%`,
      });
  
      res.json({ message: "Progress updated successfully", challenge });
    } catch (error) {
        console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress", error });
    }
  };