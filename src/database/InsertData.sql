-- (1) Sản phẩm
INSERT INTO agri.product (name, category, description) VALUES
('Xoài', 'fruit', 'Trái xoài Việt Nam chất lượng cao, xuất khẩu và tiêu thụ nội địa');

-- (2) Giống xoài
INSERT INTO agri.variety (product_id, name, seed_type, color, brix_from, brix_to, origin) VALUES
(1, 'Xoài Cát Hòa Lộc', 'ít hột', 'vàng chanh', 18.0, 22.0, 'Đồng Tháp, Việt Nam'),
(1, 'Xoài Cát Chu', 'ít hột', 'vàng cam', 16.0, 20.0, 'Tiền Giang, Việt Nam'),
(1, 'Xoài Keo', 'có hột', 'xanh vàng', 14.0, 18.0, 'Cao Lãnh, Đồng Tháp'),
(1, 'Xoài Úc R2E2', 'có hột', 'đỏ cam', 15.0, 19.0, 'Úc (trồng tại Việt Nam)'),
(1, 'Xoài Thái Lan', 'ít hột', 'vàng', 17.0, 21.0, 'Thái Lan (trồng tại Việt Nam)'),
(1, 'Xoài Tượng', 'có hột', 'xanh', 12.0, 16.0, 'Bình Thuận, Việt Nam');

-- (3) Nông trại
INSERT INTO agri.farm (name, address, phone, website, certification) VALUES
('Nông trại Xoài Vàng', 'Xã Bình Thành, Huyện Cao Lãnh, Đồng Tháp', '0270-3851234', 'www.xoaivang.vn', 'VietGAP, GlobalG.A.P'),
('Vườn xoài Hòa Lộc Xuân', 'Xã Mỹ Hòa, Huyện Cao Lãnh, Đồng Tháp', '0270-3852345', NULL, 'VietGAP'),
('Trang trại Xoài Organic Đồng Tháp', 'Thị trấn Mỹ An, Huyện Tháp Mười, Đồng Tháp', '0270-3853456', 'www.xoaiorganic.com', 'Organic Việt Nam, USDA Organic'),
('Nông trại Cát Chu Tiền Giang', 'Xã Tân Hội, Huyện Cai Lậy, Tiền Giang', '0273-3821234', NULL, 'VietGAP'),
('HTX Xoài Bình Thuận', 'Xã Hàm Trí, Huyện Hàm Thuận Bắc, Bình Thuận', '0252-3871234', 'www.xoaibinhthuan.vn', 'VietGAP, GlobalG.A.P'),
('Vườn xoài An Phước', 'Xã An Phước, Huyện Châu Thành, Đồng Tháp', '0270-3854567', NULL, 'VietGAP');

-- (4) Lô thu hoạch
INSERT INTO agri.batch (variety_id, farm_id, harvest_date, expiry_date, grade, size, ripeness, postharvest_treatment, weight_kg) VALUES
-- Xoài Cát Hòa Lộc
(1, 1, '2024-11-20', '2024-12-20', 'A', 'L', 'chín', 'Rửa nước sạch, sấy khô, đóng gói chân không', 500.00),
(1, 2, '2024-11-22', '2024-12-22', 'A', 'XL', 'ương', 'Xử lý nhiệt 43°C, rửa, đóng gói', 750.50),
(1, 3, '2024-11-25', '2024-12-25', 'A', 'M', 'chín', 'Rửa organic, sấy tự nhiên, đóng gói giấy', 450.25),
(1, 6, '2024-11-18', '2024-12-18', 'B', 'L', 'chín', 'Rửa, phân loại', 320.00),

-- Xoài Cát Chu
(2, 4, '2024-11-21', '2024-12-21', 'A', 'L', 'chín', 'Rửa, xử lý nhiệt, đóng gói', 600.00),
(2, 4, '2024-11-23', '2024-12-23', 'A', 'M', 'ương', 'Rửa sạch, sấy khô', 480.75),

-- Xoài Keo
(3, 1, '2024-11-19', '2024-12-19', 'B', 'M', 'xanh', 'Rửa, phân loại', 400.00),
(3, 6, '2024-11-24', '2024-12-24', 'A', 'L', 'ương', 'Rửa, xử lý nhiệt nhẹ', 550.00),

-- Xoài Úc R2E2
(4, 3, '2024-11-20', '2024-12-20', 'A', 'XL', 'chín', 'Xử lý nhiệt, rửa organic, đóng gói cao cấp', 680.00),
(4, 5, '2024-11-22', '2024-12-22', 'A', 'L', 'ương', 'Rửa, xử lý nhiệt 45°C, đóng gói', 720.50),

-- Xoài Thái Lan
(5, 2, '2024-11-21', '2024-12-21', 'A', 'L', 'chín', 'Rửa sạch, sấy khô, đóng gói', 530.00),
(5, 3, '2024-11-23', '2024-12-23', 'A', 'M', 'ương', 'Rửa organic, sấy tự nhiên', 420.00),

-- Xoài Tượng
(6, 5, '2024-11-19', '2024-12-19', 'B', 'L', 'xanh', 'Rửa, phân loại', 380.00),
(6, 5, '2024-11-24', '2024-12-24', 'A', 'M', 'ương', 'Rửa, xử lý nhiệt nhẹ', 460.00);

-- (5) QR Code
INSERT INTO agri.qrcode (batch_id, code, status) VALUES
-- Xoài Cát Hòa Lộc
(1, 'MNG-HLC-001-20241120', 'active'),
(1, 'MNG-HLC-002-20241120', 'active'),
(2, 'MNG-HLC-003-20241122', 'active'),
(2, 'MNG-HLC-004-20241122', 'active'),
(3, 'MNG-HLC-005-20241125', 'active'),
(4, 'MNG-HLC-006-20241118', 'active'),

-- Xoài Cát Chu
(5, 'MNG-CCU-001-20241121', 'active'),
(5, 'MNG-CCU-002-20241121', 'active'),
(6, 'MNG-CCU-003-20241123', 'active'),

-- Xoài Keo
(7, 'MNG-KEO-001-20241119', 'active'),
(8, 'MNG-KEO-002-20241124', 'active'),

-- Xoài Úc R2E2
(9, 'MNG-R2E-001-20241120', 'active'),
(9, 'MNG-R2E-002-20241120', 'active'),
(10, 'MNG-R2E-003-20241122', 'active'),

-- Xoài Thái Lan
(11, 'MNG-THL-001-20241121', 'active'),
(12, 'MNG-THL-002-20241123', 'active'),

-- Xoài Tượng
(13, 'MNG-TUO-001-20241119', 'active'),
(14, 'MNG-TUO-002-20241124', 'active');

-- (6) Lịch sử giá
INSERT INTO agri.price_history (variety_id, price_type, currency, amount, valid_from, valid_to) VALUES
-- Xoài Cát Hòa Lộc
(1, 'original', 'VND', 45000, '2024-11-01', NULL),
(1, 'selling', 'VND', 65000, '2024-11-01', NULL),

-- Xoài Cát Chu
(2, 'original', 'VND', 38000, '2024-11-01', NULL),
(2, 'selling', 'VND', 55000, '2024-11-01', NULL),

-- Xoài Keo
(3, 'original', 'VND', 28000, '2024-11-01', NULL),
(3, 'selling', 'VND', 42000, '2024-11-01', NULL),

-- Xoài Úc R2E2
(4, 'original', 'VND', 52000, '2024-11-01', NULL),
(4, 'selling', 'VND', 78000, '2024-11-01', NULL),

-- Xoài Thái Lan
(5, 'original', 'VND', 42000, '2024-11-01', NULL),
(5, 'selling', 'VND', 62000, '2024-11-01', NULL),

-- Xoài Tượng
(6, 'original', 'VND', 32000, '2024-11-01', NULL),
(6, 'selling', 'VND', 48000, '2024-11-01', NULL),

-- Giá khuyến mãi (promo) cho một số giống
(1, 'promo', 'VND', 58000, '2024-11-20', '2024-11-30'),
(4, 'promo', 'VND', 69000, '2024-11-15', '2024-11-25');