import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { ColorSpectrumItem } from '../types';
import { Activity } from 'lucide-react';

interface SpectrumChartProps {
  data: ColorSpectrumItem[];
}

// Helper to generate Gaussian curve points
// V = Peak * exp(-0.5 * ((x - center) / sigma)^2)
// Assuming FWHM of ~20nm for AS7265x sensors -> Sigma approx 8.5
const SIGMA = 8.5;

const SpectrumChart: React.FC<SpectrumChartProps> = ({ data }) => {
  
  // Transform the 18 discrete points into a high-resolution waveform dataset
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const startWavelength = 350;
    const endWavelength = 1000;
    const step = 5;
    const points = [];

    for (let nm = startWavelength; nm <= endWavelength; nm += step) {
      const point: any = { nm };
      
      // Calculate intensity for each channel at this wavelength
      data.forEach((channel) => {
        const center = parseInt(channel.name.replace(/\D/g, '')) || 0;
        // Normalized intensity (0-1)
        const peak = channel.value / 100; 
        
        // Gaussian function
        const intensity = peak * Math.exp(-0.5 * Math.pow((nm - center) / SIGMA, 2));
        
        // Only store if significant to save memory/processing (optional, but good for cleanliness)
        if (intensity > 0.001) {
            point[channel.name] = intensity;
        } else {
            point[channel.name] = 0;
        }
      });
      points.push(point);
    }
    return points;
  }, [data]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-durian-yellow" />
                Spectral Response Signal
            </h2>
            <p className="text-xs text-gray-400">18-Channel AS7265x Simulation (Normalized)</p>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
            <XAxis 
                dataKey="nm" 
                type="number"
                domain={[350, 980]}
                tickCount={10}
                tick={{ fontSize: 10, fill: '#666' }} 
                label={{ value: 'Wavelength (nm)', position: 'bottom', offset: 0, fontSize: 12, fill: '#999' }}
            />
            <YAxis 
                domain={[0, 1.1]}
                tick={{ fontSize: 10, fill: '#666' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Norm. Responsivity', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#999' }}
            />
            <Tooltip 
                labelFormatter={(value) => `${value} nm`}
                formatter={(value: number) => value.toFixed(3)}
                contentStyle={{ fontSize: '12px' }}
            />
            
            {/* Render a Line for each channel */}
            {data.map((channel) => (
              <Line 
                key={channel.name}
                type="monotone"
                dataKey={channel.name}
                stroke={channel.fill}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
              />
            ))}

            <ReferenceLine y={0} stroke="#000" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpectrumChart;