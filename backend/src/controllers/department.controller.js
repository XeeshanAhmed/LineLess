import Department from '../models/department.model.js';

const getDepartmentsByBusinessId = async (req, res) => {
  try {
    const { businessId } = req.params;

    const departments = await Department.find({ businessId });

    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {getDepartmentsByBusinessId};