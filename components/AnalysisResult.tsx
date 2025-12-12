import React from 'react';
import { DurianAnalysis } from '../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalysisResultProps {
  data: DurianAnalysis;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const getStatusColor = (percentage: number) => {
    if (percentage < 30) return 'text-red-500 border-red-500'; // Raw
    if (percentage < 85) return 'text-durian-green border-durian-green'; // Ripe
    return 'text-amber-700 border-amber-700'; // Overripe
  };

  const getStatusBg = (percentage: number) => {
      if (percentage < 30) return 'bg-red-50';
      if (percentage < 85) return 'bg-green-50';
      return 'bg-amber-50';
  }

  const statusColor = getStatusColor(data.ripenessPercentage);
  const statusBg = getStatusBg(data.ripenessPercentage);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <CheckCircle2 className="text-durian-green" />
        ผลการวิเคราะห์
      </h2>

      <div className="flex flex-col items-center justify-center flex-grow py-4">
        <div className={`relative w-40 h-40 rounded-full border-8 ${statusColor} flex items-center justify-center mb-6 shadow-sm`}>
          <div className="text-center">
            <span className={`text-4xl font-bold ${statusColor.split(' ')[0]}`}>
              {data.ripenessPercentage}%
            </span>
            <p className="text-xs text-gray-400 mt-1">ความสุก</p>
          </div>
        </div>

        <div className={`px-6 py-2 rounded-full ${statusBg} border ${statusColor.split(' ')[1].replace('text', 'border')} mb-4`}>
          <p className={`text-xl font-bold ${statusColor.split(' ')[0]}`}>
            {data.status}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl w-full text-center">
             <p className="text-gray-600 leading-relaxed text-sm">
                "{data.textureDescription}"
             </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;