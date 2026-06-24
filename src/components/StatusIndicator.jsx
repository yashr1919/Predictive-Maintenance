import React from 'react';

export default function StatusIndicator({ label, color }) {
  const colorMap = {
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20"
  };

  const indicatorBadge = colorMap[color] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${indicatorBadge}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${color === 'red' ? 'bg-red-500 animate-pulse' : (color === 'orange' ? 'bg-orange-500 animate-pulse' : 'bg-green-500')}`} />
      {label}
    </span>
  );
}
