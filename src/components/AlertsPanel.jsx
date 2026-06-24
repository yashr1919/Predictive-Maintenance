import React from 'react';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { getStatusFromFault } from '../utils/statusHelper';
import { motion, AnimatePresence } from 'framer-motion';

const SENSOR_LEGEND = [
  { id: 'F1', label: 'FBG Sensor 1' },
  { id: 'F2', label: 'FBG Sensor 2' },
  { id: 'F3', label: 'FBG Sensor 3' },
  { id: 'F4', label: 'FBG Sensor 4' },
];

export default function AlertsPanel({ machinesData }) {
  const alerts = Object.entries(machinesData).filter(([_, machine]) => {
    if (!machine) return false;
    const { label } = getStatusFromFault(machine.fault);
    return label === 'Warning' || label === 'Critical';
  });

  return (
    <div className="mb-6 flex flex-col lg:flex-row gap-4">
      {/* Alerts column */}
      <div className="flex-1 space-y-3 min-w-0">
        <AnimatePresence>
          {alerts.length > 0 ? (
            alerts.map(([name, machine]) => {
              const { label } = getStatusFromFault(machine.fault);
              const isCritical = label === 'Critical';

              return (
                <motion.div 
                  key={name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass flex items-center gap-3 p-3 rounded-xl border ${
                    isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'
                  }`}
                >
                  {isCritical ? (
                    <AlertOctagon className="text-red-500 flex-shrink-0" size={20} />
                  ) : (
                    <AlertTriangle className="text-orange-500 flex-shrink-0" size={20} />
                  )}
                  
                  <div>
                    <h4 className={`font-semibold text-sm ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                      {isCritical ? "Application Alert: CRITICAL" : "Application Alert: WARNING"}
                    </h4>
                    <p className="text-gray-300 text-xs">
                      {name} {isCritical ? "is in CRITICAL condition." : "requires attention (WARNING)."} Health is at {machine.health.toFixed(1)}%.
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="glass flex items-center gap-3 p-3 rounded-xl border border-green-500/20 bg-green-500/5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px] shadow-green-500 animate-pulse"></div>
              <p className="text-green-400 text-sm font-medium">All sensors operating normally.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FBG Legend box */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-xl border border-white/10 p-4 lg:w-64 flex-shrink-0"
      >
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-indigo-400" size={18} />
          <h4 className="text-sm font-semibold text-white">Sensor Reference</h4>
        </div>
        <div className="space-y-2">
          {SENSOR_LEGEND.map(({ id, label }) => (
            <div key={id} className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md min-w-[28px] text-center">{id}</span>
              <span className="text-gray-300 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
