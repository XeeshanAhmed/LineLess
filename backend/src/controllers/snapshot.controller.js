import Token from "../models/token.model.js";

export const getSnapshotData = async (req, res) => {
  try {
    const { businessId, departmentId, userId } = req.params;

    if (!businessId || !departmentId || !userId) {
      return res.status(400).json({ error: "Missing required parameters." });
    }

    const allPending = await Token.find({
      businessId,
      departmentId,
      status: "pending",
    }).sort({ createdAt: 1 });

    // No pending tokens at all
    if (allPending.length === 0) {
      return res.status(200).json({
        currentToken: "Queue is empty",
        nextToken: "Queue is empty",
        estimatedServiceTime: 0,
        tokensBeforeYou: 0,
      });
    }

    const currentToken = allPending[0]; // First pending token = current
    const userToken = allPending.find(
      (t) => t.userId.toString() === userId
    );

    const currentTokenNumber = currentToken.tokenNumber;
    const nextTokenNumber = currentTokenNumber + 1;
    const estimatedServiceTime = 5; // fixed per token

    let tokensBeforeYou;

    if (!userToken) {
      tokensBeforeYou = "You don't have a token";
    } else {
      tokensBeforeYou = allPending.findIndex(
        (t) => t._id.toString() === userToken._id.toString()
      );
    }

    return res.status(200).json({
      currentToken: currentTokenNumber,
      nextToken: nextTokenNumber,
      estimatedServiceTime,
      tokensBeforeYou,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
