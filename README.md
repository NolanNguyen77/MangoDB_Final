# Thiết lập database
  Thay đổi mục .env trong mục backend khớp với thông tin pgAdmin4
  Chạy các file sql ở mục src/database vào pgAdmin4 theo thứ tự:
  -> Table.sql -> InsertData.sql -> Auth.sql -> Security.sql

  ***Sau đó chạy "npm run seed-admin" ở mục backend để tạo admin***


### Cần chạy cùng lúc frontend và backend ở cả 2 terminal
# Cách chạy frontend
  Ở thư mục gốc chạy "npm i"
  Sau đó "npm run dev"
# Cách chạy backend
  Mở terminal thứ 2
  "cd backend" nếu chưa vào mục backend
  "npm i"
  "npm run dev"
# Tài khoản đăng nhập trên UI
  Email/Username: admin@mango.com
  Password: admin123