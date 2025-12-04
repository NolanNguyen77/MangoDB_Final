import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Upload, X } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { API_ENDPOINTS } from '../config/api';

interface QRScannerProps {
  onBack: () => void;
}

interface ProductInfo {
  product_name: string;
  current_price: number;
  currency: string;
  variety_name: string;
  origin: string;
  farm_name: string;
  address: string;
  harvest_date: string;
  expiry_date: string;
}

export function QRScanner({ onBack }: QRScannerProps) {
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [scanMode, setScanMode] = useState<'none' | 'camera' | 'upload'>('none');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isScannerRunningRef = useRef(false);

  const mangoImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eMBbu6NO2AId14uNZd6pkSAbmTSzCE.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ck07YNZ1QtIEhVXlJZbaN1MnZi8ZXH.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sGxACEPrYuVctF3CdvCvn5CVbnPtuJ.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-NEKtPwrowsAH2gftJdzVXw1Z72kn0n.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FNIMVuPN0dpIA7nRjZYDGScpSITbcu.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lSevzIyetcu7t6Yr8rFiUa9chhkEew.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VD8tkOdynrvCzMukFpOE149Gt2wgcf.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-m7lrkbPnZZmWqlII0uwL58w5szBmgL.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sDcPUZN2jnx5VegeTnn9cSTP49D8Jd.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-s3o2KnULE9syFqMpkDQoKrXXxeYo7K.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IBqPSqIWGAkixmUaSbGrOjJ0kwPeR6.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YwDOsyAiVwGEM0cY7ONxC4YUGPJbRk.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-qZcHB5IZMuKVlWJMoedI49qU1igL3W.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4YmT5jbvh2gOLBx66DoVQ0ivnTFP4m.png",
  ];

  const scatteredMangos = [
    // Row 1 (top)
    { src: mangoImages[0], top: "3%", left: "8%", size: 75, rotation: 15 },
    { src: mangoImages[1], top: "5%", left: "25%", size: 80, rotation: -20 },
    { src: mangoImages[2], top: "4%", left: "42%", size: 70, rotation: 30 },
    { src: mangoImages[3], top: "6%", left: "58%", size: 85, rotation: -15 },
    { src: mangoImages[4], top: "3%", left: "75%", size: 75, rotation: 25 },
    { src: mangoImages[5], top: "5%", left: "90%", size: 80, rotation: -30 },

    // Row 2
    { src: mangoImages[6], top: "15%", left: "5%", size: 85, rotation: 20 },
    { src: mangoImages[7], top: "17%", left: "20%", size: 70, rotation: -25 },
    { src: mangoImages[8], top: "16%", left: "35%", size: 80, rotation: 35 },
    { src: mangoImages[9], top: "18%", left: "50%", size: 75, rotation: -10 },
    { src: mangoImages[10], top: "15%", left: "65%", size: 85, rotation: 40 },
    { src: mangoImages[11], top: "17%", left: "82%", size: 70, rotation: -35 },
    { src: mangoImages[12], top: "16%", left: "95%", size: 80, rotation: 15 },

    // Row 3
    { src: mangoImages[13], top: "28%", left: "10%", size: 75, rotation: -20 },
    { src: mangoImages[14], top: "30%", left: "28%", size: 85, rotation: 25 },
    { src: mangoImages[0], top: "29%", left: "45%", size: 70, rotation: -40 },
    { src: mangoImages[1], top: "31%", left: "62%", size: 80, rotation: 30 },
    { src: mangoImages[2], top: "28%", left: "78%", size: 75, rotation: -15 },
    { src: mangoImages[3], top: "30%", left: "92%", size: 85, rotation: 20 },

    // Row 4
    { src: mangoImages[4], top: "42%", left: "3%", size: 80, rotation: 35 },
    { src: mangoImages[5], top: "44%", left: "18%", size: 70, rotation: -25 },
    { src: mangoImages[6], top: "43%", left: "33%", size: 85, rotation: 15 },
    { src: mangoImages[7], top: "45%", left: "48%", size: 75, rotation: -30 },
    { src: mangoImages[8], top: "42%", left: "63%", size: 80, rotation: 40 },
    { src: mangoImages[9], top: "44%", left: "80%", size: 70, rotation: -20 },
    { src: mangoImages[10], top: "43%", left: "95%", size: 85, rotation: 25 },

    // Row 5
    { src: mangoImages[11], top: "56%", left: "8%", size: 75, rotation: -35 },
    { src: mangoImages[12], top: "58%", left: "23%", size: 85, rotation: 30 },
    { src: mangoImages[13], top: "57%", left: "40%", size: 70, rotation: -15 },
    { src: mangoImages[14], top: "59%", left: "55%", size: 80, rotation: 20 },
    { src: mangoImages[0], top: "56%", left: "72%", size: 75, rotation: -40 },
    { src: mangoImages[1], top: "58%", left: "88%", size: 85, rotation: 35 },

    // Row 6
    { src: mangoImages[2], top: "70%", left: "5%", size: 80, rotation: 15 },
    { src: mangoImages[3], top: "72%", left: "20%", size: 70, rotation: -30 },
    { src: mangoImages[4], top: "71%", left: "35%", size: 85, rotation: 25 },
    { src: mangoImages[5], top: "73%", left: "50%", size: 75, rotation: -20 },
    { src: mangoImages[6], top: "70%", left: "65%", size: 80, rotation: 40 },
    { src: mangoImages[7], top: "72%", left: "82%", size: 70, rotation: -25 },
    { src: mangoImages[8], top: "71%", left: "95%", size: 85, rotation: 30 },

    // Row 7 (bottom)
    { src: mangoImages[9], top: "84%", left: "10%", size: 75, rotation: -15 },
    { src: mangoImages[10], top: "86%", left: "28%", size: 80, rotation: 35 },
    { src: mangoImages[11], top: "85%", left: "45%", size: 70, rotation: -35 },
    { src: mangoImages[12], top: "87%", left: "62%", size: 85, rotation: 20 },
    { src: mangoImages[13], top: "84%", left: "78%", size: 75, rotation: -40 },
    { src: mangoImages[14], top: "86%", left: "92%", size: 80, rotation: 25 },

    // Additional scattered mangos to fill gaps
    { src: mangoImages[0], top: "10%", left: "50%", size: 65, rotation: -10 },
    { src: mangoImages[1], top: "23%", left: "15%", size: 70, rotation: 45 },
    { src: mangoImages[2], top: "36%", left: "70%", size: 65, rotation: -25 },
    { src: mangoImages[3], top: "50%", left: "12%", size: 70, rotation: 30 },
    { src: mangoImages[4], top: "64%", left: "45%", size: 65, rotation: -35 },
    { src: mangoImages[5], top: "78%", left: "55%", size: 70, rotation: 15 },
    { src: mangoImages[6], top: "92%", left: "35%", size: 75, rotation: -20 },
  ];

  const fetchProductInfo = async (productCode: string) => {
    setStatusMessage('Đã quét thành công. Đang tải dữ liệu...');
    setIsError(false);
    console.log(`Bắt đầu gọi API cho mã: ${productCode}`);

    try {
      const response = await fetch(API_ENDPOINTS.getProductByCode(productCode));
      
      console.log('Trạng thái phản hồi:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Mã QR không hợp lệ');
      }

      const product = await response.json();
      console.log('Dữ liệu nhận được:', product);
      
      setStatusMessage('');
      setProductInfo(product);

    } catch (error) {
      console.error('Đã xảy ra lỗi khi fetch dữ liệu:', error);
      setStatusMessage('Mã QR không hợp lệ. Vui lòng thử lại.');
      setIsError(true);
    }
  };

  const onScanSuccess = (decodedText: string) => {
    if (html5QrCodeRef.current && isScannerRunningRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        console.log("QR Code scanning stopped.");
        isScannerRunningRef.current = false;
      }).catch((err) => {
        console.error("Failed to stop scanning:", err);
      });
    }
    fetchProductInfo(decodedText);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!html5QrCodeRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader-upload");
      html5QrCodeRef.current = html5QrCode;
    }

    try {
      setStatusMessage('Đang xử lý ảnh...');
      setIsError(false);
      const decodedText = await html5QrCodeRef.current.scanFile(file, false);
      fetchProductInfo(decodedText);
    } catch (err) {
      console.error("Error scanning file:", err);
      setStatusMessage("Mã QR không hợp lệ. Vui lòng thử lại.");
      setIsError(true);
    }
  };

  const startCamera = async () => {
    // Stop any existing scanner first
    if (html5QrCodeRef.current && isScannerRunningRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        isScannerRunningRef.current = false;
      } catch (err) {
        console.log("Scanner was not running, continuing...");
      }
    }

    if (!html5QrCodeRef.current) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
    }

    try {
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        undefined
      );
      isScannerRunningRef.current = true;
      setStatusMessage('');
      setIsError(false);
    } catch (err) {
      console.error("Unable to start scanning:", err);
      setStatusMessage("Không thể truy cập camera. Vui lòng cấp quyền camera.");
      setIsError(true);
      isScannerRunningRef.current = false;
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScannerRunningRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        isScannerRunningRef.current = false;
      } catch (err) {
        console.log("Scanner was not running");
      }
    }
    // Reset to initial state
    setScanMode('none');
    setStatusMessage('');
    setIsError(false);
    setProductInfo(null);
  };

  useEffect(() => {
    if (scanMode === 'camera') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [scanMode]);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && isScannerRunningRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          isScannerRunningRef.current = false;
        }).catch((err) => {
          console.log("Scanner cleanup: scanner was not running");
        });
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#FFFCF5] via-[#FFF5E1] to-[#FFEDC9]">
      {/* Scattered mango background */}
      {scatteredMangos.map((mango, index) => (
        <div
          key={index}
          className="absolute pointer-events-none z-0"
          style={{
            top: mango.top,
            left: mango.left,
            transform: `rotate(${mango.rotation}deg)`,
            opacity: 0.15,
          }}
        >
          <ImageWithFallback src={mango.src} alt="" style={{ width: `${mango.size}px`, height: `${mango.size}px` }} />
        </div>
      ))}

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-[#FFB300] p-12">
          <h1 className="text-center text-[36px] text-[#5D4037] mb-8 font-bold">
            Tra cứu thông tin sản phẩm
          </h1>

          {/* Show content only when no product info */}
          {!productInfo && (
            <>
              {/* Camera Scanner - shown right below title when camera mode active */}
              {scanMode === 'camera' && (
                <div className="space-y-4 mb-6">
                  <div 
                    id="qr-reader" 
                    className="rounded-lg overflow-hidden border-4 border-[#FFB300] mb-4"
                    style={{ minHeight: '300px' }}
                  >
                    {/* QR reader will be injected here by the library */}
                  </div>
                  
                  <button
                    onClick={stopCamera}
                    className="w-full bg-red-500 text-white py-3 px-6 rounded-full hover:bg-red-600 transition-colors shadow-md font-bold flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Tắt quét
                  </button>
                </div>
              )}

              {/* Hidden QR Reader for upload mode */}
              <div id="qr-reader-upload" className="hidden"></div>

              {/* Mode Selection Buttons - Only show when camera is not active */}
              {scanMode !== 'camera' && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-6">Chọn phương thức quét mã QR:</p>
                  
                  <button
                    onClick={() => {
                      setScanMode('camera');
                    }}
                    className="w-full bg-[#4CAF50] text-white py-4 px-6 rounded-full hover:bg-green-600 transition-colors shadow-md font-bold flex items-center justify-center gap-3"
                  >
                    <Camera className="w-6 h-6" />
                    1. Sử dụng Camera
                  </button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="w-full bg-[#FF8C42] text-white py-4 px-6 rounded-full hover:bg-orange-600 transition-colors shadow-md font-bold flex items-center justify-center gap-3"
                  >
                    <Upload className="w-6 h-6" />
                    2. Tải ảnh lên
                  </button>
                </div>
              )}
            </>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-lg mb-6 text-center ${isError ? 'bg-red-100 text-red-700 font-bold' : 'bg-green-100 text-green-700 font-bold'}`}>
              {statusMessage}
            </div>
          )}

          {/* Product Info - Replace title and show product details */}
          {productInfo && (
            <div className="space-y-4">
              <h2 className="text-2xl text-center mb-6 font-bold text-[#FF8C42]">Thông tin sản phẩm</h2>
              
              <div className="space-y-3">
                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Tên sản phẩm</p>
                  <p className="text-lg font-bold">{productInfo.product_name}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Giá bán hiện tại</p>
                  <p className="text-lg font-bold">{productInfo.current_price} {productInfo.currency}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Giống</p>
                  <p className="text-lg font-bold">{productInfo.variety_name}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Nguồn gốc</p>
                  <p className="text-lg font-bold">{productInfo.origin}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Nông trại</p>
                  <p className="text-lg font-bold">{productInfo.farm_name} ({productInfo.address})</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Ngày thu hoạch</p>
                  <p className="text-lg font-bold">{new Date(productInfo.harvest_date).toLocaleDateString('vi-VN')}</p>
                </div>

                <div className="border-b border-gray-200 pb-2">
                  <p className="text-sm text-gray-500">Hạn sử dụng</p>
                  <p className="text-lg font-bold">{new Date(productInfo.expiry_date).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setProductInfo(null);
                  setStatusMessage('');
                  setScanMode('none');
                  setIsError(false);
                }}
                className="w-full bg-[#FF8C42] text-white py-4 px-8 rounded-full hover:bg-orange-600 transition-colors shadow-md font-bold mt-6"
              >
                Thoát
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}