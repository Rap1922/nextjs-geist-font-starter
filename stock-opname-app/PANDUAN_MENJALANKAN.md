# 📱 PANDUAN LENGKAP MENJALANKAN APLIKASI STOCK OPNAME

## 🚀 LANGKAH 1: PERSIAPAN ENVIRONMENT

### A. Install Android Studio
1. **Download Android Studio** dari: https://developer.android.com/studio
2. **Install Android Studio** dengan semua komponen default
3. **Buka Android Studio** dan ikuti setup wizard
4. **Install Android SDK** (biasanya otomatis terinstall)

### B. Setup Environment Variables
Tambahkan ke file `~/.bashrc` atau `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Kemudian jalankan:
```bash
source ~/.bashrc  # atau source ~/.zshrc
```

### C. Verifikasi Installation
```bash
# Cek apakah adb sudah terinstall
adb version

# Cek Android SDK
android --version
```

## 🔧 LANGKAH 2: SETUP EMULATOR ANDROID

### A. Buat Android Virtual Device (AVD)
1. **Buka Android Studio**
2. **Klik "More Actions" → "Virtual Device Manager"**
3. **Klik "Create Device"**
4. **Pilih device** (contoh: Pixel 4)
5. **Pilih system image** (contoh: API 30 - Android 11)
6. **Download system image** jika belum ada
7. **Klik "Next" → "Finish"**

### B. Start Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator (ganti nama_emulator dengan nama AVD Anda)
emulator -avd nama_emulator
```

**ATAU** start dari Android Studio:
1. Buka Android Studio
2. Klik "Virtual Device Manager"
3. Klik tombol ▶️ pada emulator yang ingin dijalankan

## 📱 LANGKAH 3: MENJALANKAN APLIKASI

### A. Persiapan Project
```bash
# Masuk ke folder project
cd stock-opname-app

# Install dependencies (sudah selesai)
npm install

# Verifikasi setup
node test-setup.js
```

### B. Jalankan Aplikasi
**Terminal 1 - Start Metro Bundler:**
```bash
cd stock-opname-app
npx react-native start
```

**Terminal 2 - Build & Install App:**
```bash
cd stock-opname-app
npx react-native run-android
```

## 🔄 ALTERNATIF: MENGGUNAKAN DEVICE FISIK

### A. Setup Device Android
1. **Enable Developer Options:**
   - Settings → About Phone → Tap "Build Number" 7 kali
2. **Enable USB Debugging:**
   - Settings → Developer Options → USB Debugging (ON)
3. **Connect via USB** ke komputer

### B. Verifikasi Device
```bash
# Cek device terhubung
adb devices

# Harus muncul device dengan status "device"
```

### C. Run App
```bash
# Start Metro
npx react-native start

# Install ke device (terminal baru)
npx react-native run-android
```

## 🛠️ TROUBLESHOOTING

### Problem 1: "adb not found"
**Solusi:**
```bash
# Install Android SDK tools
# Atau tambahkan path Android SDK ke environment variables
export PATH=$PATH:$HOME/Android/Sdk/platform-tools
```

### Problem 2: "No emulators found"
**Solusi:**
1. Buka Android Studio
2. Tools → AVD Manager
3. Create Virtual Device
4. Start emulator sebelum run app

### Problem 3: "Failed to install app"
**Solusi:**
```bash
# Clean project
cd stock-opname-app
npx react-native start --reset-cache

# Clean Android build
cd android
./gradlew clean
cd ..

# Try again
npx react-native run-android
```

### Problem 4: Metro bundler error
**Solusi:**
```bash
# Kill existing Metro processes
npx react-native start --reset-cache

# Atau manual kill
fuser -k 8081/tcp
```

### Problem 5: Build errors
**Solusi:**
```bash
# Update React Native CLI
npm install -g @react-native-community/cli

# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## 📋 TESTING CHECKLIST

Setelah app berhasil jalan, test fitur-fitur berikut:

### ✅ Basic Functions
- [ ] App terbuka tanpa crash
- [ ] Database terbuat otomatis
- [ ] Navigation antar screen berfungsi

### ✅ CRUD Operations
- [ ] **Tambah Barang:** Tap "Tambah" → Isi form → Save
- [ ] **Edit Barang:** Tap item → Edit → Update
- [ ] **Hapus Barang:** Tap 🗑️ → Konfirmasi
- [ ] **Search:** Ketik di search bar

### ✅ CSV Export
- [ ] **Export:** Tap "Export" → "Export & Share CSV"
- [ ] **Share:** Pilih app untuk share (WhatsApp, Email, dll)
- [ ] **File Management:** Lihat dan hapus file exported

### ✅ Advanced Features
- [ ] **Low Stock Warning:** Item dengan stok < min_stock
- [ ] **Pull to Refresh:** Swipe down di home screen
- [ ] **Data Persistence:** Close app → Reopen → Data masih ada

## 🎯 QUICK START COMMANDS

```bash
# 1. Start emulator (jika belum jalan)
emulator -avd Pixel_4_API_30

# 2. Start Metro (Terminal 1)
cd stock-opname-app
npx react-native start

# 3. Install app (Terminal 2)
cd stock-opname-app
npx react-native run-android

# 4. View logs (Terminal 3 - optional)
npx react-native log-android
```

## 📞 BANTUAN TAMBAHAN

Jika masih ada masalah:

1. **Cek React Native Doctor:**
```bash
npx react-native doctor
```

2. **Cek Environment:**
```bash
node test-setup.js
```

3. **Reset Everything:**
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Reset Android build
cd android && ./gradlew clean && cd ..

# Reinstall node_modules
rm -rf node_modules && npm install
```

---

**🎉 Selamat! Aplikasi Stock Opname siap digunakan!**
