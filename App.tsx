import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import AnalysisResult from './components/AnalysisResult';
import SpectrumChart from './components/SpectrumChart';
import RipenessTimeline from './components/RipenessTimeline';
import { analyzeDurianImage } from './services/geminiService';
import { DurianAnalysis, AnalysisState } from './types';
import { Leaf, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    data: null,
    error: null,
  });

  const handleImageSelected = async (base64: string) => {
    setSelectedImage(base64);
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await analyzeDurianImage(base64);
      setState({
        isLoading: false,
        data: result,
        error: null
      });
    } catch (err: any) {
      setState({
        isLoading: false,
        data: null,
        error: err.message || "An error occurred during analysis."
      });
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setState({ isLoading: false, data: null, error: null });
  };

  return (
    <div className="min-h-screen bg-[#FEF9E7] p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-durian-green p-3 rounded-2xl shadow-lg">
             <Leaf className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Spectro-X</h1>
            <p className="text-gray-500 text-sm">ตรวจวัดความสุกทุเรียน</p>
          </div>
        </div>
        
        {state.data && (
            <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 shadow-sm transition-all"
            >
                <RefreshCcw size={18} />
                <span>วิเคราะห์ใหม่</span>
            </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[400px]">
          <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 mb-4 ml-2">รูปภาพทุเรียน</h2>
            <div className="flex-grow">
                 <ImageUpload 
                    onImageSelected={handleImageSelected} 
                    selectedImage={selectedImage}
                    isLoading={state.isLoading}
                />
            </div>
            {state.error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-2">
                    <span className="font-bold">Error:</span>
                    <span className="text-sm">{state.error}</span>
                </div>
            )}
          </div>
        </div>

        {/* Right Column: Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {state.data ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Ripeness Gauge & Status */}
                    <AnalysisResult data={state.data} />
                    
                    {/* Color Spectrum */}
                    <SpectrumChart data={state.data.spectrumData} />
                </div>

                {/* Prediction Timeline */}
                <RipenessTimeline predictions={state.data.predictions} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
                <div className="opacity-30 mb-4">
                    <Leaf size={64} className="text-durian-green mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-500">รอข้อมูลการวิเคราะห์</h3>
                <p className="text-gray-400 mt-2">กรุณาอัพโหลดรูปภาพทุเรียนเพื่อดูผลลัพธ์ กราฟ Spectrum และการพยากรณ์</p>
                <div className="mt-8 flex gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-durian-green rounded-full"></div>
                        ความสุก
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-durian-yellow rounded-full"></div>
                         สเปกตรัมสี
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-durian-brown rounded-full"></div>
                        พยากรณ์
                    </div>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;