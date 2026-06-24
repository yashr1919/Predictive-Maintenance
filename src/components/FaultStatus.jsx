import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FaultStatus({ healthScore, rulDays, faultPrediction }) {
  
  let statusConfig = {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    message: 'System operating normally. No faults predicted.'
  };

  if (healthScore < 50 || faultPrediction) {
    statusConfig = {
      icon: AlertCircle,
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      message: 'CRITICAL: High probability of fault detected. Immediate maintenance required.'
    };
  } else if (healthScore < 80) {
    statusConfig = {
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
      border: 'border-warning/20',
      message: 'WARNING: Sub-optimal performance detected. Schedule inspection.'
    };
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div className={`glass rounded-2xl p-6 border ${statusConfig.border}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">System Health Status</h2>
            <p className="text-gray-400">{statusConfig.message}</p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400 mb-1">Health Score</p>
            <p className={`text-3xl font-bold ${statusConfig.color}`}>{healthScore}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-400 mb-1">Est. RUL</p>
            <p className="text-3xl font-bold text-white">{rulDays} <span className="text-lg text-gray-500">days</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
