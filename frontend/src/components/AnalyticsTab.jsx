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
  const [averageProcessingTime, setaverageProcessingTime] = useState(0);
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
          setaverageProcessingTime(tokenRes.avgProcessingTime)

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
  <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn -mt-2 sm:-mt-4 md:-mt-6 px-2 sm:px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2 sm:gap-3 justify-center">
      <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400" />
      <span className="text-gradient bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
        View Analytics
      </span>
    </h2>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md sm:shadow-lg text-white">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Total Tokens Issued</h3>
        <p className="text-2xl sm:text-3xl mt-1 sm:mt-2 font-bold text-green-400">{totalTokens}</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md sm:shadow-lg text-white">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Average Wait Time</h3>
        <p className="text-2xl sm:text-3xl mt-1 sm:mt-2 font-bold text-yellow-300">{}</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md sm:shadow-lg text-white">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Feedbacks Received</h3>
        <p className="text-2xl sm:text-3xl mt-1 sm:mt-2 font-bold text-teal-300">{totalFeedbacks}</p>
      </div>
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
      {/* Line Chart */}
      <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md sm:shadow-lg text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">Tokens Issued (Last 7 Days)</h3>
        {tokenData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
            <LineChart data={tokenData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis 
                dataKey="day" 
                stroke="#ccc"
                tick={{ fontSize: '0.65rem' }}
              />
              <YAxis stroke="#ccc" tick={{ fontSize: '0.65rem' }} />
              <Tooltip 
                formatter={(value) => [`${value} tokens`, 'Count']}
                labelFormatter={(label) => {
                  const date = tokenData.find(d => d.day === label)?.date;
                  return date ? new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tokens" 
                stroke="#34d399" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 sm:py-10 md:py-12 text-white/70 text-sm sm:text-base">
            No token data available for the last 7 days
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-md sm:shadow-lg text-white">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">User Feedback Distribution</h3>
        {feedbackData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
            <BarChart data={feedbackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="rating" stroke="#ccc" tick={{ fontSize: '0.65rem' }} />
              <YAxis stroke="#ccc" tick={{ fontSize: '0.65rem' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-8 sm:py-10 md:py-12 text-white/70 text-sm sm:text-base">
            No feedback data available
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default AnalyticsTab;

