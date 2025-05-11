import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import Preloader from "../components/Preloader";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepartmentsByBusinessId,
  updateDepartment,
  deleteDepartment,
  createDepartment,
} from "../services/departmentService";
import axios from "../services/axios/axiosInstance";
import { setDepartment } from "../store/slices/businessSlice";

const BusinessDepartmentSelectionPage = () => {
  const navigate = useNavigate();
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [selectedDept, setSelectedDept] = useState(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", averageProcessingTime: "" });


  useEffect(() => {
    if (!selectedBusiness) {
      navigate("/login/business");
      return;
    }
    fetchDepartments();
  }, [navigate, selectedBusiness]);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartmentsByBusinessId(selectedBusiness.businessId);
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
      fetchDepartments();
    }
  };

  const openModal = (type, dept = null) => {
    setModalType(type);
    setSelectedDept(dept);
    setFormData({
      name: dept?.name || "",
      averageProcessingTime: dept?.averageProcessingTime || "",
    });
    setModalOpen(true);
  };

const handleModalSubmit = async (e) => {
  e.preventDefault();
  if (modalType === "add") {
    await createDepartment(
      selectedBusiness.businessId,
      formData.name,
      Number(formData.averageProcessingTime)
    );
  } else {
    await updateDepartment(selectedDept._id, {
      name: formData.name,
      averageProcessingTime: Number(formData.averageProcessingTime),
    });
  }

  setModalOpen(false);
  fetchDepartments();
};


  const handleDeptSelect = useCallback(
    (dept) => {
      dispatch(setDepartment(dept));
      navigate("/dashboard/business");
    },
    [dispatch, navigate]
  );

   const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, departments]);

  if (loading || !selectedBusiness) return <Preloader />;

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">
        {selectedBusiness.name} – Departments
      </h1>

      <input
        type="text"
        placeholder="🔍 Search department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 rounded bg-white/10 text-white placeholder-white/50 outline-none"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {filteredDepartments.map((dept) => (
          <div
            key={dept._id}
            className="p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
          >
            <h2 className="text-lg font-semibold mb-2">{dept.name}</h2>
            <div className="flex justify-between text-sm text-white/70">
              <button
                onClick={() => handleDeptSelect(dept)}
                className="hover:text-white"
              >
                Select
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => openModal("edit", dept)}
                  className="hover:text-yellow-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept._id)}
                  className="hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => openModal("add")}
          className="mt-6 bg-white/10 px-6 py-3 rounded-lg hover:bg-white/20 transition-all"
        >
          ➕ Add Department
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <form
            onSubmit={handleModalSubmit}
            className="bg-white text-black rounded-xl p-6 w-full max-w-sm shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {modalType} Department
            </h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="Department name"
              className="w-full px-4 py-2 mb-4 border rounded outline-none"
            />

            <input
              type="number"
              value={formData.averageProcessingTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  averageProcessingTime: e.target.value,
                })
              }
              required
              placeholder="Avg. Processing Time (in minutes)"
              className="w-full px-4 py-2 mb-4 border rounded outline-none"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BusinessDepartmentSelectionPage;
