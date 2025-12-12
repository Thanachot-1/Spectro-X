import React from 'react';
import { PredictionPhase } from '../types';
import { CalendarClock, ChefHat } from 'lucide-react';

interface RipenessTimelineProps {
  predictions: PredictionPhase[];
}

const RipenessTimeline: React.FC<RipenessTimelineProps> = ({ predictions }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col flex-grow">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CalendarClock className="text-blue-500" />
        พยากรณ์ความสุก
      </h2>
      
      <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
        {predictions.map((pred, index) => (
          <div key={index} className="flex gap-4 relative">
             {/* Timeline Line */}
            {index !== predictions.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-16px] w-0.5 bg-gray-200"></div>
            )}

            <div className={`
                w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm z-10
                ${index === 0 ? 'bg-durian-yellow text-white shadow-md' : 'bg-gray-100 text-gray-500'}
            `}>
                {pred.daysFromNow}
            </div>

            <div className={`
                flex-grow p-4 rounded-xl border transition-all
                ${index === 0 ? 'bg-yellow-50/50 border-yellow-200' : 'bg-white border-gray-100'}
            `}>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{pred.label}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-white border border-gray-200 text-gray-600">
                        {pred.phase}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pred.description}</p>
                <div className="flex items-center gap-2 text-xs font-medium text-durian-green bg-green-50 p-2 rounded-lg">
                    <ChefHat size={14} />
                    {pred.recommendation}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RipenessTimeline;