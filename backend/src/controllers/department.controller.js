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
 const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const updateData = req.body;

    if (!departmentId) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      updateData,
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json(updatedDepartment);
  } catch (err) {
    console.error("Error updating department:", err);
    res.status(500).json({ error: "Server error" });
  }
};
const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!departmentId) {
      return res.status(400).json({ error: "Invalid department ID" });
    }

    const deletedDepartment = await Department.findByIdAndDelete(departmentId);

    if (!deletedDepartment) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { businessId, name, averageProcessingTime } = req.body;

    if (!businessId || !name) {
      return res.status(400).json({ error: "businessId and name are required." });
    }

    const newDepartment = new Department({
      businessId,
      name,
      averageProcessingTime: averageProcessingTime || 0, // Optional
    });

    const savedDepartment = await newDepartment.save();

    res.status(201).json(savedDepartment);
  } catch (err) {
    console.error("Error creating department:", err.message);
    res.status(500).json({ error: "Server error while creating department." });
  }
};



export {getDepartmentsByBusinessId,updateDepartment,deleteDepartment,createDepartment};