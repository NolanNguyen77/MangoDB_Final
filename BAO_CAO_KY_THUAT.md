# CÁC DỊCH VỤ AWS SỬ DỤNG TRONG DỰ ÁN

---

## 1. KIẾN TRÚC TỔNG QUAN

```
Internet → EC2 (Web Server) → RDS (PostgreSQL)
                                    ↓
                              S3 (Backups)
```

### AWS Services

**Amazon RDS (Relational Database Service)**
- Database PostgreSQL được quản lý tự động
- Instance: db.t3.micro (1 vCPU, 1GB RAM)
- Tự động backup, patch, monitoring

**Amazon S3 (Simple Storage Service)**
- Lưu trữ backup database
- Durability: 99.999999999%
- Encryption: AES-256

**Amazon EC2 (Elastic Compute Cloud)**
- Máy chủ chạy ứng dụng
- Instance: t2.micro (1 vCPU, 1GB RAM)

**AWS IAM (Identity and Access Management)**
- Quản lý quyền truy cập giữa EC2 và S3

---

## 2. BACKUP & RECOVERY

### Công nghệ

**PostgreSQL Tools**
- `pg_dump`: Export database thành file SQL
- `psql`: Import file SQL vào database

**AWS S3 + SDK**
- Upload/download backup files
- Versioning enabled (tránh mất dữ liệu)
- Lifecycle policy tự động xóa backup cũ

### Backup Strategy - 3-2-1 Rule

**3 copies:**
- Original: Database trên RDS
- Backup 1: File local trên EC2
- Backup 2: File trên S3 cloud

**2 media:**
- Local storage (EC2 disk)
- Cloud storage (S3)

**1 offsite:**
- S3 bucket ở region khác (Singapore)

### Retention Policy

- Daily backups: Giữ 7 ngày
- Weekly backups: Giữ 4 tuần
- Monthly backups: Giữ 12 tháng

### Tự động hóa

- Task Scheduler (Windows) / Cron (Linux)
- Backup tự động 2:00 AM hàng ngày
- Tự động xóa backup cũ theo retention policy

---

## 3. DEPLOYMENT

### Tổng quan

**EC2 Instance**
- Chạy Nginx (web server) + Node.js (backend)
- PM2 process manager (auto-restart, monitoring)
- Kết nối RDS qua SSL/TLS

**RDS Database**
- PostgreSQL 15/16
- Private subnet (không public access)
- Automated daily backups

**S3 Storage**
- Lưu trữ backup files
- Chi phí: < $1/tháng

### Chi phí

**Free Tier (12 tháng đầu):** $0

**Sau Free Tier:**
- EC2: ~$8.5/tháng
- RDS: ~$15/tháng
- S3: < $1/tháng
- **Tổng: ~$20-25/tháng**

---

## KẾT LUẬN

### Ưu điểm

**Reliability:** RDS automated backups, S3 durability 99.999999999%

**Scalability:** Dễ dàng scale database và storage

**Cost-effective:** Free tier 12 tháng, chi phí thấp sau đó

### Best Practices

✅ 3-2-1 Backup strategy  
✅ Automated backups với retention policy  
✅ Cloud storage với high durability  
✅ Tự động hóa backup hàng ngày
