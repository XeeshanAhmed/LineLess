import 'dotenv/config';
import Business from "../models/business.model.js";
import Department from "../models/department.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;

const businessSignUp = async (req, res) => {
  try {
    const { email, businessName, password, hasDepartments, departments, averageProcessingTime, } = req.body;


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
          name: dept.name.trim(),
          businessId: business._id,
          isDefault: false,
          averageProcessingTime: dept.averageProcessingTime || 0,
        });
      }
    } else {
      const defaultDept = await Department.create({
        name: 'General',
        businessId: business._id,
        isDefault: true,
        averageProcessingTime: averageProcessingTime || 0,
      });

      business.defaultDepartmentId = defaultDept._id;
      await business.save();
    }


    res.status(201).json({
      message: 'Business created successfully',
      role: business.role
    });

  } catch (error) {
    res.status(400).json({
        message: "Business already exists",
        error: true
    })
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

    let defaultDepartment = null;
    if (business.defaultDepartmentId) {
      const dept = await Department.findById(business.defaultDepartmentId).select("name");
      if (dept) {
        defaultDepartment = {
          _id: dept._id,
          name: dept.name,
        };
      }
    }
    
    const token = jwt.sign({ id: business._id, role: business.role }, JWT_SECRET,{ expiresIn: '1d' });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
      }).status(200).json({
        token,
        role: business.role,
        business: {
          businessId: business._id,
          name: business.businessName,
        },
        departments: departmentNames,
        defaultDepartment,
        message: "Login successful"
       });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getLoggedInBusiness = (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "business") {
      return res.status(403).json({ message: "Access denied, not a business" });
    }
    res.status(200).json({ business: { id: decoded.id, role: decoded.role } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const logoutBusiness = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export { businessSignUp,businessLogin,getLoggedInBusiness,logoutBusiness };