-- =====================================================
-- AUTH SCHEMA - MANGO MANAGEMENT
-- =====================================================
-- Auth schema and RBAC tables for JWT login

-- 1) Schema
CREATE SCHEMA IF NOT EXISTS auth;

-- 2) Users table
CREATE TABLE IF NOT EXISTS auth.users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Roles table
CREATE TABLE IF NOT EXISTS auth.roles (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 4) User-Roles mapping
CREATE TABLE IF NOT EXISTS auth.user_roles (
  user_id INTEGER NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- 5) Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON auth.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON auth.user_roles(role_id);

-- 6) Seed base roles (idempotent)
INSERT INTO auth.roles(name)
SELECT r FROM (VALUES ('reader'), ('editor'), ('admin')) AS t(r)
WHERE NOT EXISTS (SELECT 1 FROM auth.roles WHERE name = t.r);

-- =====================================================
-- SEED ADMIN USER
-- =====================================================
-- Password: admin123
-- bcrypt hash: $2b$10$YourHashHere (will be generated via Node.js script)

-- NOTE: Run the Node.js script `/backend/seed-admin.js` to create admin user
-- Or manually insert after generating bcrypt hash:
-- 
-- INSERT INTO auth.users(email, password_hash) 
-- VALUES ('admin@mangomanagement.com', '$2b$10$...')
-- ON CONFLICT (email) DO NOTHING;

-- INSERT INTO auth.user_roles(user_id, role_id)
-- SELECT u.id, r.id FROM auth.users u, auth.roles r
-- WHERE u.email='admin@mangomanagement.com' AND r.name='admin'
-- ON CONFLICT DO NOTHING;

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Get user with roles
-- SELECT u.*, array_agg(r.name) as roles
-- FROM auth.users u
-- LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
-- LEFT JOIN auth.roles r ON ur.role_id = r.id
-- WHERE u.email = 'admin@mangomanagement.com'
-- GROUP BY u.id;

-- Count users
-- SELECT COUNT(*) FROM auth.users;

-- List all users with roles
-- SELECT u.id, u.email, u.is_active, u.created_at, array_agg(r.name) as roles
-- FROM auth.users u
-- LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
-- LEFT JOIN auth.roles r ON ur.role_id = r.id
-- GROUP BY u.id
-- ORDER BY u.created_at DESC;
