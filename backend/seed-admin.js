// =====================================================
// SEED ADMIN USER - MANGO MANAGEMENT
// =====================================================
// Script để tạo admin user với bcrypt password hash

const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seedAdminUser() {
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭');
  console.log('🥭  SEED ADMIN USER  🥭');
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭\n');

  try {
    // Kiểm tra kết nối database
    await pool.query('SELECT NOW()');
    console.log('✅ Kết nối database thành công!\n');

    // Thông tin admin mặc định
    const adminEmail = 'admin@mango.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;

    console.log('📧 Email admin:', adminEmail);
    console.log('🔑 Password admin:', adminPassword);
    console.log('🔐 Đang hash password...\n');

    // Hash password bằng bcrypt
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
    console.log('✅ Hash password thành công!');
    console.log('   Hash:', passwordHash, '\n');

    // Insert admin user
    console.log('👤 Đang tạo admin user...');
    const userResult = await pool.query(
      `INSERT INTO auth.users(email, password_hash, is_active) 
       VALUES ($1, $2, true) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id, email, created_at`,
      [adminEmail, passwordHash]
    );

    const userId = userResult.rows[0].id;
    console.log('✅ Admin user đã tạo!');
    console.log('   ID:', userId);
    console.log('   Email:', userResult.rows[0].email);
    console.log('   Created:', userResult.rows[0].created_at, '\n');

    // Lấy role admin
    console.log('🔍 Đang tìm role admin...');
    const roleResult = await pool.query(
      `SELECT id FROM auth.roles WHERE name = 'admin'`
    );

    if (roleResult.rows.length === 0) {
      throw new Error('Role admin không tồn tại! Hãy chạy auth_schema.sql trước.');
    }

    const roleId = roleResult.rows[0].id;
    console.log('✅ Role admin tìm thấy! (ID:', roleId, ')\n');

    // Gán role admin cho user
    console.log('👑 Đang gán role admin...');
    await pool.query(
      `INSERT INTO auth.user_roles(user_id, role_id) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      [userId, roleId]
    );
    console.log('✅ Đã gán role admin cho user!\n');

    // Kiểm tra kết quả
    console.log('🔍 Kiểm tra user đã tạo:');
    const checkResult = await pool.query(
      `SELECT u.id, u.email, u.is_active, u.created_at, array_agg(r.name) as roles
       FROM auth.users u
       LEFT JOIN auth.user_roles ur ON u.id = ur.user_id
       LEFT JOIN auth.roles r ON ur.role_id = r.id
       WHERE u.email = $1
       GROUP BY u.id`,
      [adminEmail]
    );

    console.log('   User ID:', checkResult.rows[0].id);
    console.log('   Email:', checkResult.rows[0].email);
    console.log('   Active:', checkResult.rows[0].is_active);
    console.log('   Roles:', checkResult.rows[0].roles);
    console.log('   Created:', checkResult.rows[0].created_at);

    console.log('\n🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    console.log('🎉  THÀNH CÔNG!  🎉');
    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n');

    console.log('📝 THÔNG TIN ĐĂNG NHẬP:');
    console.log('   Email/Username: admin@mango.com');
    console.log('   Password: admin123\n');

    console.log('💡 TIP: Bạn có thể đăng nhập vào Admin Dashboard với thông tin trên!\n');

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error('   Chi tiết:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('👋 Đã đóng kết nối database.\n');
  }
}

// Chạy script
seedAdminUser();
