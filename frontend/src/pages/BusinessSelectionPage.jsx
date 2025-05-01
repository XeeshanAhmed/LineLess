import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyBusinesses = [
  { name: "QuickFix Electronics", hasDepartments: true, departments: ["Repair", "Sales", "Support"] },
  { name: "HealthyBite Cafe", hasDepartments: false, departments: [] },
  { name: "BrightSmiles Dental", hasDepartments: true, departments: ["Consultation", "Cleaning", "Surgery"] },
];

const BusinessSelectionPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBusinesses = dummyBusinesses.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (business) => {
    // Save the selected business in local storage
    localStorage.setItem("selectedBusiness", JSON.stringify(business));

    // If the business has departments, navigate to the department selection page
    if (business.hasDepartments) {
      navigate("/select-department");
    } else {
      // Otherwise, navigate directly to the dashboard
      navigate("/dashboard/user");
    }
  };

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
        {filteredBusinesses.map((biz, i) => (
          <button
            key={i}
            onClick={() => handleSelect(biz)}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all transform hover:scale-105 hover:shadow-lg animate-fadeIn"
          >
            <h2 className="text-lg font-semibold">{biz.name}</h2>
            <p className="text-sm text-white/60">
              {biz.hasDepartments ? "Multiple Departments" : "No Departments"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusinessSelectionPage;
