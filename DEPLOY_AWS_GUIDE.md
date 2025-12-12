# ☁️ Hướng Dẫn Deploy Mango Management System lên AWS

Tài liệu hướng dẫn deploy dự án lên AWS sử dụng **Amazon Linux 2023**.

---

## 🏗️ Phần 1: Tạo Database (AWS RDS)

1.  Vào **AWS Console** -> Tìm **RDS** -> **Create database**.
2.  **Cấu hình**:
    *   **Engine**: `PostgreSQL` (Bản 16.x hoặc 15.x).
    *   **Template**: `Free tier`.
    *   **Settings**: Identifier `mango-db`, Username `postgres`, Password *(Lưu lại)*.
    *   **Connectivity**: Public access `NO`, VPC Security Group -> `Create new` -> `rds-sg`.
3.  🚀 Bấm **Create database** -> Đợi `Available` -> Copy **Endpoint**.

---

## 🛡️ Phần 2: Cấp quyền cho EC2 đọc S3 (IAM Role)

1.  Vào **IAM** -> **Roles** -> **Create role**.
2.  **Trusted entity**: `AWS service` -> `EC2`.
3.  **Permissions**: Tìm và chọn `AmazonS3ReadOnlyAccess`.
4.  **Name**: `EC2-S3-Access-Role` -> **Create role**.

---

## 💻 Phần 3: Thuê Máy Chủ (AWS EC2)

1.  Vào **EC2 Dashboard** -> **Launch Instance**.
2.  **OS**: **Amazon Linux 2023** (Mặc định).
3.  **Instance Type**: `t2.micro` hoặc `t3.micro` (Free tier).
4.  **Key Pair**: Tạo mới hoặc chọn key có sẵn (ví dụ: `keypair-ec2.pem`).
5.  **Network Settings (Security Group)**:
    *   ✅ Allow SSH (port 22) from My IP.
    *   ✅ Allow HTTP (port 80) from the internet.
    *   ✅ Allow HTTPS (port 443) from the internet.
6.  **Advanced details**: Chọn IAM instance profile `EC2-S3-Access-Role`.
7.  **Launch Instance**.

---

## 🔗 Phần 4: Kết nối EC2 và RDS

1.  Vào **RDS** -> Chọn DB `mango-db`.
2.  Bấm vào **VPC security groups** (ví dụ `rds-sg`) -> Tab **Inbound rules**.
3.  **Add rule**:
    *   Type: `PostgreSQL` (Port 5432).
    *   Source: Chọn Security Group của EC2.
4.  **Save rules**.

---

## 🛠️ Phần 5: Cài đặt Môi trường (Amazon Linux 2023)

SSH vào Server từ PowerShell/Terminal:
```bash
ssh -i "keypair-ec2.pem" ec2-user@<PUBLIC_IP_EC2>
```

Chạy các lệnh sau trên Server:

```bash
# 1. Update hệ thống
sudo dnf update -y

# 2. Cài Node.js, Git, Nginx, PostgreSQL Client
sudo dnf install -y nodejs git nginx postgresql15

# 3. Khởi động Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 4. Cài PM2 (Quản lý backend)
sudo npm install pm2 -g
```

---

## 📥 Phần 6: Restore Database từ S3

```bash
# Tải file backup từ S3 (nhờ IAM Role)
aws s3 cp s3://ten-bucket/file-backup.sql ./backup.sql

# Nạp vào RDS (nhập password khi được hỏi)
psql -h <RDS_ENDPOINT> -U postgres -d postgres -f backup.sql
```

---

## 🚀 Phần 7: Deploy Code

### 1. Clone Code
```bash
git clone <LINK_GITHUB_REPO> mango-app
cd mango-app
```

### 2. Cấu hình Backend
```bash
cd backend
npm install
nano .env
```

**Nội dung `.env`:**
```properties
PORT=3001
DB_HOST=<RDS_ENDPOINT>
DB_USER=postgres
DB_PASSWORD=<PASSWORD_RDS>
DB_NAME=postgres
JWT_SECRET=mango-secret-key-change-in-production
```

**⚠️ QUAN TRỌNG: Bật SSL cho kết nối RDS**

Sửa file `db.js`:
```bash
nano db.js
```
Thêm `ssl: { rejectUnauthorized: false }` vào Pool config:
```javascript
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});
```

Làm tương tự với file `seed-admin.js` (cũng có Pool riêng).

**Chạy seed và start server:**
```bash
npm run seed-admin
pm2 start server.js --name "mango-api"
pm2 save
pm2 startup  # Để tự khởi động khi reboot
```

### 3. Build Frontend
```bash
cd ~/mango-app
npm install
export VITE_API_URL=http://<PUBLIC_IP_EC2>/api
npm run build
```

> **Lưu ý**: Vite build ra thư mục `build` (không phải `dist`).

---

## 🌐 Phần 8: Cấu hình Nginx (Amazon Linux)

### 1. Tắt server block mặc định
```bash
sudo nano /etc/nginx/nginx.conf
```
Tìm khối `server { listen 80; ... }` và **comment out** (thêm `#` đầu mỗi dòng).

### 2. Tạo config mới
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
        root /home/ec2-user/mango-app/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### 3. Cấp quyền và restart
```bash
chmod 755 /home/ec2-user
chmod -R 755 /home/ec2-user/mango-app/build
sudo systemctl restart nginx
```

---

## 🌎 Phần 9: Tên miền với Route 53 (Tùy chọn)

### 1. Đăng ký Domain trên Route 53
1.  Vào **AWS Console** -> Tìm **Route 53**.
2.  Chọn **Registered domains** (bên trái) -> **Register domain**.
3.  Gõ tên miền bạn muốn (ví dụ: `mango-system.com`) -> **Check** xem còn trống không.
4.  Nếu còn -> **Add to cart** -> **Continue**.
5.  Điền thông tin liên hệ -> **Continue**.
6.  Xác nhận thanh toán -> **Complete Order**.
7.  Đợi AWS xác minh (thường 15 phút - 24 giờ).

> **Chi phí tham khảo**: `.com` ~$12/năm, `.net` ~$11/năm.

### 2. Tạo Hosted Zone (Nếu dùng domain mua ở nơi khác)
Khi bạn đăng ký domain trên Route 53, AWS tự động tạo Hosted Zone. Nếu dùng domain mua ở nơi khác:
1.  Vào **Route 53** -> **Hosted zones** -> **Create hosted zone**.
2.  **Domain name**: Nhập tên miền của bạn.
3.  **Type**: `Public hosted zone`.
4.  **Create**.
5.  AWS sẽ cung cấp 4 **Name Servers (NS)**. Copy chúng về nhà cung cấp domain để trỏ về Route 53.

### 3. Trỏ Domain về EC2
1.  Vào **Route 53** -> **Hosted zones** -> Chọn tên miền của bạn.
2.  Bấm **Create record**.
3.  **Cấu hình Record chính** (root domain):
    *   **Record name**: Để trống (nghĩa là `mango-system.com`).
    *   **Record type**: `A`.
    *   **Value**: Nhập **Public IPv4** của EC2 (ví dụ: `13.251.81.233`).
    *   **TTL**: `300`.
    *   Bấm **Create records**.
4.  **(Tùy chọn) Tạo thêm record cho `www`**:
    *   **Record name**: `www`.
    *   **Record type**: `A`.
    *   **Value**: Cùng IP EC2.
    *   Bấm **Create records**.

### 4. Cập nhật Nginx với Domain
SSH vào EC2 và sửa file config:
```bash
sudo nano /etc/nginx/conf.d/mango.conf
```

Thay dòng `server_name _;` thành:
```nginx
server_name mango-system.com www.mango-system.com;
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### 5. Rebuild Frontend với Domain mới
```bash
cd ~/mango-app
export VITE_API_URL=http://mango-system.com/api
npm run build
sudo systemctl restart nginx
```

---

## 🔒 Phần 10: Cài SSL/HTTPS với Certbot (Amazon Linux)

### 1. Cài đặt Certbot
```bash
sudo dnf install -y python3 augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```

### 2. Chạy Certbot
```bash
sudo certbot --nginx -d mango-system.com -d www.mango-system.com
```

*   Nhập email của bạn.
*   Chọn `Y` để đồng ý Terms of Service.
*   Certbot sẽ hỏi có muốn redirect HTTP -> HTTPS không -> Chọn **2 (Redirect)**.

### 3. Tự động gia hạn SSL
Certbot tự động gia hạn, nhưng để chắc chắn:
```bash
echo "0 0,12 * * * root /opt/certbot/bin/python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

### 4. Rebuild Frontend với HTTPS
```bash
cd ~/mango-app
export VITE_API_URL=https://mango-system.com/api
npm run build
sudo systemctl restart nginx
```

---

## ✅ Hoàn tất!

Truy cập: `https://mango-system.com` (hoặc `http://<PUBLIC_IP_EC2>` nếu chưa có domain)
Đăng nhập: `admin@mango.com` / `admin123`

🥭 Chúc mừng bạn đã deploy thành công!
