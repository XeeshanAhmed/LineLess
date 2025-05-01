import { useNavigate } from "react-router-dom";

const DepartmentSelectionPage = () => {
  const navigate = useNavigate();
  const selectedBusiness = JSON.parse(localStorage.getItem("selectedBusiness"));

  // If no business is selected, redirect back to business selection
  if (!selectedBusiness) {
    navigate("/business-selection");
    return null;  // Stop rendering if no business is selected
  }

  const handleDeptSelect = (dept) => {
    localStorage.setItem("selectedDepartment", dept);
    navigate("/dashboard/user");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 transition-all animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6 animate-float">
        Select a Department – {selectedBusiness?.name}
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedBusiness?.departments.map((dept, i) => (
          <button
            key={i}
            onClick={() => handleDeptSelect(dept)}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg animate-fadeIn"
          >
            <h2 className="text-lg font-semibold">{dept}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentSelectionPage;
