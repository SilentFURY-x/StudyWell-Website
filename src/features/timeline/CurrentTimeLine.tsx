import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CurrentTimeLine() {
  const [minutePercentage, setMinutePercentage] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      // Calculate percentage of the current hour (0 to 60 mins)
      const percentage = (minutes / 60) * 100;
      setMinutePercentage(percentage);
    };

    updatePosition();
    // Update every minute
    const interval = setInterval(updatePosition, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute flex items-center z-50 pointer-events-none"
      initial={{ top: `${minutePercentage}%`, opacity: 0 }}
      animate={{ top: `${minutePercentage}%`, opacity: 1 }}
      transition={{ duration: 1, ease: "linear" }}
      // ✅ CSS TRICK: Negative left margin allows it to "break out" of the container
      // width is calculated to span the extra space we pulled to the left
      style={{ 
        top: `${minutePercentage}%`,
        left: "-4.5rem", 
        width: "calc(100% + 4.5rem)" 
      }}
    >
        {/* The "Soul" (Glowing Orb) */}
        <div className="relative -ml-[6px] z-50 flex items-center justify-center">
             <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse" />
             <div className="absolute w-5 h-5 bg-red-500/30 rounded-full animate-ping" />
        </div>

        {/* The Line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-red-500/80 via-red-500/40 to-transparent shadow-[0_2px_10px_rgba(239,68,68,0.2)]" />
    </motion.div>
  );
}