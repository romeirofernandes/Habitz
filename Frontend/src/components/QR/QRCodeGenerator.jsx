import React, { useState, useRef } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';

const QRCodeGenerator = ({ type, item, onClose }) => {
  const [qrValue] = useState(() => {
    const data = {
      id: item._id,
      type: type, // 'habit' or 'challenge'
      name: item.name
    };
    
    // For challenges, include progress increment
    if (type === 'challenge') {
      data.progress = 10; // Default increment value
    }
    
    return JSON.stringify(data);
  });
  
  const qrRef = useRef(null);
  
  const downloadQRCode = async () => {
    try {
      const canvas = await html2canvas(qrRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${type}-${item.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('QR code downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download QR code');
      console.error('Download error:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#f5f5f7]">
            {type === 'habit' ? 'Habit QR Code' : 'Challenge QR Code'}
          </h2>
          <button onClick={onClose} className="text-[#f5f5f7]/60 hover:text-[#f5f5f7] text-2xl">
            ×
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <p className="text-[#f5f5f7]/60 mb-4 text-center">
            {type === 'habit' 
              ? 'Scan this QR code to mark this habit as completed for today.' 
              : 'Scan this QR code to add 10% progress to this challenge.'}
          </p>
          
          <div ref={qrRef} className="p-4 bg-white rounded-xl">
            <QRCode 
              value={qrValue} 
              size={200} 
              level="H" 
              imageSettings={{
                src: "/logo.png",
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
            <div className="text-black text-xs font-medium text-center mt-2">
              {item.name}
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={downloadQRCode}
          className="w-full flex justify-center items-center gap-2 bg-[#A2BFFE] hover:bg-[#91AFFE] text-[#080808] py-3 rounded-lg font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </motion.button>
        
        <p className="text-[#f5f5f7]/40 text-xs text-center mt-4">
          Print this QR code and place it where you perform your habit for easy check-ins.
        </p>
      </motion.div>
    </div>
  );
};

export default QRCodeGenerator;