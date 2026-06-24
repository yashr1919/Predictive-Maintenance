import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CHANNELS = {
  'F1': 3333409,
  'F2': 3334970,
  'F3': 3334972,
  'F4': 3334974
};

export default function ComponentDetail() {
  const { name } = useParams();
  const navigate = useNavigate();

  // Decode the URL parameter safely
  const componentName = decodeURIComponent(name);
  const channelId = CHANNELS[componentName];

  if (!channelId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl text-red-500 font-semibold">Component Not Found</h2>
        <button onClick={() => navigate('/')} className="text-primary hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  // Helper configuration for iframes
  const iframeBaseUrl = `https://thingspeak.mathworks.com/channels/${channelId}/charts`;
  // Preserving their native white background and dynamic polling styling as requested
  const getIframeSrc = (fieldId) => 
    `${iframeBaseUrl}/${fieldId}?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15`;

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Header section */}
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10"
        >
          <ArrowLeft className="text-gray-300" size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-purple-400">
            {componentName} Details
          </h1>
          <p className="text-gray-400 mt-1">Live ThingSpeak Native Visualization (Channel ID: {channelId})</p>
        </div>
      </header>

      {/* ThingSpeak Embedded Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        <div className="glass rounded-2xl p-4 md:p-6 pb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Field 1: SVM Accuracy</h3>
          <div className="w-full max-w-[450px] h-[260px] flex justify-center rounded-xl overflow-hidden bg-white shadow-lg">
            <iframe 
              width="100%" 
              height="100%"
              style={{ border: 'none' }}
              src={getIframeSrc(1)} 
              title="Field 1 Chart"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 md:p-6 pb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Field 2: Remaining Useful Life (RUL)</h3>
          <div className="w-full max-w-[450px] h-[260px] flex justify-center rounded-xl overflow-hidden bg-white shadow-lg">
            <iframe 
               width="100%" 
               height="100%"
               style={{ border: 'none' }}
               src={getIframeSrc(2)} 
               title="Field 2 Chart"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 md:p-6 pb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Field 3: Equipment Health</h3>
          <div className="w-full max-w-[450px] h-[260px] flex justify-center rounded-xl overflow-hidden bg-white shadow-lg">
            <iframe 
              width="100%" 
              height="100%"
              style={{ border: 'none' }}
              src={getIframeSrc(3)} 
              title="Field 3 Chart"
            />
          </div>
        </div>

        <div className="glass rounded-2xl p-4 md:p-6 pb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Field 4: Fault Status</h3>
          <div className="w-full max-w-[450px] h-[260px] flex justify-center rounded-xl overflow-hidden bg-white shadow-lg">
            <iframe 
              width="100%" 
              height="100%"
              style={{ border: 'none' }}
              src={getIframeSrc(4)} 
              title="Field 4 Chart"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
