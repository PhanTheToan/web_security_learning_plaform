#!/bin/bash

cleanup() {
    echo "Đang tắt các tiến trình..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID
        echo "Đã tắt Backend (PID: $BACKEND_PID)"
    fi
    exit
}

trap cleanup EXIT INT TERM

echo "--- KHỞI ĐỘNG HỆ THỐNG ---"

cd ../../backend/backend
mvn spring-boot:run &
BACKEND_PID=$! # Lưu lại PID của tiến trình vừa chạy
echo "Backend đang chạy với PID: $BACKEND_PID"

cd ../../frontend/lockbyte-ui
echo "Đang khởi động Frontend..."
npm run dev

