// =====================================================
// DATABASE BACKUP TO AWS S3
// =====================================================
// Script tự động backup PostgreSQL database lên S3

const { exec } = require('child_process');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// AWS S3 Configuration (optional - chỉ cần nếu muốn upload lên S3)
const USE_S3 = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
let s3Client;

if (USE_S3) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'mango-db-backups';
const BACKUP_DIR = path.join(__dirname, '../backups');

// Tìm pg_dump trên Windows
function findPgDump() {
  const possiblePaths = [
    'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe',
    'C:\\Program Files\\PostgreSQL\\14\\bin\\pg_dump.exe',
    'C:\\Program Files\\PostgreSQL\\13\\bin\\pg_dump.exe',
    'C:\\Program Files (x86)\\PostgreSQL\\16\\bin\\pg_dump.exe',
    'C:\\Program Files (x86)\\PostgreSQL\\15\\bin\\pg_dump.exe',
  ];

  for (const pgPath of possiblePaths) {
    if (fs.existsSync(pgPath)) {
      return `"${pgPath}"`;
    }
  }

  // Nếu không tìm thấy, thử dùng pg_dump từ PATH
  return 'pg_dump';
}

// Tạo thư mục backup nếu chưa có
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupDatabase() {
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭');
  console.log('🥭  DATABASE BACKUP  🥭');
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `mangodb-backup-${timestamp}.sql`;
  const backupFilePath = path.join(BACKUP_DIR, backupFileName);

  try {
    // 1. Dump database using pg_dump (dùng stdout để tránh lỗi Unicode path)
    console.log('📦 Đang backup database...');
    const pgDumpPath = findPgDump();
    console.log(`   Sử dụng: ${pgDumpPath}\n`);
    
    const pgDumpCommand = `${pgDumpPath} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -F p`;
    
    const dumpData = await new Promise((resolve, reject) => {
      exec(pgDumpCommand, { 
        env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD },
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer
        encoding: 'utf8'
      }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    // Ghi vào file
    fs.writeFileSync(backupFilePath, dumpData, 'utf8');

    const fileSize = (fs.statSync(backupFilePath).size / 1024).toFixed(2);
    console.log(`✅ Backup thành công! (${fileSize} KB)`);
    console.log(`   File: ${backupFileName}`);
    console.log(`   Path: ${backupFilePath}\n`);

    // 2. Upload to S3 (optional)
    if (USE_S3) {
      console.log('☁️  Đang upload lên AWS S3...');
      const fileContent = fs.readFileSync(backupFilePath);
      
      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `backups/${backupFileName}`,
        Body: fileContent,
        ContentType: 'application/sql',
        Metadata: {
          'backup-date': new Date().toISOString(),
          'database': process.env.DB_NAME,
        },
      };

      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('✅ Upload lên S3 thành công!');
      console.log(`   Bucket: ${BUCKET_NAME}`);
      console.log(`   Key: backups/${backupFileName}\n`);
    } else {
      console.log('ℹ️  Bỏ qua upload S3 (chưa cấu hình AWS credentials)\n');
    }

    // 3. Cleanup local backup (optional - giữ 7 ngày gần nhất)
    console.log('🧹 Đang dọn dẹp backup cũ...');
    cleanupOldBackups(7);
    console.log('✅ Hoàn tất!\n');

    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    console.log('🎉  BACKUP THÀNH CÔNG!  🎉');
    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n');
    console.log(`📁 Backup được lưu tại: ${backupFilePath}\n`);

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error('   Chi tiết:', error);
    process.exit(1);
  }
}

function cleanupOldBackups(daysToKeep) {
  const files = fs.readdirSync(BACKUP_DIR);
  const now = Date.now();
  const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

  files.forEach(file => {
    const filePath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`   Đã xóa: ${file}`);
    }
  });
}

// Chạy backup
backupDatabase();
