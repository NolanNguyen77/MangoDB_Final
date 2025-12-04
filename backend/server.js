const express = require('express');
const cors = require('cors');
require('dotenv').config(); // ✅ Thêm dòng này để load .env
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001; // ✅ Đổi từ 3000 → 3001
const JWT_SECRET = process.env.JWT_SECRET || 'mango-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// API ENDPOINTS FOR QR SCANNER (UI2)
// ============================================

// GET: Tra cứu sản phẩm theo mã QR
app.get('/api/products/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM agri.v_qr_public WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Mã QR không hợp lệ hoặc không tồn tại trong hệ thống' 
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ============================================
// API ENDPOINTS FOR ADMIN DASHBOARD (UI4)
// ============================================

// --------------- PRODUCTS ---------------
// GET: Lấy tất cả sản phẩm
app.get('/api/admin/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agri.product ORDER BY product_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm sản phẩm mới
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const result = await pool.query(
      'INSERT INTO agri.product (name, category, description) VALUES ($1, $2, $3) RETURNING *',
      [name, category, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật sản phẩm
app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;
    const result = await pool.query(
      'UPDATE agri.product SET name = $1, category = $2, description = $3 WHERE product_id = $4 RETURNING *',
      [name, category, description, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa sản phẩm
app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.product WHERE product_id = $1', [id]);
    res.json({ message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --------------- VARIETIES ---------------
// GET: Lấy tất cả giống
app.get('/api/admin/varieties', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, p.name as product_name 
      FROM agri.variety v
      JOIN agri.product p ON v.product_id = p.product_id
      ORDER BY v.variety_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching varieties:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm giống mới
app.post('/api/admin/varieties', async (req, res) => {
  try {
    const { product_id, name, seed_type, color, brix_from, brix_to, origin } = req.body;
    const result = await pool.query(
      `INSERT INTO agri.variety (product_id, name, seed_type, color, brix_from, brix_to, origin) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [product_id, name, seed_type, color, brix_from, brix_to, origin]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating variety:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật giống
app.put('/api/admin/varieties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, name, seed_type, color, brix_from, brix_to, origin } = req.body;
    const result = await pool.query(
      `UPDATE agri.variety 
       SET product_id = $1, name = $2, seed_type = $3, color = $4, brix_from = $5, brix_to = $6, origin = $7
       WHERE variety_id = $8 RETURNING *`,
      [product_id, name, seed_type, color, brix_from, brix_to, origin, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating variety:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa giống
app.delete('/api/admin/varieties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.variety WHERE variety_id = $1', [id]);
    res.json({ message: 'Đã xóa giống thành công' });
  } catch (error) {
    console.error('Error deleting variety:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --------------- FARMS ---------------
// GET: Lấy tất cả nông trại
app.get('/api/admin/farms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agri.farm ORDER BY farm_id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm nông trại mới
app.post('/api/admin/farms', async (req, res) => {
  try {
    const { name, address, phone, website, certification } = req.body;
    const result = await pool.query(
      `INSERT INTO agri.farm (name, address, phone, website, certification) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, address, phone, website, certification]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật nông trại
app.put('/api/admin/farms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, website, certification } = req.body;
    const result = await pool.query(
      `UPDATE agri.farm 
       SET name = $1, address = $2, phone = $3, website = $4, certification = $5
       WHERE farm_id = $6 RETURNING *`,
      [name, address, phone, website, certification, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating farm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa nông trại
app.delete('/api/admin/farms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.farm WHERE farm_id = $1', [id]);
    res.json({ message: 'Đã xóa nông trại thành công' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --------------- BATCHES ---------------
// GET: Lấy tất cả lô hàng
app.get('/api/admin/batches', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, v.name as variety_name, f.name as farm_name
      FROM agri.batch b
      JOIN agri.variety v ON b.variety_id = v.variety_id
      JOIN agri.farm f ON b.farm_id = f.farm_id
      ORDER BY b.batch_id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm lô hàng mới
app.post('/api/admin/batches', async (req, res) => {
  try {
    const { variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg } = req.body;
    const result = await pool.query(
      `INSERT INTO agri.batch 
       (variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật lô hàng
app.put('/api/admin/batches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg } = req.body;
    const result = await pool.query(
      `UPDATE agri.batch 
       SET variety_id = $1, farm_id = $2, harvest_date = $3, expiry_date = $4, 
           grade = $5, size = $6, ripeness = $7, postharvest_treatment = $8, weight_kg = $9
       WHERE batch_id = $10 RETURNING *`,
      [variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa lô hàng
app.delete('/api/admin/batches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.batch WHERE batch_id = $1', [id]);
    res.json({ message: 'Đã xóa lô hàng thành công' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --------------- QR CODES ---------------
// GET: Lấy tất cả mã QR
app.get('/api/admin/qrcodes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.*, b.harvest_date, v.name as variety_name, f.name as farm_name
      FROM agri.qrcode q
      JOIN agri.batch b ON q.batch_id = b.batch_id
      JOIN agri.variety v ON b.variety_id = v.variety_id
      JOIN agri.farm f ON b.farm_id = f.farm_id
      ORDER BY q.qr_id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching qrcodes:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm mã QR mới
app.post('/api/admin/qrcodes', async (req, res) => {
  try {
    const { batch_id, code, status } = req.body;
    const result = await pool.query(
      `INSERT INTO agri.qrcode (batch_id, code, status) 
       VALUES ($1, $2, $3) RETURNING *`,
      [batch_id, code, status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating qrcode:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật mã QR
app.put('/api/admin/qrcodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { batch_id, code, status } = req.body;
    const result = await pool.query(
      `UPDATE agri.qrcode 
       SET batch_id = $1, code = $2, status = $3
       WHERE qr_id = $4 RETURNING *`,
      [batch_id, code, status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating qrcode:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa mã QR
app.delete('/api/admin/qrcodes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.qrcode WHERE qr_id = $1', [id]);
    res.json({ message: 'Đã xóa mã QR thành công' });
  } catch (error) {
    console.error('Error deleting qrcode:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// --------------- PRICE HISTORY ---------------
// GET: Lấy lịch sử giá
app.get('/api/admin/prices', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ph.*, v.name as variety_name
      FROM agri.price_history ph
      JOIN agri.variety v ON ph.variety_id = v.variety_id
      ORDER BY ph.price_id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Thêm giá mới
app.post('/api/admin/prices', async (req, res) => {
  try {
    const { variety_id, price_type, currency, amount, valid_from, valid_to } = req.body;
    const result = await pool.query(
      `INSERT INTO agri.price_history (variety_id, price_type, currency, amount, valid_from, valid_to) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [variety_id, price_type, currency, amount, valid_from, valid_to || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating price:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// PUT: Cập nhật giá
app.put('/api/admin/prices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { variety_id, price_type, currency, amount, valid_from, valid_to } = req.body;
    const result = await pool.query(
      `UPDATE agri.price_history 
       SET variety_id = $1, price_type = $2, currency = $3, amount = $4, valid_from = $5, valid_to = $6
       WHERE price_id = $7 RETURNING *`,
      [variety_id, price_type, currency, amount, valid_from, valid_to || null, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// DELETE: Xóa giá
app.delete('/api/admin/prices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM agri.price_history WHERE price_id = $1', [id]);
    res.json({ message: 'Đã xóa giá thành công' });
  } catch (error) {
    console.error('Error deleting price:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ============================================
// AUTH ENDPOINTS (UI3 - Login)
// ============================================

// POST: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    // Get user from database
    const userResult = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.is_active, array_agg(r.name) as roles
       FROM auth.users u
       LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
       LEFT JOIN auth.roles r ON ur.role_id = r.id
       WHERE u.email = $1
       GROUP BY u.id`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Email hoặc password không đúng' });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ message: 'Tài khoản đã bị vô hiệu hóa' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email hoặc password không đúng' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        roles: user.roles 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST: Verify token (optional - for frontend to check if token is still valid)
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token là bắt buộc' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists and is active
    const userResult = await pool.query(
      `SELECT id, email, is_active FROM auth.users WHERE id = $1`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    res.json({ 
      message: 'Token hợp lệ',
      user: {
        id: decoded.userId,
        email: decoded.email,
        roles: decoded.roles
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`\n🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭`);
  console.log(`🥭  MANGO MANAGEMENT API  🥭`);
  console.log(`🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭`);
  console.log(`\n✅ Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`✅ Database: MangoDB`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   🔍 GET  /api/products/:code          - Tra cứu sản phẩm (UI2)`);
  console.log(`   📦 GET  /api/admin/products          - Lấy tất cả sản phẩm`);
  console.log(`   📦 POST /api/admin/products          - Thêm sản phẩm mới`);
  console.log(`   📦 PUT  /api/admin/products/:id      - Cập nhật sản phẩm`);
  console.log(`   📦 DEL  /api/admin/products/:id      - Xóa sản phẩm`);
  console.log(`   (Tương tự cho varieties, farms, batches, qrcodes, prices...)`);
  console.log(`\n🚀 Sẵn sàng phục vụ!\n`);
});
