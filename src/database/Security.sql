DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'qr_reader') THEN
    CREATE ROLE qr_reader LOGIN PASSWORD 'strong_qr_reader_pwd';
  END IF;
END$$;

-- chỉ được SELECT (lưu ý: view phải tồn tại trước)
GRANT SELECT ON agri.v_qr_public TO qr_reader;
-- ... các lệnh REVOKE/GRANT khác cho qr_reader ...

-- role biên tập và admin
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'qr_editor') THEN
    CREATE ROLE qr_editor LOGIN PASSWORD 'strong_qr_editor_pwd';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'qr_admin') THEN
    CREATE ROLE qr_admin LOGIN PASSWORD 'strong_qr_admin_pwd';
  END IF;
END$$;

-- ... các lệnh GRANT cho editor và admin ...

-- user backup
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'backup_user') THEN
    CREATE ROLE backup_user LOGIN PASSWORD 'super_secret';
  END IF;
END$$;

-- editor: đọc chi tiết và được INSERT/UPDATE
GRANT CONNECT ON DATABASE "MangoDB" TO qr_editor;
GRANT USAGE ON SCHEMA agri TO qr_editor;
GRANT SELECT ON agri.v_qr_public TO qr_editor;
GRANT SELECT, INSERT, UPDATE ON agri.qrcode, agri.batch, agri.variety, agri.product, agri.farm TO qr_editor;

-- admin: toàn quyền trên schema agri (cẩn trọng khi dùng ở môi trường prod)
GRANT CONNECT ON DATABASE "MangoDB" TO qr_admin;
GRANT USAGE ON SCHEMA agri TO qr_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA agri TO qr_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA agri TO qr_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA agri GRANT ALL ON TABLES TO qr_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA agri GRANT ALL ON SEQUENCES TO qr_admin;

CREATE ROLE backup_user LOGIN PASSWORD 'super_secret';
GRANT CONNECT ON DATABASE "MangoDB" TO backup_user;
GRANT USAGE ON SCHEMA agri TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA agri TO backup_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA agri TO backup_user; 

-- Và future tables/sequences:
ALTER DEFAULT PRIVILEGES IN SCHEMA agri GRANT SELECT ON TABLES TO backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA agri GRANT SELECT ON SEQUENCES TO backup_user; 
