# 🚀 CARA MENJALANKAN APLIKASI STOCK OPNAME - SUPER MUDAH!

## 📋 RINGKASAN SINGKAT

Aplikasi Stock Opname Android sudah siap! Ikuti 3 langkah mudah ini:

### 🔧 LANGKAH 1: SETUP ANDROID (Sekali saja)
```bash
cd stock-opname-app
./setup-android.sh
```

### 📱 LANGKAH 2: START EMULATOR
```bash
./start-emulator.sh
```

### 🚀 LANGKAH 3: JALANKAN APP
```bash
./run-app.sh
```

---

## 📖 PENJELASAN DETAIL

### 🎯 OPSI A: OTOMATIS (RECOMMENDED)

#### 1️⃣ Setup Android Development Environment
```bash
cd stock-opname-app
./setup-android.sh
```

**Apa yang dilakukan script ini:**
- ✅ Install Java JDK
- ✅ Download Android SDK
- ✅ Setup environment variables
- ✅ Install Android platform tools
- ✅ Buat Android Virtual Device (emulator)

**Setelah selesai:** Restart terminal atau jalankan `source ~/.bashrc`

#### 2️⃣ Start Android Emulator
```bash
./start-emulator.sh
```

**Script ini akan:**
- 📱 Tampilkan daftar emulator yang tersedia
- 🚀 Start emulator yang dipilih
- ⏳ Tunggu hingga emulator siap (2-5 menit)

#### 3️⃣ Jalankan Aplikasi
```bash
./run-app.sh
```

**Script ini akan:**
- 🔍 Cek device/emulator terhubung
- 📦 Start Metro bundler
- 🏗️ Build dan install aplikasi
- 📱 Buka aplikasi di emulator
- 📊 Tampilkan logs aplikasi

---

### 🎯 OPSI B: MANUAL

#### Jika Anda sudah punya Android Studio:

1. **Buka Android Studio**
2. **Buat/Start AVD (Android Virtual Device)**
3. **Jalankan commands:**
```bash
cd stock-opname-app

# Terminal 1 - Start Metro
npx react-native start

# Terminal 2 - Install App
npx react-native run-android
```

---

## 🔧 TROUBLESHOOTING

### ❌ Problem: "adb not found"
**Solusi:**
```bash
# Jalankan setup script
./setup-android.sh

# Atau manual setup environment
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### ❌ Problem: "No emulators found"
**Solusi:**
```bash
# Start emulator dengan script
./start-emulator.sh

# Atau manual dengan Android Studio
# 1. Buka Android Studio
# 2. Tools → AVD Manager
# 3. Create/Start Virtual Device
```

### ❌ Problem: "Failed to install app"
**Solusi:**
```bash
# Clean dan restart
fuser -k 8081/tcp
cd android && ./gradlew clean && cd ..
npx react-native start --reset-cache
npx react-native run-android
```

### ❌ Problem: "Metro bundler error"
**Solusi:**
```bash
# Reset Metro cache
npx react-native start --reset-cache

# Atau kill existing Metro
fuser -k 8081/tcp
```

---

## 📱 TESTING APLIKASI

Setelah app berhasil jalan, test fitur-fitur ini:

### ✅ Basic Functions
1. **Home Screen** - Lihat daftar barang (kosong di awal)
2. **Navigation** - Tap tombol "Tambah" dan "Export"

### ✅ CRUD Operations
1. **Tambah Barang:**
   - Tap "Tambah" → Isi form → Tap "Simpan"
   - Cek barang muncul di home screen

2. **Edit Barang:**
   - Tap salah satu item di list
   - Edit data → Tap "Update"

3. **Hapus Barang:**
   - Tap icon 🗑️ di item
   - Konfirmasi hapus

4. **Search:**
   - Ketik di search bar
   - Cek hasil pencarian

### ✅ CSV Export
1. **Export Data:**
   - Tap "Export" → "Export & Share CSV"
   - Pilih aplikasi untuk share (WhatsApp, Email, dll)

2. **File Management:**
   - Lihat file yang sudah di-export
   - Hapus file lama jika perlu

### ✅ Advanced Features
1. **Low Stock Warning:**
   - Tambah barang dengan stok < min_stock
   - Cek warning merah muncul

2. **Data Persistence:**
   - Close app → Reopen
   - Cek data masih tersimpan

---

## 🎯 QUICK COMMANDS

```bash
# Setup (sekali saja)
./setup-android.sh

# Start emulator
./start-emulator.sh

# Run app
./run-app.sh

# View logs
npx react-native log-android

# Stop Metro
fuser -k 8081/tcp

# Clean build
cd android && ./gradlew clean && cd ..
```

---

## 📞 BANTUAN

### Cek Status Setup:
```bash
node test-setup.js
```

### Cek Android Environment:
```bash
adb devices          # Cek device terhubung
emulator -list-avds  # List emulator tersedia
java -version        # Cek Java terinstall
```

### Reset Everything:
```bash
# Kill semua proses
fuser -k 8081/tcp

# Clean project
cd android && ./gradlew clean && cd ..
rm -rf node_modules && npm install

# Restart dari awal
./start-emulator.sh
./run-app.sh
```

---

## 🎉 SELAMAT!

Jika semua langkah berhasil, Anda sekarang memiliki:

✅ **Aplikasi Stock Opname Android** yang berfungsi penuh  
✅ **Database SQLite** untuk menyimpan data  
✅ **Export CSV** untuk backup data  
✅ **UI Modern** dengan fitur lengkap  

**Aplikasi siap digunakan untuk manajemen stok barang! 📦📱**

---

## 📋 FITUR APLIKASI

- 📝 **CRUD Operations** - Tambah, Edit, Hapus barang
- 🔍 **Search** - Cari barang berdasarkan nama/kode/kategori  
- ⚠️ **Low Stock Warning** - Peringatan stok rendah
- 📊 **CSV Export** - Export data ke file CSV
- 📤 **Share** - Bagikan file via WhatsApp, Email, dll
- 💾 **Data Persistence** - Data tersimpan permanen
- 🎨 **Modern UI** - Interface bersih dan user-friendly
