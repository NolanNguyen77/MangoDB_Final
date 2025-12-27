-- =====================================================
-- QUERY OPTIMIZATION - MANGO MANAGEMENT DATABASE
-- =====================================================
-- Tài liệu chứng minh tối ưu hóa query với EXPLAIN ANALYZE
-- Chạy từng phần để so sánh performance

-- =====================================================
-- PHẦN 1: INDEX OPTIMIZATION - QR CODE LOOKUP
-- =====================================================
-- Mục tiêu: Chứng minh index idx_qrcode_code tối ưu tra cứu QR

-- 1.1 XÓA INDEX ĐỂ TEST (Trước khi có index)
DROP INDEX IF EXISTS agri.idx_qrcode_code;

-- 1.2 QUERY KHÔNG CÓ INDEX → Seq Scan (chậm)
EXPLAIN ANALYZE
SELECT * FROM agri.qrcode 
WHERE code = 'MNG-HLC-001-20241120';
-- Kết quả mong đợi: Seq Scan on qrcode, rows scanned = ALL rows

-- 1.3 TẠO INDEX
CREATE INDEX idx_qrcode_code ON agri.qrcode(code);

-- 1.4 QUERY CÓ INDEX → Index Scan (nhanh)
EXPLAIN ANALYZE
SELECT * FROM agri.qrcode 
WHERE code = 'MNG-HLC-001-20241120';
-- Kết quả mong đợi: Index Scan using idx_qrcode_code, rows scanned = 1

-- =====================================================
-- PHẦN 2: COMPOSITE INDEX - BATCH FILTERING
-- =====================================================
-- Mục tiêu: Tối ưu query lọc batch theo variety + sort theo ngày

-- 2.1 XÓA INDEX ĐỂ TEST
DROP INDEX IF EXISTS agri.idx_batch_variety;

-- 2.2 QUERY KHÔNG CÓ INDEX
EXPLAIN ANALYZE
SELECT * FROM agri.batch 
WHERE variety_id = 1 
ORDER BY harvest_date DESC 
LIMIT 5;
-- Kết quả: Seq Scan + Sort (chậm với data lớn)

-- 2.3 TẠO COMPOSITE INDEX
CREATE INDEX idx_batch_variety ON agri.batch(variety_id, harvest_date DESC);

-- 2.4 QUERY CÓ INDEX
EXPLAIN ANALYZE
SELECT * FROM agri.batch 
WHERE variety_id = 1 
ORDER BY harvest_date DESC 
LIMIT 5;
-- Kết quả: Index Scan, KHÔNG cần sort thêm (đã sort sẵn trong index)

-- =====================================================
-- PHẦN 3: COVERING INDEX - PRICE LOOKUP
-- =====================================================
-- Mục tiêu: Tối ưu query lấy giá hiện hành

-- 3.1 XÓA INDEX ĐỂ TEST
DROP INDEX IF EXISTS agri.idx_price_variety_type_from;

-- 3.2 QUERY KHÔNG CÓ INDEX
EXPLAIN ANALYZE
SELECT amount, currency
FROM agri.price_history
WHERE variety_id = 1 
  AND price_type = 'selling'
  AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
ORDER BY valid_from DESC
LIMIT 1;
-- Kết quả: Seq Scan + Filter + Sort

-- 3.3 TẠO INDEX
CREATE INDEX idx_price_variety_type_from 
ON agri.price_history(variety_id, price_type, valid_from DESC);

-- 3.4 QUERY CÓ INDEX
EXPLAIN ANALYZE
SELECT amount, currency
FROM agri.price_history
WHERE variety_id = 1 
  AND price_type = 'selling'
  AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
ORDER BY valid_from DESC
LIMIT 1;
-- Kết quả: Index Scan, ít rows scanned hơn

-- =====================================================
-- PHẦN 4: JOIN OPTIMIZATION - VIEW PERFORMANCE
-- =====================================================
-- Mục tiêu: Chứng minh VIEW v_qr_public đã được tối ưu

-- 4.1 EXPLAIN VIEW (JOIN 5 bảng + LATERAL subquery)
EXPLAIN ANALYZE
SELECT * FROM agri.v_qr_public 
WHERE code = 'MNG-HLC-001-20241120';
-- View sử dụng:
-- - idx_qrcode_code để tìm QR
-- - PK indexes để JOIN các bảng
-- - LATERAL JOIN để lấy giá mới nhất (tránh N+1)

-- 4.2 SO SÁNH: Nếu viết query thủ công không có index
EXPLAIN ANALYZE
SELECT 
  q.code,
  p.name AS product_name,
  v.name AS variety_name,
  f.name AS farm_name,
  b.harvest_date
FROM agri.qrcode q
JOIN agri.batch b ON b.batch_id = q.batch_id
JOIN agri.variety v ON v.variety_id = b.variety_id  
JOIN agri.product p ON p.product_id = v.product_id
JOIN agri.farm f ON f.farm_id = b.farm_id
WHERE q.code = 'MNG-HLC-001-20241120';
-- Tất cả JOINs sử dụng PK indexes → Nested Loop với Index Scan

-- =====================================================
-- PHẦN 5: AGGREGATE OPTIMIZATION
-- =====================================================
-- Mục tiêu: Tối ưu báo cáo tổng hợp

-- 5.1 XÓA INDEX ĐỂ TEST
DROP INDEX IF EXISTS agri.idx_batch_farm;

-- 5.2 AGGREGATE QUERY KHÔNG CÓ INDEX
EXPLAIN ANALYZE
SELECT 
  f.name AS farm_name,
  COUNT(*) AS total_batches,
  SUM(b.weight_kg) AS total_weight,
  AVG(b.weight_kg) AS avg_weight
FROM agri.batch b
JOIN agri.farm f ON f.farm_id = b.farm_id
WHERE b.harvest_date >= '2024-11-01'
GROUP BY f.name
ORDER BY total_weight DESC;
-- Kết quả: Seq Scan on batch

-- 5.3 TẠO INDEX
CREATE INDEX idx_batch_farm ON agri.batch(farm_id, harvest_date DESC);

-- 5.4 AGGREGATE QUERY CÓ INDEX  
EXPLAIN ANALYZE
SELECT 
  f.name AS farm_name,
  COUNT(*) AS total_batches,
  SUM(b.weight_kg) AS total_weight,
  AVG(b.weight_kg) AS avg_weight
FROM agri.batch b
JOIN agri.farm f ON f.farm_id = b.farm_id
WHERE b.harvest_date >= '2024-11-01'
GROUP BY f.name
ORDER BY total_weight DESC;
-- Kết quả: Có thể sử dụng Index Scan hoặc Bitmap Index Scan

-- =====================================================
-- PHẦN 6: SUBQUERY vs JOIN OPTIMIZATION
-- =====================================================
-- Mục tiêu: So sánh hiệu suất subquery vs join

-- 6.1 SUBQUERY APPROACH (thường chậm hơn)
EXPLAIN ANALYZE
SELECT * FROM agri.batch b
WHERE b.variety_id IN (
  SELECT variety_id FROM agri.variety 
  WHERE origin LIKE '%Đồng Tháp%'
);

-- 6.2 JOIN APPROACH (thường nhanh hơn)
EXPLAIN ANALYZE
SELECT b.* FROM agri.batch b
JOIN agri.variety v ON v.variety_id = b.variety_id
WHERE v.origin LIKE '%Đồng Tháp%';
-- PostgreSQL optimizer có thể tự chuyển, nhưng JOIN explicit hơn

-- =====================================================
-- PHẦN 7: LATERAL JOIN OPTIMIZATION
-- =====================================================
-- Mục tiêu: Chứng minh LATERAL JOIN hiệu quả cho "top-N per group"

-- 7.1 LẤY GIÁ MỚI NHẤT CỦA MỖI GIỐNG (LATERAL JOIN - Tối ưu)
EXPLAIN ANALYZE
SELECT v.name, ph.amount, ph.currency, ph.valid_from
FROM agri.variety v
CROSS JOIN LATERAL (
  SELECT amount, currency, valid_from
  FROM agri.price_history
  WHERE variety_id = v.variety_id
    AND price_type = 'selling'
  ORDER BY valid_from DESC
  LIMIT 1
) ph;
-- LATERAL cho phép mỗi row trong variety chỉ tìm 1 price (hiệu quả)

-- 7.2 SO SÁNH: ROW_NUMBER (đúng nhưng có thể chậm hơn với data lớn)
EXPLAIN ANALYZE
WITH ranked AS (
  SELECT 
    variety_id, amount, currency, valid_from,
    ROW_NUMBER() OVER (PARTITION BY variety_id ORDER BY valid_from DESC) as rn
  FROM agri.price_history
  WHERE price_type = 'selling'
)
SELECT v.name, r.amount, r.currency, r.valid_from
FROM agri.variety v
JOIN ranked r ON r.variety_id = v.variety_id AND r.rn = 1;

-- =====================================================
-- PHẦN 8: PARTIAL INDEX (NÂNG CAO)
-- =====================================================
-- Mục tiêu: Index chỉ cho subset của data

-- 8.1 INDEX CHỈ CHO QR ACTIVE (tiết kiệm space, nhanh hơn)
CREATE INDEX IF NOT EXISTS idx_qrcode_active 
ON agri.qrcode(code) 
WHERE status = 'active';

-- 8.2 QUERY SỬ DỤNG PARTIAL INDEX
EXPLAIN ANALYZE
SELECT * FROM agri.qrcode 
WHERE code = 'MNG-HLC-001-20241120' 
  AND status = 'active';
-- Sử dụng idx_qrcode_active thay vì idx_qrcode_code

-- =====================================================
-- CLEANUP: TẠO LẠI TẤT CẢ INDEXES
-- =====================================================
-- Đảm bảo tất cả indexes tồn tại sau khi test

CREATE INDEX IF NOT EXISTS idx_qrcode_code 
ON agri.qrcode(code);

CREATE INDEX IF NOT EXISTS idx_batch_variety 
ON agri.batch(variety_id, harvest_date DESC);

CREATE INDEX IF NOT EXISTS idx_batch_farm 
ON agri.batch(farm_id, harvest_date DESC);

CREATE INDEX IF NOT EXISTS idx_price_variety_type_from 
ON agri.price_history(variety_id, price_type, valid_from DESC);

-- =====================================================
-- TÓM TẮT KẾT QUẢ TỐI ƯU
-- =====================================================
/*
+----------------------------------+-------------------+-------------------+
| Query                            | Trước Index       | Sau Index         |
+----------------------------------+-------------------+-------------------+
| QR Code Lookup                   | Seq Scan (O(n))   | Index Scan (O(logn))|
| Batch filter by variety          | Seq Scan + Sort   | Index Only Scan   |
| Price lookup                     | Seq Scan + Sort   | Index Scan        |
| Multi-table JOIN (5 tables)      | Multiple Seq Scan | Nested Loop + Index|
| Aggregate (SUM, COUNT)           | Full Table Scan   | Index Scan/Bitmap |
+----------------------------------+-------------------+-------------------+

QUAN TRỌNG:
- Index giúp giảm từ O(n) xuống O(log n) cho lookup
- Composite index (variety_id, harvest_date DESC) tránh cần Sort
- LATERAL JOIN tối ưu cho "get latest per group"
- Partial Index tiết kiệm space khi chỉ query subset
*/
