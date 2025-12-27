-- =====================================================
-- MIGRATION: Thêm ON DELETE CASCADE cho FK
-- =====================================================
-- Chạy file này để cập nhật database hiện có
-- KHÔNG cần chạy lại Table.sql (sẽ xóa hết data)

-- 1. Cập nhật FK cho qrcode.batch_id
ALTER TABLE agri.qrcode 
DROP CONSTRAINT IF EXISTS qrcode_batch_id_fkey;

ALTER TABLE agri.qrcode
ADD CONSTRAINT qrcode_batch_id_fkey 
  FOREIGN KEY (batch_id) 
  REFERENCES agri.batch(batch_id) 
  ON DELETE CASCADE;

-- 2. Cập nhật FK cho price_history.variety_id
ALTER TABLE agri.price_history 
DROP CONSTRAINT IF EXISTS price_history_variety_id_fkey;

ALTER TABLE agri.price_history
ADD CONSTRAINT price_history_variety_id_fkey 
  FOREIGN KEY (variety_id) 
  REFERENCES agri.variety(variety_id) 
  ON DELETE CASCADE;

-- 3. Kiểm tra kết quả
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'agri'
ORDER BY tc.table_name;

-- Kết quả mong đợi:
-- qrcode_batch_id_fkey       | qrcode        | batch_id   | batch   | CASCADE
-- price_history_variety_id_fkey | price_history | variety_id | variety | CASCADE
-- batch_variety_id_fkey      | batch         | variety_id | variety | NO ACTION
-- batch_farm_id_fkey         | batch         | farm_id    | farm    | NO ACTION
-- variety_product_id_fkey    | variety       | product_id | product | NO ACTION
