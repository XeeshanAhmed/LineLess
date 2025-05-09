import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { userId, businessId, departmentId, rating, comment } = req.body;

    if (!userId || !businessId || !departmentId || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const feedback = await Feedback.create({
      userId,
      businessId,
      departmentId,
      rating,
      comment,
    });
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("userId", "username email");
    res.status(201).json({ message: "Feedback submitted", feedback:populatedFeedback });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
};

export const getFeedbackForDepartment = async (req, res) => {
    try {
      const { businessId, departmentId } = req.params;
  
      const feedbacks = await Feedback.find({ businessId, departmentId })
        .populate("userId", "username email")
        .sort({ createdAt: -1 });
  
      res.status(200).json({ feedbacks });
    } catch (error) {
      console.error("Fetch feedback error:", error);
      res.status(500).json({ message: "Failed to fetch feedbacks" });
    }
  };
  
