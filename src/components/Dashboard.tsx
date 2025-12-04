import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Edit2, Trash2, Printer, X, Upload, Plus } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  originalPrice: number;
  sellPrice: number;
  farm: string;
  origin: string;
  energy: string;
  harvestDate: string;
  expiryDate: string;
}

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
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

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Xoài Cát Hòa Lộc',
      category: 'Trái cây',
      image: 'https://images.unsplash.com/photo-1669207334420-66d0e3450283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZydWl0fGVufDF8fHx8MTc2NDIxNjgyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      originalPrice: 80000,
      sellPrice: 100000,
      farm: 'Nông trại Xanh',
      origin: 'Tân Triều, Tiền Giang',
      energy: '60 kcal',
      harvestDate: '2025-11-25',
      expiryDate: '2025-12-10',
    }
  ]);

  const [showQRModal, setShowQRModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Trái cây',
    image: '',
    originalPrice: '',
    sellPrice: '',
    farm: '',
    origin: '',
    energy: '',
    harvestDate: '',
    expiryDate: '',
  });

  const handleAddProduct = () => {
    if (!formData.name || !formData.sellPrice) {
      alert('Vui lòng điền tên sản phẩm và giá bán');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1669207334420-66d0e3450283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGZydWl0fGVufDF8fHx8MTc2NDIxNjgyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
      originalPrice: Number(formData.originalPrice) || 0,
      sellPrice: Number(formData.sellPrice),
      farm: formData.farm,
      origin: formData.origin,
      energy: formData.energy,
      harvestDate: formData.harvestDate,
      expiryDate: formData.expiryDate,
    };

    setProducts([...products, newProduct]);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Trái cây',
      image: '',
      originalPrice: '',
      sellPrice: '',
      farm: '',
      origin: '',
      energy: '',
      harvestDate: '',
      expiryDate: '',
    });
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      originalPrice: product.originalPrice.toString(),
      sellPrice: product.sellPrice.toString(),
      farm: product.farm,
      origin: product.origin,
      energy: product.energy,
      harvestDate: product.harvestDate,
      expiryDate: product.expiryDate,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id
        ? {
            ...p,
            name: formData.name,
            category: formData.category,
            image: formData.image || p.image,
            originalPrice: Number(formData.originalPrice) || 0,
            sellPrice: Number(formData.sellPrice),
            farm: formData.farm,
            origin: formData.origin,
            energy: formData.energy,
            harvestDate: formData.harvestDate,
            expiryDate: formData.expiryDate,
          }
        : p
    );

    setProducts(updatedProducts);
    setShowEditModal(false);
    setSelectedProduct(null);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Trái cây',
      image: '',
      originalPrice: '',
      sellPrice: '',
      farm: '',
      origin: '',
      energy: '',
      harvestDate: '',
      expiryDate: '',
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handlePrintQR = (product: Product) => {
    setSelectedProduct(product);
    setShowQRModal(true);
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-gradient-to-br from-[#FFFCF5] via-[#FFF5E1] to-[#FFEDC9]">
      {/* Scattered mango background */}
      {scatteredMangos.map((mango, index) => (
        <div
          key={index}
          className="fixed pointer-events-none z-0"
          style={{
            top: mango.top,
            left: mango.left,
            transform: `rotate(${mango.rotation}deg)`,
            opacity: 0.12,
          }}
        >
          <ImageWithFallback src={mango.src} alt="" style={{ width: `${mango.size}px`, height: `${mango.size}px` }} />
        </div>
      ))}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-p38ezG4FiFQqOlt5lnyvscwcFuKkWm.png"
            alt=""
            style={{ width: '80px', height: '80px' }}
          />
          <h1 className="text-[72px] text-[#FF8C42] leading-none font-bold">Mango Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FFB300] rounded-full flex items-center justify-center text-white">
              A
            </div>
            <span>Admin</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-12 mb-8 relative z-10">
        <h2 className="text-2xl mb-8 text-[#FFB300] font-bold">Thêm sản phẩm mới</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm mb-2">Tên sản phẩm *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Loại</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
            >
              <option>Trái cây</option>
              <option>Rau củ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Hình ảnh</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                placeholder="URL hình ảnh..."
              />
              <button className="bg-gray-100 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Giá gốc (VNĐ)</label>
            <input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Giá bán (VNĐ) *</label>
            <input
              type="number"
              value={formData.sellPrice}
              onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Nông trại</label>
            <input
              type="text"
              value={formData.farm}
              onChange={(e) => setFormData({...formData, farm: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="Tên nông trại..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Nguồn gốc</label>
            <input
              type="text"
              value={formData.origin}
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="Địa chỉ nguồn gốc..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Năng lượng</label>
            <input
              type="text"
              value={formData.energy}
              onChange={(e) => setFormData({...formData, energy: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
              placeholder="VD: 60 kcal"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Ngày thu hoạch</label>
            <input
              type="date"
              value={formData.harvestDate}
              onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Hạn sử dụng</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-[#4CAF50] text-white px-8 py-4 rounded-full hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-lg p-8 relative z-10">
        <h2 className="text-2xl mb-6 text-[#FFB300] font-bold">Danh sách sản phẩm</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">Chưa có dữ liệu. Nhấn Thêm để tạo mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFF9E6] border-b-2 border-[#FFB300]">
                  <th className="px-6 py-4 text-left">Hình ảnh</th>
                  <th className="px-6 py-4 text-left">Tên sản phẩm</th>
                  <th className="px-6 py-4 text-left">Loại</th>
                  <th className="px-6 py-4 text-left">Giá bán</th>
                  <th className="px-6 py-4 text-left">Nông trại</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 text-[#FF8C42]">
                      {product.sellPrice.toLocaleString()} VNĐ
                    </td>
                    <td className="px-6 py-4">{product.farm || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-[#FFB300] p-2 rounded-lg hover:bg-[#FF8C42] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={() => handlePrintQR(product)}
                          className="bg-[#4CAF50] p-2 rounded-lg hover:bg-green-600 transition-colors"
                          title="In QR"
                        >
                          <Printer className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-12 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl text-[#FF8C42]">Mã QR sản phẩm</h3>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white p-6 border-4 border-[#FFB300] rounded-2xl mb-6">
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                    <svg viewBox="0 0 256 256" className="w-full h-full">
                      <rect fill="#FFFFFF" x="0" y="0" width="256" height="256"/>
                      <path fill="#000000" d="M16,16h48v48h-48zM72,16h16v16h-16zM104,16h16v16h-16zM136,16h16v16h-16zM192,16h48v48h-48zM16,72h16v16h-16zM56,72h16v16h-16zM88,72h16v16h-16zM120,72h16v16h-16zM152,72h16v16h-16zM184,72h16v16h-16zM224,72h16v16h-16zM16,104h16v16h-16zM48,104h16v16h-16zM88,104h16v16h-16zM136,104h16v16h-16zM168,104h16v16h-16zM200,104h16v16h-16zM16,136h16v16h-16zM56,136h16v16h-16zM88,136h16v16h-16zM120,136h16v16h-16zM152,136h16v16h-16zM184,136h16v16h-16zM224,136h16v16h-16zM16,192h48v48h-48zM88,192h16v16h-16zM120,192h16v16h-16zM152,192h16v16h-16zM192,192h48v48h-48z"/>
                    </svg>
                  </div>
                </div>

                <p className="text-center mb-6 text-gray-700">{selectedProduct.name}</p>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => alert('Tính năng lưu QR sẽ được phát triển')}
                    className="flex-1 bg-[#4CAF50] text-white py-4 rounded-full hover:bg-green-600 transition-colors"
                  >
                    Lưu QR
                  </button>
                  <button
                    onClick={() => setShowQRModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-full hover:bg-gray-400 transition-colors"
                  >
                    Thoát
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl p-12 max-w-3xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl text-[#FF8C42]">Chỉnh sửa sản phẩm</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm mb-2">Tên sản phẩm *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Loại</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  >
                    <option>Trái cây</option>
                    <option>Rau củ</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Hình ảnh</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                    placeholder="URL hình ảnh..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Giá gốc (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Nông trại</label>
                  <input
                    type="text"
                    value={formData.farm}
                    onChange={(e) => setFormData({...formData, farm: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Nguồn gốc</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({...formData, origin: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Năng lượng</label>
                  <input
                    type="text"
                    value={formData.energy}
                    onChange={(e) => setFormData({...formData, energy: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ngày thu hoạch</label>
                  <input
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Hạn sử dụng</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFB300] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateProduct}
                  className="flex-1 bg-[#FFB300] text-white py-4 rounded-full hover:bg-[#FF8C42] transition-colors"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-full hover:bg-gray-400 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
