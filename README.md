# Nền tảng Học tập An ninh Web

Chào mừng bạn đến với Nền tảng Học tập An ninh Web. Đây là một ứng dụng web full-stack được thiết kế để cung cấp một môi trường tương tác cho việc học các khái niệm về an ninh web. Dự án bao gồm một backend được xây dựng bằng Java/Spring Boot và một frontend hiện đại sử dụng Next.js/TypeScript.

## Công nghệ chính

- **Backend**: Java 17, Spring Boot, Maven
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Cơ sở dữ liệu**: MySQL
- **Quản lý phụ thuộc**: Maven (Backend), Npm (Frontend)

## Yêu cầu hệ thống

Để cài đặt và chạy dự án này cục bộ, bạn cần cài đặt các phần mềm sau trên máy của mình.

- **Java Development Kit (JDK)**: Phiên bản 17 hoặc mới hơn.
- **Maven**: Để quản lý các phụ thuộc và xây dựng dự án backend.
- **Node.js**: Phiên bản 22.x hoặc mới hơn (khuyến nghị phiên bản LTS mới nhất).
- **Npm**: Trình quản lý gói cho Node.js.
- **MySQL**: Phiên bản 8.0 hoặc mới hơn. Bạn có thể cài đặt trực tiếp hoặc sử dụng Docker.
- **Docker**: Sử dụng để tạo ra các Lab.
---

## Hướng dẫn Cài đặt và Chạy

Thực hiện theo các bước sau để thiết lập môi trường phát triển của bạn.

### 1. Thiết lập Cơ sở dữ liệu

Bạn cần một máy chủ MySQL đang chạy. Backend được cấu hình để kết nối với cơ sở dữ liệu có tên `web_security_db`.

**a) Tạo cơ sở dữ liệu:**
   - Kết nối với máy chủ MySQL của bạn.
   - Sử dụng câu lệnh SQL để tạo cơ sở dữ liệu:
   ```
   mysql -u [TÊN_NGƯỜI_DÙNG] -p web_security_db < Database/backup_full.sql
   ```

**b) Khôi phục dữ liệu:**
   - Sử dụng một công cụ MySQL client (như MySQL Workbench, DBeaver, hoặc dòng lệnh `mysql`) để nhập dữ liệu từ tệp sao lưu.
   - Tệp sao lưu được đặt tại: `Database/backup_full.sql`.
   - Lệnh ví dụ sử dụng dòng lệnh:
     ```bash
     mysql -u [TÊN_NGƯỜI_DÙNG] -p web_security_db < Database/backup_full.sql
     ```
   - Thay `[TÊN_NGƯỜI_DÙNG]` bằng tên người dùng MySQL của bạn và nhập mật khẩu khi được yêu cầu.

### 2. Thiết lập Backend

Backend là một ứng dụng Spring Boot.

**a) Cấu hình:**
   - Mở tệp cấu hình: `backend/backend/src/main/resources/application.properties`.
   - Cập nhật các thuộc tính sau để khớp với cấu hình MySQL của bạn:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/web_security_db?useSSL=false
     spring.datasource.username=[TÊN_NGƯỜI_DÙNG_DB_CỦA_BẠN]
     spring.datasource.password=[MẬT_KHẨU_DB_CỦA_BẠN]
     ```
   - **Lưu ý**: Tệp này cũng chứa các khóa API cho các dịch vụ khác như Cloudflare R2 và email (Spring Mail). Để các tính năng đó hoạt động đầy đủ, bạn cần cung cấp các thông tin xác thực của riêng mình.

**b) Chạy Backend:**
   - Điều hướng đến thư mục gốc của backend:
     ```bash
     cd backend/backend
     ```
   - Chạy ứng dụng bằng Maven:
     ```bash
     mvn spring-boot:run
     ```
   - Máy chủ backend sẽ khởi động trên `http://localhost:8082`.

### 3. Thiết lập Frontend

Frontend là một ứng dụng Next.js.

**a) Cài đặt phụ thuộc:**
   - Điều hướng đến thư mục gốc của frontend:
     ```bash
     cd frontend/lockbyte-ui
     ```
   - Cài đặt tất cả các gói cần thiết bằng npm:
     ```bash
     npm install
     ```

**b) Chạy Frontend:**
   - Sau khi cài đặt xong, khởi động máy chủ phát triển:
     ```bash
     npm run dev
     ```
   - Giao diện người dùng sẽ có sẵn tại `http://localhost:3000`.

---

## Truy cập Ứng dụng

Sau khi cả backend và frontend đều đang chạy, bạn có thể truy cập nền tảng học tập bằng cách mở trình duyệt và truy cập:

- **URL**: [http://localhost:3000](http://localhost:3000)

Chúc bạn học tập vui vẻ!
