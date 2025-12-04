-- Trước khi tạo idx_qrcode_code (nếu bạn muốn so sánh thì DROP trước)
-- DROP INDEX IF EXISTS agri.idx_qrcode_code;

EXPLAIN ANALYZE
SELECT * FROM agri.batch

-- Tạo lại index và so sánh
DROP INDEX IF EXISTS agri.idx_qrcode_code;
CREATE INDEX IF NOT EXISTS idx_qrcode_code ON agri.qrcode(code);
