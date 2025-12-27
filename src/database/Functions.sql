-- =====================================================
-- STORED FUNCTIONS - MANGO MANAGEMENT DATABASE
-- =====================================================
-- Chạy sau Table.sql và InsertData.sql

-- =====================================================
-- FUNCTION: Tạo lô hàng mới với đầy đủ thông tin
-- =====================================================
-- Cho phép tạo Product, Variety, Farm, Batch, QR, Price cùng lúc
-- Nếu Product/Variety/Farm đã tồn tại thì sử dụng lại

-- LƯU Ý: Tham số REQUIRED phải đặt TRƯỚC tham số có DEFAULT

CREATE OR REPLACE FUNCTION agri.create_full_batch(
  -- ===== REQUIRED PARAMETERS (không có default) =====
  p_variety_name VARCHAR,           -- Tên giống (bắt buộc)
  p_origin VARCHAR,                 -- Nguồn gốc (bắt buộc)
  p_farm_name VARCHAR,              -- Tên nông trại (bắt buộc)
  p_harvest_date DATE,              -- Ngày thu hoạch (bắt buộc)
  p_expiry_date DATE,               -- Hạn sử dụng (bắt buộc)
  p_qr_code VARCHAR,                -- Mã QR (bắt buộc)
  
  -- ===== OPTIONAL PARAMETERS (có default) =====
  -- Product info
  p_product_name VARCHAR DEFAULT 'Xoài',
  p_category VARCHAR DEFAULT 'fruit',
  
  -- Variety info
  p_seed_type VARCHAR DEFAULT 'có hột',
  p_color VARCHAR DEFAULT 'vàng',
  p_brix_from NUMERIC DEFAULT 15.0,
  p_brix_to NUMERIC DEFAULT 20.0,
  
  -- Farm info
  p_farm_address VARCHAR DEFAULT NULL,
  p_farm_phone VARCHAR DEFAULT NULL,
  p_certification VARCHAR DEFAULT 'VietGAP',
  
  -- Batch info
  p_grade VARCHAR DEFAULT 'A',
  p_size VARCHAR DEFAULT 'M',
  p_ripeness VARCHAR DEFAULT 'chín',
  p_weight_kg NUMERIC DEFAULT 100.0,
  p_postharvest_treatment VARCHAR DEFAULT NULL,
  
  -- Price info
  p_selling_price NUMERIC DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_product_id INT;
  v_variety_id INT;
  v_farm_id INT;
  v_batch_id INT;
  v_qr_id INT;
  v_result JSON;
BEGIN
  -- 1. Tìm hoặc tạo Product
  SELECT product_id INTO v_product_id 
  FROM agri.product WHERE name = p_product_name;
  
  IF v_product_id IS NULL THEN
    INSERT INTO agri.product (name, category) 
    VALUES (p_product_name, p_category)
    RETURNING product_id INTO v_product_id;
    RAISE NOTICE 'Created new product: % (ID: %)', p_product_name, v_product_id;
  END IF;
  
  -- 2. Tìm hoặc tạo Variety
  SELECT variety_id INTO v_variety_id 
  FROM agri.variety 
  WHERE name = p_variety_name AND product_id = v_product_id;
  
  IF v_variety_id IS NULL THEN
    INSERT INTO agri.variety (product_id, name, seed_type, color, brix_from, brix_to, origin)
    VALUES (v_product_id, p_variety_name, p_seed_type, p_color, p_brix_from, p_brix_to, p_origin)
    RETURNING variety_id INTO v_variety_id;
    RAISE NOTICE 'Created new variety: % (ID: %)', p_variety_name, v_variety_id;
  END IF;
  
  -- 3. Tìm hoặc tạo Farm
  SELECT farm_id INTO v_farm_id 
  FROM agri.farm WHERE name = p_farm_name;
  
  IF v_farm_id IS NULL THEN
    INSERT INTO agri.farm (name, address, phone, certification)
    VALUES (p_farm_name, p_farm_address, p_farm_phone, p_certification)
    RETURNING farm_id INTO v_farm_id;
    RAISE NOTICE 'Created new farm: % (ID: %)', p_farm_name, v_farm_id;
  END IF;
  
  -- 4. Tạo Batch
  INSERT INTO agri.batch (variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, weight_kg, postharvest_treatment)
  VALUES (v_variety_id, v_farm_id, p_harvest_date, p_expiry_date, p_grade, p_size, p_ripeness, p_weight_kg, p_postharvest_treatment)
  RETURNING batch_id INTO v_batch_id;
  RAISE NOTICE 'Created new batch: ID %', v_batch_id;
  
  -- 5. Tạo QR Code
  INSERT INTO agri.qrcode (batch_id, code, status)
  VALUES (v_batch_id, p_qr_code, 'active')
  RETURNING qr_id INTO v_qr_id;
  RAISE NOTICE 'Created new QR code: % (ID: %)', p_qr_code, v_qr_id;
  
  -- 6. Tạo Price nếu có (và chưa có giá cho variety này)
  IF p_selling_price IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM agri.price_history 
      WHERE variety_id = v_variety_id AND price_type = 'selling'
    ) THEN
      INSERT INTO agri.price_history (variety_id, price_type, currency, amount, valid_from)
      VALUES (v_variety_id, 'selling', 'VND', p_selling_price, CURRENT_DATE);
      RAISE NOTICE 'Created new price: % VND', p_selling_price;
    END IF;
  END IF;
  
  -- 7. Return kết quả dạng JSON
  SELECT json_build_object(
    'success', true,
    'message', 'Tạo lô hàng thành công!',
    'data', json_build_object(
      'qr_code', p_qr_code,
      'qr_id', v_qr_id,
      'batch_id', v_batch_id,
      'variety_id', v_variety_id,
      'variety_name', p_variety_name,
      'farm_id', v_farm_id,
      'farm_name', p_farm_name,
      'product_id', v_product_id,
      'product_name', p_product_name,
      'harvest_date', p_harvest_date,
      'expiry_date', p_expiry_date
    )
  ) INTO v_result;
  
  RETURN v_result;
  
EXCEPTION
  WHEN unique_violation THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Lỗi: Mã QR đã tồn tại!',
      'error', SQLERRM
    );
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Lỗi khi tạo lô hàng',
      'error', SQLERRM
    );
END;
$$;

-- =====================================================
-- TEST: Gọi function để test (chỉ cần 6 tham số bắt buộc)
-- =====================================================
/*
-- Cách 1: Chỉ truyền tham số bắt buộc
SELECT agri.create_full_batch(
  'Xoài Cát Hòa Lộc Test',       -- variety_name (bắt buộc)
  'Đồng Tháp, Việt Nam',         -- origin (bắt buộc)
  'Nông trại Test',              -- farm_name (bắt buộc)
  '2024-12-01',                  -- harvest_date (bắt buộc)
  '2025-01-01',                  -- expiry_date (bắt buộc)
  'MNG-TEST-001'                 -- qr_code (bắt buộc)
);

-- Cách 2: Truyền đầy đủ với named parameters
SELECT agri.create_full_batch(
  p_variety_name := 'Xoài Cát Hòa Lộc',
  p_origin := 'Đồng Tháp, Việt Nam',
  p_farm_name := 'Nông trại Xoài Vàng',
  p_harvest_date := '2024-12-01',
  p_expiry_date := '2025-01-01',
  p_qr_code := 'MNG-HLC-NEW-001',
  p_weight_kg := 500.00,
  p_grade := 'A',
  p_size := 'L',
  p_selling_price := 65000
);
*/
