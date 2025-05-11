import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Preloader from "../components/Preloader";
import { useSelector, useDispatch } from "react-redux";
import { setDepartment } from "../store/slices/businessSlice";
import { getDepartmentsByBusinessId } from "../services/departmentService"; 

const UserDepartmentSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([])
  const dispatch = useDispatch();
  const storedBusiness = useSelector((state) => state.business.selectedBusiness);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500);
    if (!storedBusiness) {
      navigate("/business-selection");
    } else {
      const fetchDepartments = async () => {
        try {
          const res = await getDepartmentsByBusinessId(storedBusiness.businessId);
          console.log('department:',res);
          setDepartments(res); 
        } catch (err) {
          console.error("Error fetching departments:", err);
          setDepartments([]);
        } finally {
          setLoading(false);
        }
      };
      fetchDepartments();
      setSelectedBusiness(storedBusiness);
    }

    return () => clearTimeout(timeout);
  }, [navigate]);

  const handleDeptSelect = (dept) => {
    dispatch(setDepartment(dept))
    navigate("/dashboard/user");
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  if (loading || !selectedBusiness) return <Preloader />;

  return (
    <div className="min-h-screen bg-black text-white p-10 transition-all animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 animate-float">
        Select a Department – {selectedBusiness?.businessName}
      </h1>

      <input
        type="text"
        placeholder="🔍 Search department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 rounded bg-white/10 text-white placeholder-white/50 outline-none"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDepartments.map((dept, i) => (
          <button
            key={i}
            onClick={() => handleDeptSelect(dept)}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg animate-fadeIn"
          >
            <h2 className="text-lg font-semibold">{dept.name}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserDepartmentSelectionPage;
