import React, { useState, useEffect } from 'react';
import { fetchChannelData } from '../services/api';
import SummaryCards from './SummaryCards';
import AlertsPanel from './AlertsPanel';
import MachineCard from './MachineCard';
import Charts from './Charts';
import { Activity } from 'lucide-react';

const CHANNELS = {
  'F1': 3333409,
  'F2': 3334970,
  'F3': 3334972,
  'F4': 3334974
};

export default function Dashboard() {
  const [machinesData, setMachinesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const results = {};
      const components = Object.keys(CHANNELS);
      
      const requests = components.map(name => 
        fetchChannelData(CHANNELS[name]).then(data => {
          results[name] = data;
        })
      );

      await Promise.all(requests);
      setMachinesData(results);
      setError(null);
    } catch (err) {
      console.error("Dashboard failed to fetch data", err);
      setError("Failed to fetch live data from ThingSpeak. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    loadData();

    // 15 seconds polling
    const interval = setInterval(() => {
      loadData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Activity size={48} className="text-primary animate-pulse" />
        <h2 className="text-xl text-gray-300 font-semibold animate-pulse">Initializing Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-purple-400">
            Predictive Maintenance Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Real-time Machine Health Monitoring</p>
        </div>
        
        <div className="flex items-center gap-3 glass px-4 py-2 rounded-full border border-white/10 self-start md:self-auto">
          <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${error ? 'bg-red-500 shadow-red-500' : 'bg-success shadow-success'} animate-pulse`}></div>
          <span className="text-sm font-medium text-gray-300">
            {error ? 'Connection Error' : 'Live: ThingSpeak AWS'}
          </span>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* Summaries & Alerts */}
      <SummaryCards machinesData={machinesData} />
      <AlertsPanel machinesData={machinesData} />

      {/* Machine Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.keys(CHANNELS).map((name) => (
          <MachineCard key={name} name={name} data={machinesData[name]} />
        ))}
      </div>

      {/* Expanded Charting Section */}
      <Charts machinesData={machinesData} />
    </div>
  );
}
