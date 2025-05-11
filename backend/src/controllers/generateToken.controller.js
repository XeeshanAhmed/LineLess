import Token from "../models/token.model.js";
import TokenCounter from "../models/tokenCounter.model.js";
import Business from "../models/business.model.js";
import Department from "../models/department.model.js";
import User from "../models/user.model.js"
import sendNotificationEmail from "../utils/notificationEmail.js";

const getLatestToken = async (req, res) => {
    try {
      const { businessId, departmentId } = req.params;
  
      const counter = await TokenCounter.findOne({ businessId, departmentId });
  
      const latestTokenNumber = counter ? counter.count : 0;
  
      res.status(200).json({ latestTokenNumber });
    } catch (error) {
      console.error("Error fetching latest token:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

const generateToken = async (req, res) => {
  try {
    const { userId, businessId, departmentId: givenDeptId } = req.body;

    const existingToken = await Token.findOne({
        userId,
        businessId,
        departmentId:givenDeptId,
        status: 'pending'
      });
      
      if (existingToken) {
        return res.status(400).json({
          message: "You already have an active token for this department",
          tokenNumber: existingToken.tokenNumber
        });
      }

    // 1. Get business
    const business = await Business.findById(businessId);
    if (!business) throw new Error("Business not found");

    let departmentId = givenDeptId;

    // 2. If business has no departments, use default "General" department
    if (!business.hasDepartments) {
      if (!business.defaultDepartmentId) throw new Error("Default department not found");
      departmentId = business.defaultDepartmentId;
    }

    if (!departmentId) throw new Error("Department ID is required");

    // 3. Check or create token counter
    let counter = await TokenCounter.findOne({ businessId, departmentId });

    if (!counter) {
      counter = await TokenCounter.create({
        businessId,
        departmentId,
        count: 1
      });
    } else {
      counter.count += 1;
      await counter.save();
    }

    // 4. Create token entry for user
    const token = await Token.create({
      userId,
      businessId,
      departmentId,
      tokenNumber: counter.count
    });

    const io = req.app.get("io");
    io.emit("newTokenGenerated", {
      businessId,
      departmentId,
      message: "New token generated",
    });

    res.status(201).json({
      message: "Token generated successfully",
      token: {
        id: token._id,
        tokenNumber: token.tokenNumber,
        businessId,
        departmentId,
        status: token.status
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getTokenQueue = async (req, res) => {
  try {
    const { businessId, departmentId } = req.params;

    const queue = await Token.find({
      businessId,
      departmentId,
      status: "pending"
    })
      .populate("userId", "username email")
      .sort({ createdAt: 1 }); // oldest token first

    res.status(200).json({ queue });
  } catch (error) {
    console.error("Error fetching token queue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTokenStatus = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Token.findByIdAndUpdate(
      tokenId,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Token not found" });

    const queue = await Token.find({
      businessId: updated.businessId,
      departmentId: updated.departmentId,
      status: "pending",
    })
      .sort({ createdAt: 1 }) // earliest first
      .limit(4);
    const thirdInLine = queue[2];
    if (thirdInLine?.userId) {
      const user = await User.findById(thirdInLine.userId);
      const business = await Business.findById(updated.businessId);
      const department = await Department.findById(updated.departmentId);

      if (user?.email && business?.businessName && department?.name) {
        sendNotificationEmail(user.email,"Get Ready! Your Turn is Near",business.businessName, department.name);
      }
    }

    const io = req.app.get("io");
    io.emit("tokenQueueUpdated", {
      message: "Token queue updated",
      token: updated
    });

    res.status(200).json({ message: `Token ${status}`, token: updated });
  } catch (error) {
    console.error("Update token error:", error);
    res.status(500).json({ message: "Failed to update token" });
  }
};


 const getActiveTokensForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const tokens = await Token.find({
      userId: userId,
      status: 'pending'
    })
      .populate('businessId', 'businessName') 
      .populate('departmentId', 'name') 
      .sort({ createdAt: -1 });

    const formattedTokens = tokens.map((token) => {
      const time = new Date(token.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return {
        id: token._id,
        business: token.businessId?.businessName || 'Unknown Business',
        department: token.departmentId?.name || 'Unknown Department',
        token: `T${token.tokenNumber}`,
        time
      };
    });

    return res.status(200).json(formattedTokens);

  } catch (err) {
    console.error('Error fetching active tokens:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};



export { getLatestToken,generateToken,getTokenQueue,updateTokenStatus,getActiveTokensForUser };
