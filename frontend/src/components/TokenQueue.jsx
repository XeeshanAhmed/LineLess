import { useEffect, useState } from "react";
import { getTokenQueue, updateTokenStatus } from "../services/tokenService";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const TokenQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedBusiness = useSelector((state) => state.business.selectedBusiness);
  const selectedDepartment = useSelector((state) => state.business.selectedDepartment);

  const businessId = selectedBusiness?.businessId;
  const departmentId = selectedDepartment?.departmentId;

  useEffect(() => {
    if (businessId && departmentId) {
      fetchQueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, departmentId]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await getTokenQueue(businessId, departmentId);
      setQueue(res.queue);
    } catch (error) {
      console.error("Failed to fetch token queue", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tokenId, status) => {
    try {
      await updateTokenStatus(tokenId, status);
      fetchQueue(); // Refresh the queue
    } catch (error) {
      console.error("Failed to update token status", error);
    }
  };

  if (loading) {
    return <p className="text-center text-white">Loading queue...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Token Queue</h1>

      {queue.length === 0 ? (
        <p className="text-center text-white">No tokens in queue.</p>
      ) : (
        <>
          {/* Current Token */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-md text-center">
            <h2 className="text-4xl font-bold text-blue-600 mb-2">
              Current Token: {queue[0].tokenNumber}
            </h2>
            <p className="text-gray-700 font-medium mb-4">
              User: {queue[0]?.userId?.username || "Unknown"}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleStatusChange(queue[0]._id, "completed")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Serviced
              </button>
              <button
                onClick={() => handleStatusChange(queue[0]._id, "cancelled")}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Cancelled
              </button>
            </div>
          </div>

          {/* Remaining Tokens */}
          <h3 className="text-xl text-white font-semibold mb-2">Waiting Queue</h3>
          <ul className="space-y-2">
            {queue.slice(1).map((token) => (
              <li
                key={token._id}
                className="bg-white/20 backdrop-blur-sm rounded-md px-4 py-3 flex items-center justify-between text-white"
              >
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-2xl" />
                  <span>
                    {token.userId?.username || "Unknown"} - Token #{token.tokenNumber}
                  </span>
                </div>
                <span className="text-sm text-gray-300">
                  {new Date(token.createdAt).toLocaleTimeString()}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TokenQueue;
