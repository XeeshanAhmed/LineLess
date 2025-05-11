import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import Preloader from "../components/Preloader";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsByBusinessId } from "../services/departmentService";
import { setDepartment } from "../store/slices/businessSlice";

const BusinessDepartmentSelectionPage = () => {
  const navigate = useNavigate();
  // const [selectedBusiness, setSelectedBusiness] = useState(null);
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState([]);
  const dispatch=useDispatch();

    useEffect(() => {
      const fetchDepartments = async () => {
        if (!selectedBusiness) {
          navigate("/login/business");
          return;
        }
  
        try {
          const data = await getDepartmentsByBusinessId(selectedBusiness.businessId);
          const fetchedDepartments = data;          
          setDepartments(fetchedDepartments);
        } catch (error) {
          console.error("Error fetching departments:", error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDepartments();
    }, [navigate, selectedBusiness]);
  

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
    <div className="min-h-screen bg-black text-white p-10 transition-all animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 animate-float">
        Select a Department – {selectedBusiness.name}
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

export default BusinessDepartmentSelectionPage;
