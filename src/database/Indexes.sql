-- =====================================================
-- DATA INDEXING - MANGO MANAGEMENT DATABASE
-- =====================================================
-- Tất cả indexes được tạo để tối ưu performance
-- Chạy sau Table.sql

-- =====================================================
-- BUSINESS DATA INDEXES (Schema: agri)
-- =====================================================

-- 1. QR Code lookup - O(log n) thay vì O(n)
-- Sử dụng khi: Quét QR code để tra cứu sản phẩm
CREATE INDEX IF NOT EXISTS idx_qrcode_code 
ON agri.qrcode(code);

-- 2. Batch by Variety - Composite index với sort
-- Sử dụng khi: Lấy các lô hàng theo giống, sort theo ngày mới nhất
CREATE INDEX IF NOT EXISTS idx_batch_variety 
ON agri.batch(variety_id, harvest_date DESC);

-- 3. Batch by Farm - Composite index với sort  
-- Sử dụng khi: Lấy các lô hàng theo nông trại
CREATE INDEX IF NOT EXISTS idx_batch_farm 
ON agri.batch(farm_id, harvest_date DESC);

-- 4. Price History - Triple composite index
-- Sử dụng khi: Lấy giá bán hiện hành của giống
CREATE INDEX IF NOT EXISTS idx_price_variety_type_from 
ON agri.price_history(variety_id, price_type, valid_from DESC);

-- 5. PARTIAL INDEX - Chỉ cho QR active (tiết kiệm space)
-- Sử dụng khi: Chỉ query QR codes còn hoạt động
CREATE INDEX IF NOT EXISTS idx_qrcode_active 
ON agri.qrcode(code) 
WHERE status = 'active';

-- =====================================================
-- AUTHENTICATION INDEXES (Schema: auth)
-- =====================================================

-- 6. User email lookup - Cho login
CREATE INDEX IF NOT EXISTS idx_users_email 
ON auth.users(email);

-- 7. User roles mapping
CREATE INDEX IF NOT EXISTS idx_user_roles_user 
ON auth.user_roles(user_id);

-- 8. Role lookup
CREATE INDEX IF NOT EXISTS idx_user_roles_role 
ON auth.user_roles(role_id);

-- =====================================================
-- VERIFY INDEXES
-- =====================================================

-- Xem tất cả indexes đã tạo
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname IN ('agri', 'auth')
ORDER BY schemaname, tablename;

-- =====================================================
-- INDEX STATISTICS
-- =====================================================

-- Kiểm tra index usage (chạy sau khi có queries)
SELECT 
    schemaname,
    relname AS table_name,
    indexrelname AS index_name,
    idx_scan AS times_used,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname IN ('agri', 'auth')
ORDER BY idx_scan DESC;

-- =====================================================
-- TÓM TẮT INDEXES
-- =====================================================
/*
+------------------------------+------------------+--------------------------------+
| Index Name                   | Table            | Columns                        |
+------------------------------+------------------+--------------------------------+
| idx_qrcode_code              | agri.qrcode      | code                           |
| idx_qrcode_active            | agri.qrcode      | code (WHERE status='active')   |
| idx_batch_variety            | agri.batch       | variety_id, harvest_date DESC  |
| idx_batch_farm               | agri.batch       | farm_id, harvest_date DESC     |
| idx_price_variety_type_from  | agri.price_history| variety_id, price_type, valid_from|
| idx_users_email              | auth.users       | email                          |
| idx_user_roles_user          | auth.user_roles  | user_id                        |
| idx_user_roles_role          | auth.user_roles  | role_id                        |
+------------------------------+------------------+--------------------------------+

TỔNG: 8 indexes cho cả 2 schemas
- 5 indexes cho business data (agri)
- 3 indexes cho authentication (auth)
*/