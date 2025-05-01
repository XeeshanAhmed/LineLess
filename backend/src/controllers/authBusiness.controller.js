import 'dotenv/config';
import Business from "../models/business.model.js";
import Department from "../models/department.model.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("Business JWT:", JWT_SECRET);

 const signUpBusiness = async (req, res) => {
    try {
      const { email, businessName, password, hasDepartments, departments = [] } = req.body;
  
      if (!email || !businessName || !password || hasDepartments === undefined) {
        throw new Error("All fields are required.");
      }
  
      const existing = await Business.findOne({ email });
      if (existing) throw new Error("Business already exists");
  
      const hashedPass = await bcrypt.hash(password, 10);
  
      const business = new Business({
        email,
        businessName,
        password: hashedPass,
        hasDepartments,
        role: 'business'
      });
  
      await business.save();
  
      if (hasDepartments && departments.length > 0) {
        const deptDocs = departments.map((name, index) => ({
          name: name.trim(),
          businessId: business._id,
          isDefault: index === 0, 
        }));
  
        await Department.insertMany(deptDocs);
  
        const defaultDept = deptDocs.find(d => d.isDefault);
        business.defaultDepartmentId = defaultDept?._id;
        await business.save();
      }
  
      const token = jwt.sign({ id: business._id, role: business.role }, JWT_SECRET);
  
      res.status(201).json({
        message: "Business created successfully",
        token,
        role: business.role
      });
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
const loginBusiness = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) throw new Error("Business not found");

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) throw new Error("Incorrect password");

    const token = jwt.sign(
      { id: business._id, role: business.role },
      JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: business.role
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { signUpBusiness, loginBusiness };
