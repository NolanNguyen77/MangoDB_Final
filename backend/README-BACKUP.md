# 🔐 Database Backup & Recovery Guide

## 📋 Tổng quan

Dự án hỗ trợ 2 phương pháp backup:
1. **Manual Backup** - Backup thủ công bằng pg_dump
2. **AWS S3 Backup** - Tự động backup lên cloud (khuyến nghị)

---

## 🚀 Setup AWS S3 Backup

### Bước 1: Tạo S3 Bucket

1. Đăng nhập [AWS Console](https://console.aws.amazon.com/)
2. Vào **S3** → **Create bucket**
3. Đặt tên: `mango-db-backups` (hoặc tên khác)
4. Region: `ap-southeast-1` (Singapore)
5. Block all public access: **Enabled**
6. Click **Create bucket**

### Bước 2: Tạo IAM User cho backup

1. Vào **IAM** → **Users** → **Create user**
2. Tên: `mango-backup-user`
3. Attach policy: `AmazonS3FullAccess` (hoặc tạo custom policy)
4. Tạo **Access Key** → Lưu lại:
   - Access Key ID
   - Secret Access Key

### Bước 3: Cấu hình .env

Mở file `backend/.env` và thêm:

```env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_S3_BUCKET=mango-db-backups
```

### Bước 4: Cài đặt AWS SDK

```bash
cd backend
npm install @aws-sdk/client-s3
```

---

## 💾 Cách sử dụng

### 1. Backup Database

```bash
cd backend
npm run backup
```

Script sẽ:
- Dump database thành file `.sql`
- Upload lên S3 bucket
- Tự động xóa backup cũ hơn 7 ngày

### 2. Restore Database

```bash
cd backend
npm run restore
```

Script sẽ:
- Hiển thị danh sách backup có sẵn trên S3
- Cho phép chọn backup muốn restore
- Download và restore vào database

### 3. Backup thủ công (không cần AWS)

```bash
# Backup
pg_dump -h localhost -U postgres -d MangoDB -F p -f backup.sql

# Restore
psql -h localhost -U postgres -d MangoDB -f backup.sql
```

---

## ⏰ Tự động backup định kỳ

### Windows (Task Scheduler)

1. Mở **Task Scheduler**
2. Create Basic Task:
   - Name: `Mango DB Backup`
   - Trigger: Daily at 2:00 AM
   - Action: Start a program
   - Program: `node`
   - Arguments: `C:\path\to\backend\scripts\backup-db.js`
   - Start in: `C:\path\to\backend`

### Linux/Mac (Cron)

```bash
# Mở crontab
crontab -e

# Thêm dòng này (backup mỗi ngày lúc 2:00 AM)
0 2 * * * cd /path/to/backend && node scripts/backup-db.js
```

---

## 📊 Best Practices

### Backup Strategy (3-2-1 Rule)

- **3** copies: Original + 2 backups
- **2** different media: Local + Cloud (S3)
- **1** offsite: S3 (different region nếu có thể)

### Retention Policy

- **Daily backups**: Giữ 7 ngày
- **Weekly backups**: Giữ 4 tuần
- **Monthly backups**: Giữ 12 tháng

### Testing

- Test restore **ít nhất 1 tháng 1 lần**
- Verify backup integrity
- Document restore procedure

---

## 🔒 Security

1. **Encrypt backups**: Enable S3 encryption (AES-256)
2. **IAM permissions**: Chỉ cấp quyền cần thiết
3. **Access logs**: Enable S3 access logging
4. **Versioning**: Enable S3 versioning để tránh mất dữ liệu

---

## 💰 Chi phí AWS (ước tính)

**S3 Storage:**
- Backup size: ~1 MB/backup
- 30 backups/tháng: ~30 MB
- Chi phí: **< $0.01/tháng** (gần như free)

**S3 Requests:**
- PUT: 30 requests/tháng
- GET: ~5 requests/tháng
- Chi phí: **< $0.01/tháng**

**Tổng: < $1/tháng** (rất rẻ!)

---

## 🆘 Troubleshooting

### Lỗi: "pg_dump: command not found"

**Windows:**
```bash
# Thêm PostgreSQL vào PATH
set PATH=%PATH%;C:\Program Files\PostgreSQL\15\bin
```

**Linux/Mac:**
```bash
# Cài đặt postgresql-client
sudo apt install postgresql-client  # Ubuntu/Debian
brew install postgresql              # Mac
```

### Lỗi: "Access Denied" khi upload S3

- Kiểm tra IAM permissions
- Verify Access Key ID và Secret Key
- Kiểm tra bucket name và region

### Lỗi: "Database already exists"

```bash
# Drop database trước khi restore
psql -U postgres -c "DROP DATABASE MangoDB;"
psql -U postgres -c "CREATE DATABASE MangoDB;"
npm run restore
```

---

## 📚 Tài liệu tham khảo

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)

---

## 📞 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Database connection trong `.env`
2. AWS credentials
3. S3 bucket permissions
4. PostgreSQL client tools installed
