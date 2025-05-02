import Token from "../models/token.model.js";
import TokenCounter from "../models/tokenCounter.model.js";
import Business from "../models/bussiness.model.js";
import Department from "../models/department.model.js";

const generateToken = async (req, res) => {
  try {
    const { userId, businessId, departmentId: givenDeptId } = req.body;

    const existingToken = await Token.findOne({
        userId,
        businessId,
        givenDeptId,
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

export { generateToken };
