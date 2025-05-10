// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";
// import { BarChart3 } from "lucide-react";


// const AnalyticsTab = () => {
//   // Dummy data
//   const tokenData = [
//     { day: "Mon", tokens: 60 },
//     { day: "Tue", tokens: 78 },
//     { day: "Wed", tokens: 52 },
//     { day: "Thu", tokens: 93 },
//     { day: "Fri", tokens: 85 },
//     { day: "Sat", tokens: 44 },
//     { day: "Sun", tokens: 67 },
//   ];

//   const feedbackData = [
//     { rating: "⭐", count: 2 },
//     { rating: "⭐⭐", count: 5 },
//     { rating: "⭐⭐⭐", count: 20 },
//     { rating: "⭐⭐⭐⭐", count: 40 },
//     { rating: "⭐⭐⭐⭐⭐", count: 20 },
//   ];

//   return (
//     <div className="space-y-8 animate-fadeIn -mt-6">
//       <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 justify-center">
//         <BarChart3 className="w-8 h-8 text-green-400" />
//         <span className="text-gradient bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
//           View Analytics
//         </span>
//       </h2>
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
//           <h3 className="text-xl font-semibold">Total Tokens Issued</h3>
//           <p className="text-3xl mt-2 font-bold text-green-400">528</p>
//         </div>
//         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
//           <h3 className="text-xl font-semibold">Average Wait Time</h3>
//           <p className="text-3xl mt-2 font-bold text-yellow-300">12 mins</p>
//         </div>
//         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
//           <h3 className="text-xl font-semibold">Feedbacks Received</h3>
//           <p className="text-3xl mt-2 font-bold text-teal-300">87</p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Line Chart */}
//         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
//           <h3 className="text-lg font-semibold mb-4">Tokens Issued (Last 7 Days)</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={tokenData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
//               <XAxis dataKey="day" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Line type="monotone" dataKey="tokens" stroke="#34d399" strokeWidth={2} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Bar Chart */}
//         <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
//           <h3 className="text-lg font-semibold mb-4">User Feedback Distribution</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={feedbackData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
//               <XAxis dataKey="rating" stroke="#ccc" />
//               <YAxis stroke="#ccc" />
//               <Tooltip />
//               <Bar dataKey="count" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalyticsTab;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { BarChart3 } from "lucide-react";
import { getTokenAnalytics, getFeedbackAnalytics } from "../services/analyticsService";

const AnalyticsTab = () => {
  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const selectedDepartment = useSelector((state) => state.business.selectedDepartment);

  const [tokenData, setTokenData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBusiness && selectedDepartment) {
      const fetchData = async () => {
        setLoading(true);
        try {
          // Fetch token analytics
          const tokenRes = await getTokenAnalytics(
            selectedBusiness.businessId, 
            selectedDepartment.departmentId
          );
          setTokenData(tokenRes.tokenData);
          setTotalTokens(tokenRes.totalTokens);

          // Fetch feedback analytics
          const feedbackRes = await getFeedbackAnalytics(
            selectedBusiness.businessId, 
            selectedDepartment.departmentId
          );
          setFeedbackData(feedbackRes.feedbackChart);
          setTotalFeedbacks(feedbackRes.totalFeedbacks);
        } catch (error) {
          console.error("Error fetching analytics:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedBusiness, selectedDepartment]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-white text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn -mt-6">
      <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 justify-center">
        <BarChart3 className="w-8 h-8 text-green-400" />
        <span className="text-gradient bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
          View Analytics
        </span>
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-xl font-semibold">Total Tokens Issued</h3>
          <p className="text-3xl mt-2 font-bold text-green-400">{totalTokens}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-xl font-semibold">Average Wait Time</h3>
          <p className="text-3xl mt-2 font-bold text-yellow-300">12 mins</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-xl font-semibold">Feedbacks Received</h3>
          <p className="text-3xl mt-2 font-bold text-teal-300">{totalFeedbacks}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-4">Tokens Issued (Last 7 Days)</h3>
          {tokenData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="day" 
                  stroke="#ccc"
                />
                <YAxis stroke="#ccc" />
                <Tooltip 
                  formatter={(value) => [`${value} tokens`, 'Count']}
                  labelFormatter={(label) => {
                    const date = tokenData.find(d => d.day === label)?.date;
                    return date ? new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : label;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tokens" 
                  stroke="#34d399" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-white/70">
              No token data available for the last 7 days
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-white">
          <h3 className="text-lg font-semibold mb-4">User Feedback Distribution</h3>
          {feedbackData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedbackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="rating" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-white/70">
              No feedback data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

