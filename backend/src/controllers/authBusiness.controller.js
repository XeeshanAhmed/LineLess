import 'dotenv/config';
import Business from "../models/business.model.js";
import Department from "../models/department.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

const businessSignUp = async (req, res) => {
  try {
    const { email, businessName, password, hasDepartments, departments } = req.body;


    const existingByEmail = await Business.findOne({ email });
    if (existingByEmail) throw new Error("Email is already in use");

    const existingByName = await Business.findOne({ businessName });
    if (existingByName) throw new Error("Business name is already taken");

    const hashedPass = await bcrypt.hash(password, 10);

    const business = new Business({
      email,
      password: hashedPass,
      businessName,
      hasDepartments,
      defaultDepartmentId: null
    });

    await business.save();

    if (hasDepartments && Array.isArray(departments) && departments.length > 0) {
      for (const dept of departments) {
        await Department.create({
          name: dept.trim(),
          businessId: business._id,
          isDefault: false
        });
      }
    } else {
      const defaultDept = await Department.create({
        name: 'General',
        businessId: business._id,
        isDefault: true
      });

      business.defaultDepartmentId = defaultDept._id;
      await business.save();
    }

    const token = jwt.sign({ id: business._id, role: business.role }, JWT_SECRET);

    res.status(201).json({
      message: 'Business created successfully',
      token,
      role: business.role
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: error.message });
  }
};

const businessLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const business = await Business.findOne({ email });
    if (!business) throw new Error("Business not found");

    const isMatch = await bcrypt.compare(password, business.password);
    if (!isMatch) throw new Error("Incorrect password");
    
    const departments = await Department.find({ businessId: business._id }).select("name -_id").lean();
    const departmentNames = departments.map((d) => d.name);
    
    const token = jwt.sign({ id: business._id, role: business.role }, JWT_SECRET);

    res.status(200).json({
      token,
      role: business.role,
      businessName: business.businessName,
      departments: departmentNames,
      message: "Login successful"
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

export { businessSignUp,businessLogin };