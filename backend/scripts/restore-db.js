// =====================================================
// DATABASE RESTORE FROM AWS S3
// =====================================================
// Script khôi phục database từ S3 backup

const { exec } = require('child_process');
const { S3Client, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

// AWS S3 Configuration (optional)
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
const RESTORE_DIR = path.join(__dirname, '../restores');
const BACKUP_DIR = path.join(__dirname, '../backups');

// Tìm psql trên Windows
function findPsql() {
  const possiblePaths = [
    'C:\\Program Files\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\15\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\14\\bin\\psql.exe',
    'C:\\Program Files\\PostgreSQL\\13\\bin\\psql.exe',
    'C:\\Program Files (x86)\\PostgreSQL\\16\\bin\\psql.exe',
    'C:\\Program Files (x86)\\PostgreSQL\\15\\bin\\psql.exe',
  ];

  for (const psqlPath of possiblePaths) {
    if (fs.existsSync(psqlPath)) {
      return `"${psqlPath}"`;
    }
  }

  return 'psql';
}

// Tạo thư mục restore nếu chưa có
if (!fs.existsSync(RESTORE_DIR)) {
  fs.mkdirSync(RESTORE_DIR, { recursive: true });
}

async function listBackups() {
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭');
  console.log('🥭  DATABASE RESTORE  🥭');
  console.log('🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭🥭\n');

  try {
    let backups = [];

    // Kiểm tra local backups trước
    if (fs.existsSync(BACKUP_DIR)) {
      const localFiles = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = fs.statSync(filePath);
          return {
            source: 'local',
            Key: file,
            filePath: filePath,
            Size: stats.size,
            LastModified: stats.mtime,
          };
        })
        .sort((a, b) => b.LastModified - a.LastModified);

      backups = backups.concat(localFiles);
    }

    // Nếu có S3, lấy thêm từ S3
    if (USE_S3) {
      console.log('📋 Đang lấy danh sách backup từ S3...\n');

      const listParams = {
        Bucket: BUCKET_NAME,
        Prefix: 'backups/',
      };

      const data = await s3Client.send(new ListObjectsV2Command(listParams));

      if (data.Contents && data.Contents.length > 0) {
        const s3Backups = data.Contents
          .filter(item => item.Key.endsWith('.sql'))
          .map(item => ({ ...item, source: 's3' }));
        
        backups = backups.concat(s3Backups);
      }
    }

    if (backups.length === 0) {
      console.log('❌ Không tìm thấy backup nào!');
      console.log('   Hãy chạy "npm run backup" để tạo backup.\n');
      process.exit(1);
    }

    // Sort by date
    backups.sort((a, b) => b.LastModified - a.LastModified);

    console.log('📦 Danh sách backup có sẵn:\n');
    backups.forEach((backup, index) => {
      const size = (backup.Size / 1024).toFixed(2);
      const date = backup.LastModified.toLocaleString('vi-VN');
      const fileName = backup.source === 'local' ? backup.Key : backup.Key.replace('backups/', '');
      const source = backup.source === 'local' ? '💾 Local' : '☁️  S3';
      console.log(`   ${index + 1}. ${fileName}`);
      console.log(`      ${source} | Ngày: ${date} | Kích thước: ${size} KB\n`);
    });

    return backups;

  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách backup:', error.message);
    process.exit(1);
  }
}

async function restoreDatabase(backup) {
  try {
    let restoreFilePath;

    // 1. Lấy file backup
    if (backup.source === 'local') {
      console.log(`\n📁 Sử dụng backup local...`);
      restoreFilePath = backup.filePath;
    } else {
      // Download from S3
      const fileName = backup.Key.replace('backups/', '');
      restoreFilePath = path.join(RESTORE_DIR, fileName);

      console.log(`\n📥 Đang download backup từ S3...`);
      const getParams = {
        Bucket: BUCKET_NAME,
        Key: backup.Key,
      };

      const data = await s3Client.send(new GetObjectCommand(getParams));
      const fileStream = fs.createWriteStream(restoreFilePath);
      
      await new Promise((resolve, reject) => {
        data.Body.pipe(fileStream);
        data.Body.on('error', reject);
        fileStream.on('finish', resolve);
      });

      console.log('✅ Download thành công!\n');
    }

    // 2. Restore database using psql
    console.log('🔄 Đang restore database...');
    console.log('⚠️  CHÚ Ý: Database hiện tại sẽ bị ghi đè!\n');

    const psqlPath = findPsql();
    const psqlCommand = `${psqlPath} -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -f "${restoreFilePath}"`;
    
    await new Promise((resolve, reject) => {
      exec(psqlCommand, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });

    console.log('✅ Restore database thành công!\n');

    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    console.log('🎉  RESTORE THÀNH CÔNG!  🎉');
    console.log('🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉\n');

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error('   Chi tiết:', error);
    process.exit(1);
  }
}

async function promptUser(backups) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Chọn số thứ tự backup muốn restore (hoặc 0 để thoát): ', (answer) => {
      rl.close();
      const index = parseInt(answer) - 1;
      if (index >= 0 && index < backups.length) {
        resolve(backups[index]);
      } else {
        console.log('\n👋 Đã hủy restore.');
        process.exit(0);
      }
    });
  });
}

async function main() {
  const backups = await listBackups();
  const selectedBackup = await promptUser(backups);
  await restoreDatabase(selectedBackup);
}

// Chạy restore
main();
