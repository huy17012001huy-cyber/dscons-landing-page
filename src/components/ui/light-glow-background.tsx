import React from "react";

export const LightGlowBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-background"> 
      {/* Light Sky Blue Glow */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{
          backgroundImage: `radial-gradient(circle at center, #93c5fd, transparent)`,
          opacity: 0.8
        }} 
      />
    </div>
  );
};

export default LightGlowBackground;
