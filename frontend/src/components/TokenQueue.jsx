import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const TokenQueue = () => {
  const [queue, setQueue] = useState([
    {
      _id: "1",
      tokenNumber: 101,
      userId: { username: "hammad" },
      createdAt: new Date(),
    },
    {
      _id: "2",
      tokenNumber: 102,
      userId: { username: "moeez" },
      createdAt: new Date(),
    },
    {
      _id: "3",
      tokenNumber: 103,
      userId: { username: "zeeshan" },
      createdAt: new Date(),
    },
    {
      _id: "4",
      tokenNumber: 99,
      userId: { username: "hassnain" },
      createdAt: new Date(),
    },
    {
      _id: "5",
      tokenNumber: 54,
      userId: { username: "Ali" },
      createdAt: new Date(),
    }
  ]);

  const handleStatusChange = (tokenId, status) => {
    console.log(`Token ${tokenId} marked as ${status}`);
    setQueue((prev) => prev.filter((t) => t._id !== tokenId));
  };

  if (!queue.length) {
    return (
      <div className="p-10 bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-white/10 rounded-3xl shadow-2xl text-center text-white/80">
        <p className="text-3xl font-medium">🎉 No tokens in queue!</p>
      </div>
    );
  }

  const currentToken = queue[0];
  const waitingTokens = queue.slice(1);

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Current Token */}
      <div className="bg-gradient-to-br from-[#1f1f25] to-[#1a1a1f] border border-white/10 rounded-3xl p-10 text-center shadow-xl">
        <p className="text-white/60 text-base uppercase tracking-widest">Now Serving</p>
        <h1 className="text-7xl font-bold text-cyan-400 mt-4 drop-shadow-lg">
          #{currentToken.tokenNumber}
        </h1>
        <div className="flex justify-center items-center gap-3 mt-6 text-white/80 text-lg">
          <FaUserCircle className="text-white/60 text-2xl" />
          <span className="font-medium">{currentToken.userId.username}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          <button
            onClick={() => handleStatusChange(currentToken._id, "served")}
            className="px-8 py-3 rounded-full bg-green-500/20 hover:bg-green-400/20 text-green-300 border border-green-300/30 backdrop-blur transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            ✅ Mark as Served
          </button>
          <button
            onClick={() => handleStatusChange(currentToken._id, "skipped")}
            className="px-8 py-3 rounded-full bg-red-500/20 hover:bg-red-400/20 text-red-300 border border-red-300/30 backdrop-blur transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
          >
            ⏭️ Skip Token
          </button>
        </div>
      </div>

        {/* Upcoming Tokens */}
        {waitingTokens.length > 0 && (
          <div className="space-y-6">
          <h2 className="text-white/80 text-2xl font-semibold text-center">Upcoming Tokens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {waitingTokens.map((token) => (
              <div
                key={token._id}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg shadow-md hover:bg-white/10 transition text-white/90"
              >
                <div className="flex items-center gap-3 text-lg">
                  <FaUserCircle className="text-white/60 text-2xl" />
                  <span>{token.userId.username}</span>
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
