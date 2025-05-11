import { useEffect, useState } from "react";
import { getTokenQueue, updateTokenStatus } from "../services/tokenService";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import socket from "../services/socket/socket";
import { resetTokenCounter } from "../services/tokenCounterService";


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
    socket.on("newTokenGenerated", (data) => {
        if (
          data.businessId === selectedBusiness.businessId &&
          data.departmentId === selectedDepartment.departmentId
        ) {
          fetchQueue(); // 👈 Re-fetch updated queue
        }
      });
    
      return () => socket.off("newTokenGenerated");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, departmentId]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await getTokenQueue(businessId, departmentId);
      setQueue(res.queue || []);
    } catch (error) {
      console.error("Failed to fetch token queue", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (tokenId, status) => {
    try {
      await updateTokenStatus(tokenId, status);
      setQueue((prevQueue) => prevQueue.filter((token) => token._id !== tokenId));
    } catch (error) {
      console.error("Failed to update token status", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white py-20">
        <p className="text-xl">Loading queue...</p>
      </div>
    );
  }

  if (!queue.length) {
    return (
      <div className="p-10 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-white/10 rounded-3xl shadow-2xl text-center text-white/80">
        <p className="text-3xl font-medium"> No tokens in queue!</p>
      </div>
    );
  }

  const currentToken = queue[0];
  const waitingTokens = queue.slice(1);

  return (
    <div className="max-w-5xl mx-auto space-y-12 mt-28">
      {/* Current Token */}
      <div className=" bg-gradient-to-br from-[#1f1f25] to-[#1a1a1f] border border-white/10 rounded-3xl p-10 text-center shadow-xl">
        <p className="text-white/60 text-base uppercase tracking-widest">
          Now Serving
        </p>
        <h1 className="text-7xl font-bold text-cyan-400 mt-4 drop-shadow-lg">
          #{currentToken.tokenNumber}
        </h1>
        <div className="flex justify-center items-center gap-3 mt-6 text-white/80 text-lg">
          <FaUserCircle className="text-white/60 text-2xl" />
          <span className="font-medium">
            {currentToken.userId?.username || "Unknown"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          <button
            onClick={() => handleStatusChange(currentToken._id, "completed")}
            className="px-8 py-3 rounded-full bg-green-500/20 hover:bg-green-400/20 text-green-300 border border-green-300/30 backdrop-blur transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            ✅ Mark as Served
          </button>
          <button
            onClick={() => handleStatusChange(currentToken._id, "cancelled")}
            className="px-8 py-3 rounded-full bg-red-500/20 hover:bg-red-400/20 text-red-300 border border-red-300/30 backdrop-blur transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            ⏭ Skip Token
          </button>
        
        <button
          onClick={async () => {
            const confirmReset = confirm(
              "Are you sure you want to reset token count?"
            );
            if (!confirmReset) return;

            try {
              await resetTokenCounter(businessId, departmentId);
              alert("Token count reset successfully.");
              fetchQueue(); // optional: re-fetch tokens if logic changes
            } catch (err) {
              console.error("Failed to reset token count", err);
              alert("Failed to reset token count.");
            }
          }}
          className="px-8 py-3 rounded-full bg-yellow-500/20 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-300/30 backdrop-blur transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
        >
          🔁 Reset Token Count
        </button>
        </div>
      </div>

      {/* Upcoming Tokens */}
      {waitingTokens.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-white/80 text-2xl font-semibold text-center">
            Upcoming Tokens
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {waitingTokens.map((token) => (
              <div
                key={token._id}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg shadow-md hover:bg-white/10 transition text-white/90"
              >
                <div className="flex items-center gap-3 text-lg">
                  <FaUserCircle className="text-white/60 text-2xl" />
                  <span>{token.userId?.username || "Unknown"}</span>
                </div>
                <span className="text-indigo-300 font-bold text-2xl">
                  #{token.tokenNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenQueue;