// controllers/tokenCounterController.js

import TokenCounter from "../models/tokenCounter.model.js";

export const resetTokenCounter = async (req, res) => {
  try {
    const { businessId, departmentId } = req.body;

    if (!businessId || !departmentId) {
      return res.status(400).json({ error: "businessId and departmentId are required." });
    }

    const counter = await TokenCounter.findOneAndUpdate(
      { businessId, departmentId },
      { count: 0 },
      { new: true }
    );

    if (!counter) {
      return res.status(404).json({ error: "Token counter not found." });
    }

    res.status(200).json({ message: "Token count reset successfully", counter });
  } catch (err) {
    console.error("Error resetting token counter:", err.message);
    res.status(500).json({ error: "Server error while resetting token counter." });
  }
};
