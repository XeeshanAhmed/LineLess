import Business from "../models/business.model.js";
import Department from "../models/department.model.js";

export const getAllBusinessesWithDepartments = async (req, res) => {
  try {
    const businesses = await Business.find().lean();

    const results = await Promise.all(
      businesses.map(async (biz) => {
        const departments = await Department.find({ businessId: biz._id }).select("name -_id").lean();
        return {
          name: biz.businessName,
          businessId: biz._id,
          hasDepartments: biz.hasDepartments,
          departments: departments.length > 0 ? departments.map((d) => d.name) : ["General"],
          defaultDeptId:biz.defaultDepartmentId
        };
      })
    );

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch businesses", error: err.message });
  }
};
