import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
  isLoading: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, selectedImage, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        onClick={triggerFileInput}
        className={`
          relative w-full flex-grow min-h-[300px] rounded-2xl border-4 border-dashed transition-all cursor-pointer overflow-hidden group
          ${selectedImage ? 'border-durian-green/30 bg-black/5' : 'border-durian-green/40 hover:border-durian-green/70 hover:bg-durian-green/5'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt="Durian Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-durian-green/60">
            <Upload size={64} className="mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-xl font-medium">คลิกเพื่ออัพโหลดรูปทุเรียน</p>
            <p className="text-sm mt-2 opacity-70">รองรับไฟล์ JPG, PNG</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-durian-yellow border-white mb-4"></div>
            <p className="text-xl font-medium animate-pulse">กำลังวิเคราะห์ข้อมูล...</p>
          </div>
        )}
        
        {selectedImage && !isLoading && (
            <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                <ImageIcon size={24} className="text-gray-700"/>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;