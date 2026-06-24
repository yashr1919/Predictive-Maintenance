import React from 'react';
import { getStatusFromFault } from '../utils/statusHelper';

export default function SummaryCards({ machinesData }) {
  // Compute totals based on fault states
  let healthy = 0;
  let warning = 0;
  let critical = 0;

  // We map over keys since `machinesData` is an object { ComponentA: data, ComponentB: data, ... }
  Object.values(machinesData).forEach((machine) => {
    if (!machine) return;
    const { label } = getStatusFromFault(machine.fault);
    if (label === 'Healthy') healthy++;
    if (label === 'Warning') warning++;
    if (label === 'Critical') critical++;
  });

  const total = Object.keys(machinesData).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="glass rounded-2xl p-6">
        <p className="text-gray-400 text-sm font-medium">Total FBGs (F)</p>
        <p className="text-3xl font-bold text-white mt-2">{total}</p>
      </div>
      <div className="glass border-green-500/20 rounded-2xl p-6">
        <p className="text-green-500 text-sm font-medium">Healthy Count</p>
        <p className="text-3xl font-bold text-green-500 mt-2">{healthy}</p>
      </div>
      <div className="glass border-orange-500/20 rounded-2xl p-6">
        <p className="text-orange-500 text-sm font-medium">Warning Count</p>
        <p className="text-3xl font-bold text-orange-500 mt-2">{warning}</p>
      </div>
      <div className="glass border-red-500/20 border rounded-2xl p-6">
        <p className="text-red-500 text-sm font-medium">Critical Count</p>
        <p className="text-3xl font-bold text-red-500 mt-2">{critical}</p>
      </div>
    </div>
  );
}
