import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { getFeedbackForDepartment } from "../services/feedbackService";

const BusinessFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const selectedDepartment = useSelector((state) => state.business.selectedDepartment);

  useEffect(() => {
    const loadFeedback = async () => {
      if (!selectedBusiness || !selectedBusiness.businessId) {
        setErrorMessage("Something went wrong.");
        return;
      }

      setErrorMessage("");
      setLoading(true);

      try {
        const data = await getFeedbackForDepartment(
          selectedBusiness.businessId,
          selectedDepartment.departmentId
        );
        console.log("Feedback API response:", data);
        setFeedbackList(data.feedbacks || []);
      } catch (err) {
        console.error("Error loading feedback:", err);
        setErrorMessage("Failed to load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [selectedBusiness, selectedDepartment]);

return (
  <section className="p-4 sm:p-6 w-full max-w-full sm:max-w-4xl mx-auto flex flex-col items-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
      💬{" "}
      <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        View Feedback
      </span>
    </h2>

    {errorMessage ? (
      <div className="text-center text-red-400 font-semibold text-sm sm:text-base">
        {errorMessage}
      </div>
    ) : loading ? (
      <div className="text-center text-white/60 animate-pulse text-sm sm:text-base">
        Loading feedback...
      </div>
    ) : feedbackList.length === 0 ? (
      <div className="text-center text-white/60 animate-pulse text-sm sm:text-base">
        No comments yet...
      </div>
    ) : (
      <div className="space-y-4 sm:space-y-6 w-full">
        {feedbackList.map((fb) => (
          <div
            key={fb._id}
            className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 shadow-md sm:shadow-lg backdrop-blur-md"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-1 sm:gap-0">
              <h4 className="text-base sm:text-lg font-semibold text-white truncate max-w-[180px] sm:max-w-none">
                {fb.userId?.username || "Anonymous"}
              </h4>
              <span className="text-xs sm:text-sm text-white/50">
                {`${format(parseISO(fb.createdAt), "PPP")} (${formatDistanceToNow(parseISO(fb.createdAt), {
                  addSuffix: true,
                })})`}
              </span>
            </div>

            <div className="flex items-center mb-2">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-lg sm:text-xl ${
                      i < fb.rating ? "text-blue-400" : "text-gray-600"
                    }`}
                  />
                ))}
            </div>

            <p className="text-white/80 italic text-sm sm:text-base">"{fb.comment}"</p>
          </div>
        ))}
      </div>
    )}
  </section>
);
};

export default BusinessFeedback;
