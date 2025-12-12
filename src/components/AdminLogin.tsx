import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { API_BASE_URL } from '../config/api';


interface AdminLoginProps {
  onBack: () => void;
  onLogin: () => void;
}

export function AdminLogin({ onBack, onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = { username: '', password: '', general: '' };

    // Validate
    if (!username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }
    if (!password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    setErrors(newErrors);

    // If no errors, proceed with login
    if (!newErrors.username && !newErrors.password) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ ...newErrors, general: data.message || 'Đăng nhập thất bại' });
          setIsLoading(false);
          return;
        }

        // Store token in localStorage
        localStorage.setItem('mango_auth_token', data.token);
        localStorage.setItem('mango_user', JSON.stringify(data.user));

        // Success - call onLogin
        setIsLoading(false);
        onLogin();
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ ...newErrors, general: 'Không thể kết nối đến server' });
        setIsLoading(false);
      }
    }
  };

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
        className="absolute top-8 left-8 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow z-20"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header with animated mangos */}
        <div className="flex flex-col items-center justify-center mb-12 px-8 mt-20">
          <div className="flex items-center justify-center gap-6 mb-2">
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ImageWithFallback
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png"
                alt=""
                style={{ width: '100px', height: '100px' }}
              />
            </motion.div>
            <h1 className="text-[72px] text-center text-[#FF8F00] drop-shadow-2xl whitespace-nowrap leading-none font-bold">
              Mango Management
            </h1>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <ImageWithFallback
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png"
                alt=""
                style={{ width: '100px', height: '100px', transform: 'scaleX(-1)' }}
              />
            </motion.div>
          </div>
        </div>

        {/* Login Card */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md shadow-2xl border-4 border-[#FF8F00] bg-white rounded-3xl"
          >
            <div className="p-12">
              <h2 className="text-center text-[36px] text-[#5D4037] mb-8 font-bold">Đăng nhập</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-[20px] text-[#5D4037] block font-bold">
                    User name
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) setErrors({ ...errors, username: '' });
                    }}
                    placeholder="Nhập tên đăng nhập"
                    className={`w-full px-6 py-4 bg-[#FFF3E0] border-2 ${errors.username ? 'border-red-500' : 'border-[#FFB800]'} focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00] rounded-xl focus:outline-none h-14 text-lg`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-[20px] text-[#5D4037] block font-bold">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      placeholder="Nhập mật khẩu"
                      className={`w-full px-6 py-4 bg-[#FFF3E0] border-2 ${errors.password ? 'border-red-500' : 'border-[#FFB800]'} focus:border-[#FF8F00] focus:ring-2 focus:ring-[#FF8F00] rounded-xl focus:outline-none h-14 text-lg pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF8F00] hover:text-[#F57C00] transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FFB800] to-[#FF8F00] text-white hover:from-[#FF8F00] hover:to-[#F57C00] border-2 border-[#FF8F00] h-16 text-xl shadow-xl hover:shadow-2xl transition-all rounded-full font-bold"
                >
                  {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                </button>
                {errors.general && (
                  <p className="text-red-500 text-sm mt-1 text-center">{errors.general}</p>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}