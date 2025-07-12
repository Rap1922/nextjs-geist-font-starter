#!/bin/bash

# 🚀 Script untuk Start Android Emulator
# Jalankan script ini untuk memulai emulator Android

echo "📱 STARTING ANDROID EMULATOR"
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

# Check if Android SDK is installed
ANDROID_HOME="$HOME/Android/Sdk"
if [ ! -d "$ANDROID_HOME" ]; then
    print_error "Android SDK tidak ditemukan di $ANDROID_HOME"
    print_warning "Jalankan setup-android.sh terlebih dahulu"
    exit 1
fi

# Check if emulator exists
EMULATOR_PATH="$ANDROID_HOME/emulator/emulator"
if [ ! -f "$EMULATOR_PATH" ]; then
    print_error "Android Emulator tidak ditemukan"
    print_warning "Pastikan Android SDK sudah terinstall dengan benar"
    exit 1
fi

# List available AVDs
print_status "Mencari Android Virtual Devices..."
AVD_LIST=$("$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" list avd 2>/dev/null | grep "Name:" | sed 's/.*Name: //')

if [ -z "$AVD_LIST" ]; then
    print_error "Tidak ada AVD yang tersedia"
    print_warning "Buat AVD terlebih dahulu dengan Android Studio atau jalankan setup-android.sh"
    exit 1
fi

echo ""
echo "📋 Available Android Virtual Devices:"
echo "====================================="
i=1
declare -a avd_array
while IFS= read -r line; do
    echo "$i. $line"
    avd_array[$i]="$line"
    ((i++))
done <<< "$AVD_LIST"

echo ""
echo "0. Buat AVD baru (buka Android Studio)"
echo ""

# Ask user to select AVD
read -p "Pilih AVD (1-$((i-1)), atau 0 untuk buat baru): " choice

if [ "$choice" = "0" ]; then
    print_status "Membuka Android Studio untuk membuat AVD baru..."
    if command -v studio &> /dev/null; then
        studio &
    elif command -v android-studio &> /dev/null; then
        android-studio &
    else
        print_warning "Android Studio tidak ditemukan di PATH"
        print_status "Buka Android Studio manual dan buat AVD baru"
    fi
    exit 0
fi

# Validate choice
if ! [[ "$choice" =~ ^[1-9][0-9]*$ ]] || [ "$choice" -gt $((i-1)) ]; then
    print_error "Pilihan tidak valid"
    exit 1
fi

# Get selected AVD name
SELECTED_AVD="${avd_array[$choice]}"
print_status "Starting emulator: $SELECTED_AVD"

# Check if emulator is already running
if pgrep -f "emulator.*$SELECTED_AVD" > /dev/null; then
    print_warning "Emulator '$SELECTED_AVD' sudah berjalan"
    exit 0
fi

# Start emulator
print_status "Memulai emulator... (ini mungkin memakan waktu beberapa menit)"
print_warning "Jangan tutup terminal ini selama emulator berjalan"

# Start emulator in background but keep script running
"$EMULATOR_PATH" -avd "$SELECTED_AVD" -no-snapshot-save -no-boot-anim &
EMULATOR_PID=$!

echo ""
print_status "Emulator sedang starting... PID: $EMULATOR_PID"
print_status "Tunggu hingga emulator selesai booting (biasanya 2-5 menit)"
print_status "Setelah emulator siap, jalankan: ./run-app.sh"

# Wait for emulator to be ready
print_status "Menunggu emulator siap..."
timeout=300  # 5 minutes timeout
elapsed=0

while [ $elapsed -lt $timeout ]; do
    if adb devices 2>/dev/null | grep -q "emulator.*device"; then
        echo ""
        print_status "✅ Emulator siap! Device terdeteksi:"
        adb devices | grep "emulator.*device"
        echo ""
        print_status "🚀 Sekarang Anda bisa menjalankan aplikasi dengan: ./run-app.sh"
        break
    fi
    
    # Show progress
    if [ $((elapsed % 10)) -eq 0 ]; then
        echo -n "."
    fi
    
    sleep 2
    elapsed=$((elapsed + 2))
done

if [ $elapsed -ge $timeout ]; then
    print_warning "Timeout menunggu emulator. Emulator mungkin masih booting."
    print_status "Cek status dengan: adb devices"
fi

# Keep script running to show emulator status
echo ""
print_status "Emulator berjalan di background. Tekan Ctrl+C untuk keluar dari monitoring."
print_warning "JANGAN tutup terminal ini jika ingin emulator tetap berjalan"

# Monitor emulator
while kill -0 $EMULATOR_PID 2>/dev/null; do
    sleep 5
done

print_warning "Emulator telah berhenti"
