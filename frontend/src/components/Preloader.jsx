// src/components/Preloader.jsx
import React from "react";

const Preloader = () => {
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center gap-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-16 bg-white animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.2s",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
};

export default Preloader;
