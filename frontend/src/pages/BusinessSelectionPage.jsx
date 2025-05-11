import { useState, useEffect , useCallback,useMemo} from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/Preloader";
import { fetchBusinesses } from "../services/fetchBusinessService";
import { useDispatch } from "react-redux"; 
import { setBusiness,setDepartment } from "../store/slices/businessSlice";
import { getDepartmentsByBusinessId } from "../services/departmentService";



const BusinessSelectionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1500); // Preloader duration
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBusinesses();
        setBusinesses(data);
        
      } catch (err) {
        console.error("Failed to load businesses", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

    const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, businesses]);
  const handleSelect = useCallback(async (business) => {
    dispatch(setBusiness(business));

    if (!business.hasDepartments) {
      try {
        const departments = await getDepartmentsByBusinessId(business.businessId);
        if (departments.length > 0) {
          dispatch(setDepartment(departments[0]));
        }
        navigate("/dashboard/user");
      } catch (error) {
        console.error("Failed to load departments", error);
      }
    } else {
      navigate("/select-user-department");
    }
  }, [dispatch, navigate]);
  

  if (loading) return <Preloader />;

  return (
    
    <div className="min-h-screen bg-black text-white p-10 transition-all animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 animate-float">Select a Business</h1>
      <input
        type="text"
        placeholder="🔍 Search business..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 rounded bg-white/10 text-white placeholder-white/50 outline-none"
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredBusinesses.map((biz, i) => {
  const departments = biz.departments || [];
  const hasOnlyGeneral =departments.length === 1 && departments[0].toLowerCase() === "general";


  return (
    <button
      key={i}
      onClick={() => handleSelect(biz)}
      className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg animate-fadeIn"
    >
      <h2 className="text-lg font-semibold">{biz.name}</h2>
      <p className="text-sm text-white/60">
        {hasOnlyGeneral
          ? "No Departments"
          :"Multiple Departments"}
      </p>
    </button>
  );
})}


      </div>
    </div>
  );
};

export default BusinessSelectionPage;
