import { QrCode, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onSelectGuest: () => void;
  onSelectAdmin: () => void;
}

export function LandingPage({ onSelectGuest, onSelectAdmin }: LandingPageProps) {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[#FFFCF5] via-[#FFF5E1] to-[#FFEDC9]">
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

      {/* Header with animated mangos */}
      <div className="relative mb-16 z-10">
        <motion.div
          className="absolute -left-28 top-0"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ImageWithFallback
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png"
            alt=""
            style={{ width: '100px', height: '100px' }}
          />
        </motion.div>
        
        <h1 className="text-[72px] text-[#FF8C42] text-center leading-none font-bold">
          Mango Management
        </h1>
        
        <motion.div
          className="absolute -right-28 top-0"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <ImageWithFallback
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png"
            alt=""
            style={{ width: '100px', height: '100px', transform: 'scaleX(-1)' }}
          />
        </motion.div>
      </div>

      {/* Two Cards */}
      <div className="flex flex-col md:flex-row gap-12 items-center justify-center max-w-5xl w-full z-10">
        {/* Guest Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-[#4CAF50] p-12 w-full md:w-96 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <QrCode className="w-10 h-10 text-[#4CAF50]" />
          </div>
          <h2 className="text-2xl mb-3 font-bold">Kiểm tra sản phẩm</h2>
          <p className="text-gray-600 mb-8">Quét mã để xem nguồn gốc.</p>
          <button
            onClick={onSelectGuest}
            className="bg-[#4CAF50] text-white px-10 py-4 rounded-full hover:bg-green-600 transition-colors font-bold"
          >
            QUÉT NGAY
          </button>
        </motion.div>

        {/* Admin Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-[#FF8C42] p-12 w-full md:w-96 flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <UserCircle className="w-10 h-10 text-[#FF8C42]" />
          </div>
          <h2 className="text-2xl mb-3 font-bold">Quản trị viên</h2>
          <p className="text-gray-600 mb-8">Đăng nhập hệ thống.</p>
          <button
            onClick={onSelectAdmin}
            className="bg-[#FF8C42] text-white px-10 py-4 rounded-full hover:bg-orange-600 transition-colors font-bold"
          >
            ĐĂNG NHẬP
          </button>
        </motion.div>
      </div>
    </div>
  );
}
