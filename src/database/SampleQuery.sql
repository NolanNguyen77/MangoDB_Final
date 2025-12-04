-- Quét QR
SELECT * FROM agri.v_qr_lookup
WHERE code = 'QR-MANGO-CHL-20251120-0001';

-- Lấy giá bán hiện hành của 1 giống
SELECT amount, currency
FROM agri.price_history
WHERE variety_id = 1 AND price_type='selling'
AND (valid_to IS NULL OR valid_to >= CURRENT_DATE)
ORDER BY valid_from DESC LIMIT 1;

-- Báo cáo nhanh: sản lượng theo giống + tháng
SELECT v.name AS variety, date_trunc('month', b.harvest_date) AS month, SUM(b.weight_kg) AS total_kg
FROM agri.batch b JOIN agri.variety v ON v.variety_id=b.variety_id
GROUP BY v.name, date_trunc('month', b.harvest_date)
ORDER BY month DESC, variety;
