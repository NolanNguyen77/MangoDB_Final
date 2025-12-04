// =====================================================
// API CONFIGURATION FOR MANGO MANAGEMENT SYSTEM
// =====================================================

export const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // ============================================
  // QR SCANNER ENDPOINTS (UI2)
  // ============================================
  getProductByCode: (code: string) => `${API_BASE_URL}/products/${code}`,
  
  // ============================================
  // ADMIN ENDPOINTS (UI4)
  // ============================================
  
  // Products
  products: `${API_BASE_URL}/admin/products`,
  product: (id: number) => `${API_BASE_URL}/admin/products/${id}`,
  
  // Varieties
  varieties: `${API_BASE_URL}/admin/varieties`,
  variety: (id: number) => `${API_BASE_URL}/admin/varieties/${id}`,
  
  // Farms
  farms: `${API_BASE_URL}/admin/farms`,
  farm: (id: number) => `${API_BASE_URL}/admin/farms/${id}`,
  
  // Batches
  batches: `${API_BASE_URL}/admin/batches`,
  batch: (id: number) => `${API_BASE_URL}/admin/batches/${id}`,
  
  // QR Codes
  qrcodes: `${API_BASE_URL}/admin/qrcodes`,
  qrcode: (id: number) => `${API_BASE_URL}/admin/qrcodes/${id}`,
  
  // Price History
  prices: `${API_BASE_URL}/admin/prices`,
  price: (id: number) => `${API_BASE_URL}/admin/prices/${id}`,
};

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Product {
  product_id: number;
  name: string;
  category: string;
  description?: string;
}

export interface Variety {
  variety_id: number;
  product_id: number;
  product_name?: string;
  name: string;
  seed_type: 'có hột' | 'ít hột' | 'không hột';
  color: string;
  brix_from: number;
  brix_to: number;
  origin: string;
}

export interface Farm {
  farm_id: number;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  certification?: string;
}

export interface Batch {
  batch_id: number;
  variety_id: number;
  variety_name?: string;
  farm_id: number;
  farm_name?: string;
  harvest_date: string;
  expiry_date: string;
  grade: 'A' | 'B' | 'C';
  size: 'S' | 'M' | 'L' | 'XL';
  ripeness: 'xanh' | 'ương' | 'chín';
  postharvest_treatment?: string;
  weight_kg: number;
}

export interface QRCode {
  qr_id: number;
  batch_id: number;
  code: string;
  status: 'active' | 'used' | 'revoked';
  created_at: string;
  harvest_date?: string;
  variety_name?: string;
  farm_name?: string;
}

export interface PriceHistory {
  price_id: number;
  variety_id: number;
  variety_name?: string;
  price_type: 'original' | 'selling' | 'promo';
  currency: string;
  amount: number;
  valid_from: string;
  valid_to?: string;
}

export interface ProductInfo {
  code: string;
  product_name: string;
  variety_name: string;
  origin: string;
  farm_name: string;
  address: string;
  harvest_date: string;
  expiry_date: string;
  grade?: string;
  postharvest_treatment?: string;
  current_price: number;
  currency: string;
}

// =====================================================
// API HELPER FUNCTIONS
// =====================================================

async function apiRequest(url: string, options?: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  // GET request
  get(url: string): Promise<any> {
    return apiRequest(url, { method: 'GET' });
  },

  // POST request
  post(url: string, data: any): Promise<any> {
    return apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put(url: string, data: any): Promise<any> {
    return apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete(url: string): Promise<any> {
    return apiRequest(url, { method: 'DELETE' });
  },
};
