import React from 'react';
import { Activity, Thermometer, Wind, Zap } from 'lucide-react';

const iconMap = {
  temperature: Thermometer,
  vibration: Activity,
  pressure: Wind,
  acoustic: Zap,
};

export default function MetricCard({ title, value, unit, type, trend, status }) {
  const Icon = iconMap[type] || Activity;
  
  const statusColor = {
    normal: 'text-success',
    warning: 'text-warning',
    critical: 'text-danger'
  }[status] || 'text-gray-400';

  return (
    <div className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="text-sm font-medium text-gray-400">{unit}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-white/5 ${statusColor}`}>
          <Icon size={24} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span className={trend > 0 ? 'text-danger' : 'text-success'}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-gray-500">vs last hour</span>
      </div>
    </div>
  );
}
