# ☁️ Hướng Dẫn Deploy Mango Management System lên AWS

Chào mừng! Tài liệu này sẽ hướng dẫn bạn từng bước đưa dự án "Xoài" lên mây (AWS Cloud) sử dụng **Amazon Linux 2023** (Hệ điều hành bạn đang dùng).

---

## 🏗️ Phần 1: Tạo Database (AWS RDS)

1.  **Truy cập AWS**: Tìm dịch vụ **RDS** -> Chọn **Create database**.
2.  **Cấu hình**:
    *   **Engine**: `PostgreSQL` (Bản 16.x hoặc 15.x).
    *   **Template**: `Free tier`.
    *   **Settings**: Identifier `mango-db`, Username `postgres`, Password *(Lưu lại)*.
    *   **Connectivity**: Public access `NO`, VPC Security Group `Create new` -> `rds-sg`.
3.  🚀 Bấm **Create database**. -> Đợi `Available` -> Copy **Endpoint**.

---

## 🛡️ Phần 2: Cấp quyền cho EC2 đọc S3 (IAM Role)

1.  Tìm dịch vụ **IAM** -> Chọn **Roles** -> **Create role**.
2.  **Trusted entity**: **AWS service** -> **EC2**.
3.  **Permissions**: Tìm và chọn `AmazonS3ReadOnlyAccess`.
4.  **Name**: `EC2-S3-Access-Role` -> **Create role**.

---

## 💻 Phần 3: Thuê Máy Chủ (AWS EC2)

1.  **EC2 Dashboard** -> **Launch Instance**.
2.  **OS**: **Amazon Linux 2023** (Mặc định).
3.  **Instance Type**: `t2.micro` (Free tier).
4.  **Key Pair**: `keypair-ec2.pem`.
5.  **Advanced details**: Chọn IAM role `EC2-S3-Access-Role`.
6.  **Security Group**: nhớ mở cổng 80 (HTTP), 443 (HTTPS) và 22 (SSH).

---

## 🔗 Phần 4: Kết nối EC2 và RDS

1.  Vào **RDS** -> Chọn `mango-db`.
2.  Bấm vào Security Group (`rds-sg`) -> **Inbound rules**.
3.  Thêm rule: Type `PostgreSQL` (5432) -> Source: Chọn Security Group của EC2.

---

## 🛠️ Phần 5: Cài đặt Môi trường (Amazon Linux 2023)

SSH vào Server:
```bash
ssh -i "keypair-ec2.pem" ec2-user@<IP_EC2>
```

Chạy lần lượt các lệnh sau trên Server:

```bash
# 1. Update & Cài Node.js, Git, Nginx
sudo dnf update -y
sudo dnf install -y nodejs git nginx postgresql15

# 2. Khởi động Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 3. Cài PM2 (Quản lý backend chạy ngầm)
sudo npm install pm2 -g
```

### 📥 Restore Database từ S3 (Tùy chọn)
Nếu bạn có file backup `.sql` trên S3:
```bash
# Tải về (Nhờ IAM Role ở Phần 2)
aws s3 cp s3://ten-bucket/file.sql ./backup.sql

# Nạp vào RDS
psql -h <RDS_ENDPOINT> -U postgres -d postgres -f backup.sql
```

---

## 🚀 Phần 6: Deploy Code

### 1. Backend
```bash
git clone <LINK_GITHUB_REPO> mango-app
cd mango-app/backend
npm install
```

Tạo file `.env`: `nano .env`
```properties
PORT=3000
DB_HOST=<RDS_ENDPOINT>
DB_USER=postgres
DB_PASSWORD=<PASS_RDS>
DB_NAME=postgres
JWT_SECRET=bi-mat
```
Chạy: `pm2 start server.js --name "mango-api"`.

### 2. Frontend
```bash
cd ../  # Ra thư mục gốc mango-app
npm install
export VITE_API_URL=http://<IP_EC2>/api
npm run build
```

---

## 🌐 Phần 7: Cấu hình Nginx (Amazon Linux)

Trên Amazon Linux, chúng ta sửa file config chính hoặc tạo trong `conf.d`. Cách nhanh nhất:

```bash
sudo nano /etc/nginx/conf.d/mango.conf
```

**Nội dung:**
```nginx
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        root /home/ec2-user/mango-app/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

**Kích hoạt:**
```bash
# Sửa file nginx.conf mặ định để nhận config mới (nếu cần)
# Nhưng thường conf.d tự nhận.
sudo systemctl restart nginx
```

> **Lưu ý**: Nếu bị lỗi `403 Forbidden` do quyền truy cập file trên Amazon Linux, hãy chạy lệnh này:
> `namei -om /home/ec2-user/mango-app/dist` (kiểm tra quyền)
> Hoặc cấp quyền rộng rãi (chỉ dùng khi test): `chmod 755 /home/ec2-user`

---

## 🌎 Phần 8: Tên miền & HTTPS

1.  **Route 53**: Trỏ tên miền về IP EC2.
2.  **Cài Certbot (SSL) trên Amazon Linux**:
    ```bash
    sudo dnf install -y python3 augeas-libs
    sudo python3 -m venv /opt/certbot/
    sudo /opt/certbot/bin/pip install --upgrade pip
    sudo /opt/certbot/bin/pip install certbot certbot-nginx
    sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
    
    # Chạy cài đặt SSL
    sudo certbot --nginx
    ```

### 🎉 Chúc mừng! Web của bạn đã Online!
