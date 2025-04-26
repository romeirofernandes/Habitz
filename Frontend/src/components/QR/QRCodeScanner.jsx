import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const QRCodeScanner = ({ onClose, onSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'image'
  const [imageError, setImageError] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (activeTab !== 'camera') return; // Only initialize camera scanner in camera tab

    let scanner = null;
    // Set a timeout to reset scanning state if camera doesn't initialize properly
    const cameraTimeoutId = setTimeout(() => {
      if (scanning) {
        setScanning(false);
        console.error("Camera initialization timed out");
      }
    }, 5000); // 5 seconds timeout

    const timerId = setTimeout(() => {
      try {
        scanner = new Html5QrcodeScanner('reader', {
          qrbox: { width: 250, height: 250 },
          fps: 10,
        });
        scannerRef.current = scanner;

        // Only set scanning to true after camera is actually accessed
        const onScanSuccess = async (decodedText) => {
          setScanning(false); // Stop scanning after success
          clearTimeout(cameraTimeoutId); // Clear timeout when camera works
          try {
            const qrData = JSON.parse(decodedText);
            await processQRData(qrData);
            if (onSuccess) onSuccess(qrData);
            setTimeout(() => onClose && onClose(), 300);
          } catch (error) {
            toast.error("Invalid QR code or error processing check-in");
            console.error("QR scan error:", error);
          }
        };

        const onScanFailure = (error) => {
          if (error === 'NotFoundException') {
            // No QR code detected, continue scanning without stopping
            console.warn("No QR code detected, continuing...");
            return;
          }
          console.error("QR scan error:", error);
          setScanning(false); // Stop scanning on other errors
        };

        // Use callbacks to properly detect camera initialization
        scanner.render(onScanSuccess, onScanFailure, {
          onRenderSuccess: () => {
            setScanning(true); // Set scanning true only after camera is ready
            clearTimeout(cameraTimeoutId);
          },
          onRenderError: (error) => {
            console.error("Camera render error:", error);
            setScanning(false);
            clearTimeout(cameraTimeoutId);
          }
        });
      } catch (error) {
        console.error("Camera initialization error:", error);
        setScanning(false);
        clearTimeout(cameraTimeoutId);
      }
    }, 100);

    return () => {
      clearTimeout(timerId);
      clearTimeout(cameraTimeoutId);
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [onClose, onSuccess, activeTab]);

  const processQRData = async (qrData) => {
    if (qrData.type === 'habit') {
      await completeHabit(qrData.id);
      toast.success("Habit marked as complete! 🎉");
    } else if (qrData.type === 'challenge') {
      await updateChallengeProgress(qrData.id, qrData.progress || 10);
      toast.success(`Challenge progress updated! +${qrData.progress || 10}%`);
    } else {
      throw new Error("Unknown QR code type");
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    setScanning(true);
    setImageError(null);

    try {
      const file = files[0];

      // Ensure `html5QrCodeRef.current` is properly initialized
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.clear();
      } else {
        html5QrCodeRef.current = new Html5Qrcode("reader-file");
      }

      // Validate image dimensions before scanning
      const image = new Image();
      const fileReader = new FileReader();

      fileReader.onload = () => {
        image.src = fileReader.result;
      };

      image.onload = async () => {
        if (image.width === 0 || image.height === 0) {
          setImageError("Invalid image dimensions. Please upload a valid QR code image.");
          setScanning(false);
          return;
        }

        try {
          // Try scanning the file
          const config = {
            experimentalFeatures: {
              useBarCodeDetectorIfSupported: true,
            },
          };
          const decodedText = await html5QrCodeRef.current.scanFile(file, true, config);
          const qrData = JSON.parse(decodedText);

          await processQRData(qrData);
          if (onSuccess) onSuccess(qrData);
          setTimeout(() => onClose && onClose(), 300);
        } catch (error) {
          console.error("Error scanning image:", error);

          // Handle specific error for QR code detection failure
          if (error.message && error.message.includes("No MultiFormat Readers were able to detect the code")) {
            setImageError("Could not recognize a valid QR code in this image");
          } else {
            setImageError("Could not process the QR code image");
          }
        } finally {
          setScanning(false);

          // Safely clear `html5QrCodeRef.current`
          if (html5QrCodeRef.current) {
            try {
              await html5QrCodeRef.current.clear();
            } catch (clearError) {
              console.warn("Error clearing Html5Qrcode instance:", clearError);
            }
          }
        }
      };

      image.onerror = () => {
        setImageError("Failed to load the image. Please upload a valid QR code image.");
        setScanning(false);
      };

      fileReader.readAsDataURL(file);
    } catch (error) {
      console.error("Unexpected error during file selection:", error);
      setImageError("An unexpected error occurred. Please try again.");
      setScanning(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const completeHabit = async (habitId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/habits/${habitId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Complete habit error:", error);
      throw new Error("Failed to complete habit");
    }
  };

  const updateChallengeProgress = async (challengeId, progress) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");
      
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/challenges/${challengeId}/progress`,
        { 
          progress,
          user: user || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Update challenge error:", error);
      throw new Error("Failed to update challenge progress");
    }
  };

  const handleClose = () => {
    setScanning(false);

    
    // Safely clear `scannerRef.current` if it exists
    if (scannerRef.current) {
      try {
        scannerRef.current.clear().catch(() => {});
      } catch (err) {
        console.warn("Error clearing scannerRef:", err);
      } finally {
        scannerRef.current = null;
      }
    }

    // Safely clear `html5QrCodeRef.current` if it exists
    if (html5QrCodeRef.current) {
      try {
        html5QrCodeRef.current.clear().catch(() => {});
      } catch (err) {
        console.warn("Error clearing html5QrCodeRef:", err);
      } finally {
        html5QrCodeRef.current = null;
      }
    }

    setTimeout(() => onClose && onClose(), 100);
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    
    // Clean up both scanner instances when switching tabs
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.clear().catch(() => {});
      html5QrCodeRef.current = null;
    }
    
    setActiveTab(tab);
    setImageError(null);
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
          <h2 className="text-xl font-bold text-[#f5f5f7]">Scan QR Code</h2>
          <button onClick={handleClose} className="text-[#f5f5f7]/60 hover:text-[#f5f5f7] text-2xl">
            ×
          </button>
        </div>

        <div className="flex border-b border-[#333] mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'camera' ? 'text-[#A2BFFE] border-b-2 border-[#A2BFFE]' : 'text-[#f5f5f7]/60 hover:text-[#f5f5f7]'
            }`}
            onClick={() => switchTab('camera')}
          >
            Camera
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === 'image' ? 'text-[#A2BFFE] border-b-2 border-[#A2BFFE]' : 'text-[#f5f5f7]/60 hover:text-[#f5f5f7]'
            }`}
            onClick={() => switchTab('image')}
          >
            Upload Image
          </button>
        </div>

        {activeTab === 'camera' ? (
          <>
            <p className="text-[#f5f5f7]/60 mb-4 text-sm">
              Position the QR code within the frame to complete habits or update challenges.
            </p>
            <div className="rounded-lg overflow-hidden border-2 border-[#A2BFFE]">
              <div id="reader" className="w-full"></div>
            </div>
            <div className="mt-4 text-center">
              {scanning ? (
                <div className="text-[#A2BFFE] text-sm flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-[#A2BFFE] rounded-full border-t-transparent"></div>
                  Scanning...
                </div>
              ) : (
                <div className="text-[#A2BFFE] text-sm">Ready to scan</div>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-[#f5f5f7]/60 mb-4 text-sm">
              Upload an image containing a QR code to scan.
            </p>
            <div className="rounded-lg overflow-hidden border-2 border-[#A2BFFE] p-6 flex flex-col items-center justify-center min-h-[250px]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <div id="reader-file" className="hidden"></div>
              <motion.button
                onClick={triggerFileInput}
                disabled={scanning}
                className="bg-[#A2BFFE] hover:bg-[#8CABFE] text-black font-medium py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: scanning ? 1 : 1.02 }}
                whileTap={{ scale: scanning ? 1 : 0.98 }}
              >
                {scanning ? 'Processing...' : 'Select Image'}
              </motion.button>
              {imageError && (
                <p className="text-red-400 text-xs mt-3 text-center">
                  {imageError}. Please try another image or use the camera scanner.
                </p>
              )}
            </div>
          </>
        )}

        <motion.button
          onClick={handleClose}
          className="w-full mt-4 flex justify-center items-center gap-2 bg-[#333] hover:bg-[#444] text-[#f5f5f7] py-3 rounded-lg font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancel Scanning
        </motion.button>
      </motion.div>
    </div>
  );
};

export default QRCodeScanner;