import Token from "../models/token.model.js";

import Department from "../models/department.model.js";

export const getSnapshotData = async (req, res) => {
  try {
    const { businessId, departmentId, userId } = req.params;

    if (!businessId || !departmentId || !userId) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const averageProcessingTime = department.averageProcessingTime || 5; // Fallback to 5 minutes if not set

    const allPending = await Token.find({
      businessId,
      departmentId,
      status: "pending",
    }).sort({ createdAt: 1 });

    if (allPending.length === 0) {
      return res.status(200).json({
        currentToken: "Queue is empty",
        nextToken: "Queue is empty",
        estimatedWaitTime: 0,
        tokensBeforeYou: 0,
      });
    }

    const currentToken = allPending[0];
    const userToken = allPending.find(
      (t) => t.userId.toString() === userId
    );

    const currentTokenNumber = currentToken.tokenNumber;
    const nextTokenNumber = currentTokenNumber + 1;

    let tokensBeforeYou;
    let estimatedWaitTime;

    if (!userToken) {
      tokensBeforeYou = "You don't have a token";
      estimatedWaitTime = 0;
    } else {
      tokensBeforeYou = allPending.findIndex(
        (t) => t._id.toString() === userToken._id.toString()
      );

      estimatedWaitTime = tokensBeforeYou * averageProcessingTime;
    }

    return res.status(200).json({
      currentToken: currentTokenNumber,
      nextToken: nextTokenNumber,
      estimatedWaitTime, // ← this is now per-user based
      tokensBeforeYou,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

