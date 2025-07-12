#!/bin/bash

# 🚀 Script untuk Menjalankan Stock Opname App
# Script ini akan start Metro bundler dan install app ke Android device/emulator

echo "📱 STOCK OPNAME APP LAUNCHER"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Script ini harus dijalankan dari dalam folder stock-opname-app"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules tidak ditemukan. Menjalankan npm install..."
    npm install
fi

print_step "1. Checking Android device/emulator"

# Check if adb is available
if ! command -v adb &> /dev/null; then
    print_error "ADB tidak ditemukan. Pastikan Android SDK sudah terinstall."
    print_warning "Jalankan setup-android.sh atau tambahkan Android SDK ke PATH"
    exit 1
fi

# Check connected devices
DEVICES=$(adb devices | grep -E "(device|emulator)" | grep -v "List of devices")
if [ -z "$DEVICES" ]; then
    print_error "Tidak ada Android device atau emulator yang terdeteksi"
    echo ""
    echo "Solusi:"
    echo "1. Untuk emulator: Jalankan ./start-emulator.sh"
    echo "2. Untuk device fisik:"
    echo "   - Enable USB Debugging di Settings > Developer Options"
    echo "   - Hubungkan device via USB"
    echo "   - Jalankan: adb devices"
    exit 1
fi

print_status "Device/emulator terdeteksi:"
echo "$DEVICES"

print_step "2. Checking Metro bundler"

# Check if Metro is already running
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Metro bundler sudah berjalan di port 8081"
    read -p "Restart Metro bundler? (y/n): " restart_metro
    if [ "$restart_metro" = "y" ] || [ "$restart_metro" = "Y" ]; then
        print_status "Stopping existing Metro bundler..."
        fuser -k 8081/tcp 2>/dev/null || true
        sleep 2
    fi
fi

print_step "3. Starting Metro bundler"

# Start Metro bundler in background
print_status "Starting Metro bundler..."
npx react-native start --reset-cache > metro.log 2>&1 &
METRO_PID=$!

# Wait for Metro to start
print_status "Waiting for Metro bundler to start..."
sleep 5

# Check if Metro started successfully
if ! kill -0 $METRO_PID 2>/dev/null; then
    print_error "Metro bundler gagal start. Cek metro.log untuk detail error"
    exit 1
fi

if ! lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_error "Metro bundler tidak berjalan di port 8081"
    print_warning "Cek metro.log untuk detail error"
    exit 1
fi

print_status "✅ Metro bundler berjalan di port 8081"

print_step "4. Building and installing app"

# Build and install the app
print_status "Building dan installing Stock Opname app..."
print_warning "Proses ini mungkin memakan waktu beberapa menit untuk build pertama kali"

if npx react-native run-android; then
    echo ""
    print_status "🎉 SUCCESS! Stock Opname app berhasil diinstall dan dijalankan"
    echo ""
    echo "📋 TESTING CHECKLIST:"
    echo "===================="
    echo "✅ App terbuka tanpa crash"
    echo "✅ Tambah barang baru"
    echo "✅ Edit barang existing"
    echo "✅ Hapus barang"
    echo "✅ Search functionality"
    echo "✅ Export ke CSV"
    echo "✅ Share CSV file"
    echo ""
    print_status "App logs: npx react-native log-android"
    print_status "Metro logs: tail -f metro.log"
else
    print_error "Gagal build atau install app"
    echo ""
    echo "🔧 TROUBLESHOOTING:"
    echo "=================="
    echo "1. Cek device/emulator masih terhubung: adb devices"
    echo "2. Restart Metro: fuser -k 8081/tcp && npx react-native start"
    echo "3. Clean build: cd android && ./gradlew clean && cd .."
    echo "4. Cek logs: npx react-native log-android"
    exit 1
fi

print_step "5. Monitoring"

echo ""
print_status "App sedang berjalan. Monitoring logs..."
print_warning "Tekan Ctrl+C untuk stop monitoring (app akan tetap berjalan di device)"

# Monitor app logs
trap 'echo -e "\n${YELLOW}[INFO]${NC} Stopping log monitoring. App masih berjalan di device."; exit 0' INT

# Show logs
npx react-native log-android 2>/dev/null || {
    print_warning "Tidak bisa menampilkan logs. App tetap berjalan di device."
    echo ""
    print_status "Untuk melihat logs manual: npx react-native log-android"
    print_status "Untuk stop Metro: fuser -k 8081/tcp"
}
