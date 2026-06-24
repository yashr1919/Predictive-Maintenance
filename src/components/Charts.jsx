import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Charts({ machinesData }) {
  // Aggregate history across machines for a global timeline view if necessary,
  // or just show the primary traces. Since we fetch results=20 for each channel,
  // we assume the last 20 timestamps correlate. 
  
  // We'll prepare a unified dataset based on history length of F1 (fallback to others if needed)
  const baseHistory = machinesData['F1']?.history || machinesData['F2']?.history || [];
  
  const chartData = baseHistory.map((_, i) => {
    const point = { time: `T-${19 - i}` };
    Object.keys(machinesData).forEach(name => {
      const machine = machinesData[name];
      if (machine && machine.history[i]) {
        point[`${name}_RUL`] = Number(machine.history[i].field2) || 0;
        point[`${name}_Health`] = Number(machine.history[i].field3) || 0;
      }
    });
    return point;
  });

  const colors = {
    'F1': '#3b82f6', // blue
    'F2': '#8b5cf6', // purple
    'F3': '#ec4899', // pink
    'F4': '#06b6d4', // cyan
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-gray-400 mb-2">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* RUL vs Time */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Remaining Useful Life (RUL) vs Time</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {Object.keys(machinesData).map(name => (
                <Line 
                  key={`${name}_RUL`}
                  type="monotone" 
                  name={name}
                  dataKey={`${name}_RUL`} 
                  stroke={colors[name]} 
                  strokeWidth={2}
                  dot={{ r: 2, fill: colors[name], strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health vs Time */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Equipment Health vs Time</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[-5, 105]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {Object.keys(machinesData).map(name => (
                <Line 
                  key={`${name}_Health`}
                  type="monotone" 
                  name={name}
                  dataKey={`${name}_Health`} 
                  stroke={colors[name]} 
                  strokeWidth={2}
                  dot={{ r: 2, fill: colors[name], strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
