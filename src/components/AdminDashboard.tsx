import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Edit2, Trash2, Plus, X, Search, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { API_ENDPOINTS, api, Product, Variety, Farm, Batch, QRCode, PriceHistory } from '../config/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'products' | 'varieties' | 'farms' | 'batches' | 'qrcodes' | 'prices';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('qrcodes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [varieties, setVarieties] = useState<Variety[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [prices, setPrices] = useState<PriceHistory[]>([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mango background
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
    { src: mangoImages[0], top: "3%", left: "8%", size: 75, rotation: 15 },
    { src: mangoImages[1], top: "5%", left: "25%", size: 80, rotation: -20 },
    { src: mangoImages[2], top: "4%", left: "42%", size: 70, rotation: 30 },
    { src: mangoImages[3], top: "6%", left: "58%", size: 85, rotation: -15 },
    { src: mangoImages[4], top: "3%", left: "75%", size: 75, rotation: 25 },
    { src: mangoImages[5], top: "5%", left: "90%", size: 80, rotation: -30 },
    { src: mangoImages[6], top: "15%", left: "5%", size: 85, rotation: 20 },
    { src: mangoImages[7], top: "17%", left: "20%", size: 70, rotation: -25 },
    { src: mangoImages[8], top: "16%", left: "35%", size: 80, rotation: 35 },
    { src: mangoImages[9], top: "18%", left: "50%", size: 75, rotation: -10 },
    { src: mangoImages[0], top: "15%", left: "65%", size: 85, rotation: 40 },
    { src: mangoImages[1], top: "17%", left: "82%", size: 70, rotation: -35 },
    { src: mangoImages[2], top: "28%", left: "10%", size: 75, rotation: -20 },
    { src: mangoImages[3], top: "30%", left: "28%", size: 85, rotation: 25 },
    { src: mangoImages[4], top: "29%", left: "45%", size: 70, rotation: -40 },
    { src: mangoImages[5], top: "31%", left: "62%", size: 80, rotation: 30 },
    { src: mangoImages[6], top: "28%", left: "78%", size: 75, rotation: -15 },
    { src: mangoImages[7], top: "42%", left: "3%", size: 80, rotation: 35 },
    { src: mangoImages[8], top: "44%", left: "18%", size: 70, rotation: -25 },
    { src: mangoImages[9], top: "43%", left: "33%", size: 85, rotation: 15 },
    { src: mangoImages[0], top: "45%", left: "48%", size: 75, rotation: -30 },
    { src: mangoImages[1], top: "42%", left: "63%", size: 80, rotation: 40 },
    { src: mangoImages[2], top: "44%", left: "80%", size: 70, rotation: -20 },
    { src: mangoImages[3], top: "56%", left: "8%", size: 75, rotation: -35 },
    { src: mangoImages[4], top: "58%", left: "23%", size: 85, rotation: 30 },
    { src: mangoImages[5], top: "57%", left: "40%", size: 70, rotation: -15 },
    { src: mangoImages[6], top: "59%", left: "55%", size: 80, rotation: 20 },
    { src: mangoImages[7], top: "56%", left: "72%", size: 75, rotation: -40 },
    { src: mangoImages[8], top: "70%", left: "5%", size: 80, rotation: 15 },
    { src: mangoImages[9], top: "72%", left: "20%", size: 70, rotation: -30 },
    { src: mangoImages[0], top: "71%", left: "35%", size: 85, rotation: 25 },
    { src: mangoImages[1], top: "73%", left: "50%", size: 75, rotation: -20 },
    { src: mangoImages[2], top: "70%", left: "65%", size: 80, rotation: 40 },
    { src: mangoImages[3], top: "72%", left: "82%", size: 70, rotation: -25 },
    { src: mangoImages[4], top: "84%", left: "10%", size: 75, rotation: -15 },
    { src: mangoImages[5], top: "86%", left: "28%", size: 80, rotation: 35 },
    { src: mangoImages[6], top: "85%", left: "45%", size: 70, rotation: -35 },
    { src: mangoImages[7], top: "87%", left: "62%", size: 85, rotation: 20 },
    { src: mangoImages[8], top: "84%", left: "78%", size: 75, rotation: -40 },
  ];

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'products':
          const productsData = await api.get<Product[]>(API_ENDPOINTS.products);
          setProducts(productsData);
          break;
        case 'varieties':
          const varietiesData = await api.get<Variety[]>(API_ENDPOINTS.varieties);
          setVarieties(varietiesData);
          break;
        case 'farms':
          const farmsData = await api.get<Farm[]>(API_ENDPOINTS.farms);
          setFarms(farmsData);
          break;
        case 'batches':
          const batchesData = await api.get<Batch[]>(API_ENDPOINTS.batches);
          setBatches(batchesData);
          break;
        case 'qrcodes':
          const qrcodesData = await api.get<QRCode[]>(API_ENDPOINTS.qrcodes);
          setQrcodes(qrcodesData);
          break;
        case 'prices':
          const pricesData = await api.get<PriceHistory[]>(API_ENDPOINTS.prices);
          setPrices(pricesData);
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (item: any) => {
    try {
      let endpoint = '';
      let id = 0;

      switch (activeTab) {
        case 'products':
          endpoint = API_ENDPOINTS.product(item.product_id);
          id = item.product_id;
          break;
        case 'varieties':
          endpoint = API_ENDPOINTS.variety(item.variety_id);
          id = item.variety_id;
          break;
        case 'farms':
          endpoint = API_ENDPOINTS.farm(item.farm_id);
          id = item.farm_id;
          break;
        case 'batches':
          endpoint = API_ENDPOINTS.batch(item.batch_id);
          id = item.batch_id;
          break;
        case 'qrcodes':
          endpoint = API_ENDPOINTS.qrcode(item.qr_id);
          id = item.qr_id;
          break;
        case 'prices':
          endpoint = API_ENDPOINTS.price(item.price_id);
          id = item.price_id;
          break;
      }

      await api.delete(endpoint);
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      // Hiển thị error modal thay vì browser alert
      if (err.message.includes('violates foreign key') || err.message.includes('Lỗi server')) {
        setErrorMessage('Không thể xóa vì còn dữ liệu liên quan!\n\nVui lòng xóa các mục phụ thuộc trước (VD: Xóa lô hàng trước khi xóa giống xoài).');
      } else {
        setErrorMessage('Lỗi khi xóa: ' + err.message);
      }
      setDeleteConfirm(null);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingItem) {
        // Update
        let endpoint = '';
        switch (activeTab) {
          case 'products':
            endpoint = API_ENDPOINTS.product(editingItem.product_id);
            break;
          case 'varieties':
            endpoint = API_ENDPOINTS.variety(editingItem.variety_id);
            break;
          case 'farms':
            endpoint = API_ENDPOINTS.farm(editingItem.farm_id);
            break;
          case 'batches':
            endpoint = API_ENDPOINTS.batch(editingItem.batch_id);
            break;
          case 'qrcodes':
            endpoint = API_ENDPOINTS.qrcode(editingItem.qr_id);
            break;
          case 'prices':
            endpoint = API_ENDPOINTS.price(editingItem.price_id);
            break;
        }
        await api.put(endpoint, formData);
      } else {
        // Create
        let endpoint = '';
        switch (activeTab) {
          case 'products':
            endpoint = API_ENDPOINTS.products;
            break;
          case 'varieties':
            endpoint = API_ENDPOINTS.varieties;
            break;
          case 'farms':
            endpoint = API_ENDPOINTS.farms;
            break;
          case 'batches':
            endpoint = API_ENDPOINTS.batches;
            break;
          case 'qrcodes':
            endpoint = API_ENDPOINTS.qrcodes;
            break;
          case 'prices':
            endpoint = API_ENDPOINTS.prices;
            break;
        }
        await api.post(endpoint, formData);
      }
      setShowModal(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      setErrorMessage('Lỗi khi lưu: ' + err.message);
    }
  };

  const tabs = [
    { id: 'qrcodes' as TabType, label: 'Mã QR', icon: '📱' },
    { id: 'batches' as TabType, label: 'Lô hàng', icon: '📦' },
    { id: 'varieties' as TabType, label: 'Giống xoài', icon: '🥭' },
    { id: 'farms' as TabType, label: 'Nông trại', icon: '🌾' },
    { id: 'products' as TabType, label: 'Sản phẩm', icon: '🛒' },
    { id: 'prices' as TabType, label: 'Giá', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFCF5] via-[#FFF5E1] to-[#FFEDC9] relative overflow-hidden">
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

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-md border-b-4 border-[#FFB300]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl text-[#FF8C42] font-bold">🥭 Quản lý Mango</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors font-bold"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-t-lg font-bold whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'bg-[#FFB300] text-white'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#FFB300] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-bold"
            >
              <Plus className="w-5 h-5" />
              Thêm mới
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-[#FFB300] p-6 min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <RefreshCw className="w-16 h-16 text-[#FFB300] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-bold">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'qrcodes' && <QRCodesTable data={qrcodes} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
              {activeTab === 'batches' && <BatchesTable data={batches} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
              {activeTab === 'varieties' && <VarietiesTable data={varieties} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
              {activeTab === 'farms' && <FarmsTable data={farms} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
              {activeTab === 'products' && <ProductsTable data={products} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
              {activeTab === 'prices' && <PricesTable data={prices} searchTerm={searchTerm} onEdit={handleEdit} onDelete={setDeleteConfirm} />}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal
            activeTab={activeTab}
            editingItem={editingItem}
            onClose={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            onSave={handleSave}
            products={products}
            varieties={varieties}
            farms={farms}
            batches={batches}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border-4 border-red-500 p-8 max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-red-600 mb-4">⚠️ Xác nhận xóa</h3>
              <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-bold"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setErrorMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border-4 border-red-500 p-8 max-w-md w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🚫</span>
                </div>
                <h3 className="text-2xl font-bold text-red-600">Không thể thực hiện</h3>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-gray-700 whitespace-pre-line">{errorMessage}</p>
              </div>
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>💡 Gợi ý:</strong> Kiểm tra các tab khác để xóa dữ liệu phụ thuộc trước.
                </p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
              >
                Đã hiểu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== TABLES ====================

function QRCodesTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: QRCode) =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variety_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.farm_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Mã QR</th>
            <th className="px-4 py-3 text-left font-bold">Giống</th>
            <th className="px-4 py-3 text-left font-bold">Nông trại</th>
            <th className="px-4 py-3 text-left font-bold">Ngày thu hoạch</th>
            <th className="px-4 py-3 text-left font-bold">Trạng thái</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: QRCode) => (
            <tr key={item.qr_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.qr_id}</td>
              <td className="px-4 py-3 font-bold">{item.code}</td>
              <td className="px-4 py-3">{item.variety_name}</td>
              <td className="px-4 py-3">{item.farm_name}</td>
              <td className="px-4 py-3">{item.harvest_date ? new Date(item.harvest_date).toLocaleDateString('vi-VN') : '-'}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.status === 'active' ? 'bg-green-200 text-green-800' :
                  item.status === 'used' ? 'bg-gray-200 text-gray-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

function BatchesTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: Batch) =>
    item.variety_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.farm_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Giống</th>
            <th className="px-4 py-3 text-left font-bold">Nông trại</th>
            <th className="px-4 py-3 text-left font-bold">Thu hoạch</th>
            <th className="px-4 py-3 text-left font-bold">Hạn SD</th>
            <th className="px-4 py-3 text-left font-bold">Cấp</th>
            <th className="px-4 py-3 text-left font-bold">Size</th>
            <th className="px-4 py-3 text-left font-bold">Độ chín</th>
            <th className="px-4 py-3 text-left font-bold">Khối lượng (kg)</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: Batch) => (
            <tr key={item.batch_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.batch_id}</td>
              <td className="px-4 py-3 font-bold">{item.variety_name}</td>
              <td className="px-4 py-3">{item.farm_name}</td>
              <td className="px-4 py-3">{new Date(item.harvest_date).toLocaleDateString('vi-VN')}</td>
              <td className="px-4 py-3">{new Date(item.expiry_date).toLocaleDateString('vi-VN')}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded font-bold">{item.grade}</span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded font-bold">{item.size}</span>
              </td>
              <td className="px-4 py-3">{item.ripeness}</td>
              <td className="px-4 py-3">{item.weight_kg}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

function VarietiesTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: Variety) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Tên giống</th>
            <th className="px-4 py-3 text-left font-bold">Sản phẩm</th>
            <th className="px-4 py-3 text-left font-bold">Loại hột</th>
            <th className="px-4 py-3 text-left font-bold">Màu sắc</th>
            <th className="px-4 py-3 text-left font-bold">Brix</th>
            <th className="px-4 py-3 text-left font-bold">Nguồn gốc</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: Variety) => (
            <tr key={item.variety_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.variety_id}</td>
              <td className="px-4 py-3 font-bold">{item.name}</td>
              <td className="px-4 py-3">{item.product_name}</td>
              <td className="px-4 py-3">{item.seed_type}</td>
              <td className="px-4 py-3">{item.color}</td>
              <td className="px-4 py-3">{item.brix_from} - {item.brix_to}</td>
              <td className="px-4 py-3">{item.origin}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

function FarmsTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: Farm) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Tên nông trại</th>
            <th className="px-4 py-3 text-left font-bold">Địa chỉ</th>
            <th className="px-4 py-3 text-left font-bold">Điện thoại</th>
            <th className="px-4 py-3 text-left font-bold">Website</th>
            <th className="px-4 py-3 text-left font-bold">Chứng nhận</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: Farm) => (
            <tr key={item.farm_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.farm_id}</td>
              <td className="px-4 py-3 font-bold">{item.name}</td>
              <td className="px-4 py-3">{item.address}</td>
              <td className="px-4 py-3">{item.phone}</td>
              <td className="px-4 py-3">{item.website}</td>
              <td className="px-4 py-3">{item.certification}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

function ProductsTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: Product) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Tên sản phẩm</th>
            <th className="px-4 py-3 text-left font-bold">Danh mục</th>
            <th className="px-4 py-3 text-left font-bold">Mô tả</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: Product) => (
            <tr key={item.product_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.product_id}</td>
              <td className="px-4 py-3 font-bold">{item.name}</td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">{item.description}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

function PricesTable({ data, searchTerm, onEdit, onDelete }: any) {
  const filtered = data.filter((item: PriceHistory) =>
    item.variety_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.price_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#FFB300]/20 border-b-2 border-[#FFB300]">
            <th className="px-4 py-3 text-left font-bold">ID</th>
            <th className="px-4 py-3 text-left font-bold">Giống</th>
            <th className="px-4 py-3 text-left font-bold">Loại giá</th>
            <th className="px-4 py-3 text-left font-bold">Số tiền</th>
            <th className="px-4 py-3 text-left font-bold">Tiền tệ</th>
            <th className="px-4 py-3 text-left font-bold">Từ ngày</th>
            <th className="px-4 py-3 text-left font-bold">Đến ngày</th>
            <th className="px-4 py-3 text-center font-bold">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item: PriceHistory) => (
            <tr key={item.price_id} className="border-b border-gray-200 hover:bg-[#FFB300]/10">
              <td className="px-4 py-3">{item.price_id}</td>
              <td className="px-4 py-3 font-bold">{item.variety_name}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded font-bold ${item.price_type === 'selling' ? 'bg-green-200 text-green-800' :
                  item.price_type === 'original' ? 'bg-blue-200 text-blue-800' :
                    'bg-orange-200 text-orange-800'
                  }`}>
                  {item.price_type}
                </span>
              </td>
              <td className="px-4 py-3 font-bold">{item.amount.toLocaleString()}</td>
              <td className="px-4 py-3">{item.currency}</td>
              <td className="px-4 py-3">{new Date(item.valid_from).toLocaleDateString('vi-VN')}</td>
              <td className="px-4 py-3">{item.valid_to ? new Date(item.valid_to).toLocaleDateString('vi-VN') : '-'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button onClick={() => onEdit(item)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(item)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">Không tìm thấy dữ liệu</div>
      )}
    </div>
  );
}

// ==================== MODAL ====================

function Modal({ activeTab, editingItem, onClose, onSave, products, varieties, farms, batches }: any) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      // Default values for new items
      switch (activeTab) {
        case 'products':
          setFormData({ name: '', category: 'fruit', description: '' });
          break;
        case 'varieties':
          setFormData({ product_id: products[0]?.product_id || 1, name: '', seed_type: 'có hột', color: '', brix_from: 0, brix_to: 0, origin: '' });
          break;
        case 'farms':
          setFormData({ name: '', address: '', phone: '', website: '', certification: '' });
          break;
        case 'batches':
          setFormData({
            variety_id: varieties[0]?.variety_id || 1,
            farm_id: farms[0]?.farm_id || 1,
            harvest_date: new Date().toISOString().split('T')[0],
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            grade: 'A',
            size: 'M',
            ripeness: 'chín',
            postharvest_treatment: '',
            weight_kg: 0
          });
          break;
        case 'qrcodes':
          setFormData({ batch_id: batches[0]?.batch_id || 1, code: '', status: 'active' });
          break;
        case 'prices':
          setFormData({
            variety_id: varieties[0]?.variety_id || 1,
            price_type: 'selling',
            currency: 'VND',
            amount: 0,
            valid_from: new Date().toISOString().split('T')[0],
            valid_to: ''
          });
          break;
      }
    }
  }, [editingItem, activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl border-4 border-[#FFB300] p-8 max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FF8C42]">
            {editingItem ? '✏️ Chỉnh sửa' : '➕ Thêm mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'products' && (
            <>
              <div>
                <label className="block font-bold mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Danh mục *</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Mô tả</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  rows={3}
                />
              </div>
            </>
          )}

          {activeTab === 'varieties' && (
            <>
              <div>
                <label className="block font-bold mb-2">Sản phẩm *</label>
                <select
                  value={formData.product_id || ''}
                  onChange={(e) => handleChange('product_id', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                >
                  {products.map((p: Product) => (
                    <option key={p.product_id} value={p.product_id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">Tên giống *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Loại hột *</label>
                <select
                  value={formData.seed_type || ''}
                  onChange={(e) => handleChange('seed_type', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                >
                  <option value="có hột">Có hột</option>
                  <option value="ít hột">Ít hột</option>
                  <option value="không hột">Không hột</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">Màu sắc</label>
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Brix từ</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.brix_from || ''}
                    onChange={(e) => handleChange('brix_from', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Brix đến</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.brix_to || ''}
                    onChange={(e) => handleChange('brix_to', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2">Nguồn gốc</label>
                <input
                  type="text"
                  value={formData.origin || ''}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
            </>
          )}

          {activeTab === 'farms' && (
            <>
              <div>
                <label className="block font-bold mb-2">Tên nông trại *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Điện thoại</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Website</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Chứng nhận</label>
                <input
                  type="text"
                  value={formData.certification || ''}
                  onChange={(e) => handleChange('certification', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
            </>
          )}

          {activeTab === 'batches' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Giống *</label>
                  <select
                    value={formData.variety_id || ''}
                    onChange={(e) => handleChange('variety_id', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    {varieties.map((v: Variety) => (
                      <option key={v.variety_id} value={v.variety_id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">Nông trại *</label>
                  <select
                    value={formData.farm_id || ''}
                    onChange={(e) => handleChange('farm_id', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    {farms.map((f: Farm) => (
                      <option key={f.farm_id} value={f.farm_id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Ngày thu hoạch *</label>
                  <input
                    type="date"
                    value={formData.harvest_date?.split('T')[0] || ''}
                    onChange={(e) => handleChange('harvest_date', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Hạn sử dụng *</label>
                  <input
                    type="date"
                    value={formData.expiry_date?.split('T')[0] || ''}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-2">Cấp *</label>
                  <select
                    value={formData.grade || ''}
                    onChange={(e) => handleChange('grade', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">Size *</label>
                  <select
                    value={formData.size || ''}
                    onChange={(e) => handleChange('size', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">Độ chín *</label>
                  <select
                    value={formData.ripeness || ''}
                    onChange={(e) => handleChange('ripeness', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    <option value="xanh">Xanh</option>
                    <option value="ương">Ương</option>
                    <option value="chín">Chín</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2">Xử lý sau thu hoạch</label>
                <input
                  type="text"
                  value={formData.postharvest_treatment || ''}
                  onChange={(e) => handleChange('postharvest_treatment', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Khối lượng (kg) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight_kg || ''}
                  onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
            </>
          )}

          {activeTab === 'qrcodes' && (
            <>
              <div>
                <label className="block font-bold mb-2">Lô hàng *</label>
                <select
                  value={formData.batch_id || ''}
                  onChange={(e) => handleChange('batch_id', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                >
                  {batches.map((b: Batch) => (
                    <option key={b.batch_id} value={b.batch_id}>
                      {b.batch_id} - {b.variety_name} ({b.farm_name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2">Mã QR *</label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) => handleChange('code', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                  placeholder="MNG-HLC-001-20241120"
                />
              </div>
              <div>
                <label className="block font-bold mb-2">Trạng thái *</label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                >
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'prices' && (
            <>
              <div>
                <label className="block font-bold mb-2">Giống *</label>
                <select
                  value={formData.variety_id || ''}
                  onChange={(e) => handleChange('variety_id', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                >
                  {varieties.map((v: Variety) => (
                    <option key={v.variety_id} value={v.variety_id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Loại giá *</label>
                  <select
                    value={formData.price_type || ''}
                    onChange={(e) => handleChange('price_type', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  >
                    <option value="original">Original</option>
                    <option value="selling">Selling</option>
                    <option value="promo">Promo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">Tiền tệ *</label>
                  <input
                    type="text"
                    value={formData.currency || ''}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2">Số tiền *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount || ''}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">Từ ngày *</label>
                  <input
                    type="date"
                    value={formData.valid_from?.split('T')[0] || ''}
                    onChange={(e) => handleChange('valid_from', e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2">Đến ngày</label>
                  <input
                    type="date"
                    value={formData.valid_to?.split('T')[0] || ''}
                    onChange={(e) => handleChange('valid_to', e.target.value || null)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFB300]"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-bold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-green-600 transition-colors font-bold"
            >
              {editingItem ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
