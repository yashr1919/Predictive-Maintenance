import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StatusIndicator from './StatusIndicator';
import { getStatusFromFault, getRulCategory } from '../utils/statusHelper';

export default function MachineCard({ name, data }) {
  const navigate = useNavigate();

  if (!data) {
    return (
      <div className="glass h-64 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { fault, health, rul, accuracy, history } = data;
  const status = getStatusFromFault(fault);
  const rulCat = getRulCategory(rul);

  // Border coloring logic
  const borderColors = {
    red: 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    orange: 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
    green: 'border-green-500/20'
  };

  const chartData = history.map((item, idx) => ({
    time: idx,
    health: Number(item.field3) || 0
  }));

  // Circular gauge calculations
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health / 100) * circumference;

  return (
    <motion.div 
      onClick={() => navigate(`/component/${encodeURIComponent(name)}`)}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`glass rounded-2xl p-6 transition-all duration-300 border bg-card/60 cursor-pointer hover:ring-2 hover:ring-primary/50 hover:shadow-2xl ${borderColors[status.color]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <StatusIndicator label={status.label} color={status.color} />
        </div>
        
        {/* Health Gauge */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <svg className="transform -rotate-90 w-20 h-20">
            <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
            <motion.circle 
              cx="40" cy="40" r={radius} 
              stroke="currentColor" 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={status.color === 'red' ? 'text-red-500' : (status.color === 'orange' ? 'text-orange-500' : 'text-green-500')} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{health.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">RUL</p>
          <p className="font-semibold text-white">{rul.toFixed(1)}% <span className="text-xs ml-1 opacity-70">({rulCat})</span></p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">SVM Accuracy</p>
          <p className="font-semibold text-white">{(accuracy * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Mini Trend Line */}
      <div className="h-16 w-full opacity-70">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <YAxis domain={[-10, 110]} hide />
            <Line 
              type="monotone" 
              dataKey="health" 
              stroke={status.color === 'red' ? '#ef4444' : (status.color === 'orange' ? '#f97316' : '#22c55e')} 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
