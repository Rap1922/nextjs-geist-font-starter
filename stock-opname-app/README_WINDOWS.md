# 🪟 STOCK OPNAME APP - PANDUAN WINDOWS

## 🚀 CARA TERCEPAT (1 KLIK!)

### Untuk Windows yang sudah punya Android Studio:

1. **Double-click** file `run-windows.bat`
2. **Ikuti instruksi** di layar
3. **Selesai!** App akan otomatis install dan jalan

---

## 📋 LANGKAH MANUAL (Jika Batch Script Tidak Jalan)

### 1️⃣ Setup Environment (Sekali Saja)
Buka **Command Prompt as Administrator**:
```cmd
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator"
```
**Restart Command Prompt** setelah ini.

### 2️⃣ Install Dependencies
```cmd
cd stock-opname-app
npm install
```

### 3️⃣ Start Emulator
- Buka **Android Studio**
- **Tools → AVD Manager**
- Klik **▶️** pada emulator
- Tunggu sampai emulator nyala (2-5 menit)

### 4️⃣ Run App
**Command Prompt 1:**
```cmd
cd stock-opname-app
npx react-native start
```

**Command Prompt 2:**
```cmd
cd stock-opname-app
npx react-native run-android
```

---

## 🎯 FITUR APLIKASI

### ✅ Yang Sudah Siap:
- **Database SQLite** - Data tersimpan permanen
- **CRUD Operations** - Tambah, Edit, Hapus, Search barang
- **CSV Export** - Export data ke file CSV
- **Share Function** - Bagikan via WhatsApp, Email, dll
- **Modern UI** - 4 screens dengan design bersih
- **Low Stock Warning** - Peringatan stok rendah
- **Search Function** - Cari berdasarkan nama/kode/kategori

### 📱 Screens:
1. **HomeScreen** - List barang + search + refresh
2. **AddItemScreen** - Form tambah barang baru
3. **EditItemScreen** - Form edit barang existing
4. **ExportScreen** - Export CSV + file management

---

## 🧪 TESTING APP

Setelah app jalan di emulator, test fitur ini:

### Basic Functions:
- [ ] App terbuka tanpa crash
- [ ] Bisa navigate antar screen
- [ ] Database terbuat otomatis

### CRUD Operations:
- [ ] **Tambah Barang**: Tap "Tambah" → Isi form → Save
- [ ] **Edit Barang**: Tap item di list → Edit → Update
- [ ] **Hapus Barang**: Tap 🗑️ → Konfirmasi
- [ ] **Search**: Ketik di search bar

### CSV Export:
- [ ] **Export**: Tap "Export" → "Export & Share CSV"
- [ ] **Share**: Pilih WhatsApp/Email untuk share
- [ ] **File Management**: Lihat dan hapus file exported

### Advanced Features:
- [ ] **Low Stock Warning**: Item dengan stok < min_stock
- [ ] **Data Persistence**: Close app → Reopen → Data masih ada
- [ ] **Pull to Refresh**: Swipe down di home screen

---

## 🛠️ TROUBLESHOOTING

### ❌ "adb is not recognized"
**Solusi:**
1. Buka **System Properties** → **Advanced** → **Environment Variables**
2. Edit **PATH**, tambahkan:
   - `C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools`

### ❌ "No devices found"
**Solusi:**
1. Pastikan emulator sudah running via Android Studio
2. Cek dengan: `adb devices`
3. Harus muncul device dengan status "device"

### ❌ "Metro bundler error"
**Solusi:**
```cmd
taskkill /f /im node.exe
npx react-native start --reset-cache
```

### ❌ "Build failed"
**Solusi:**
```cmd
cd android
gradlew clean
cd ..
npx react-native run-android
```

---

## 📞 BANTUAN CEPAT

### Cek Status:
```cmd
# Cek Node.js
node -v

# Cek Android environment
echo %ANDROID_HOME%
adb version
adb devices

# Cek app setup
node test-setup.js
```

### Reset Jika Error:
```cmd
# Kill Metro
taskkill /f /im node.exe

# Clean project
cd android && gradlew clean && cd ..

# Reinstall dependencies
rmdir /s node_modules
npm install
```

---

## ⏰ ESTIMASI WAKTU

- **Setup environment**: 2 menit (sekali saja)
- **Install dependencies**: 2 menit
- **Start emulator**: 2-5 menit
- **Build & run app**: 3-5 menit

**TOTAL**: ~10-15 menit untuk pertama kali

---

## 🎉 HASIL AKHIR

Setelah berhasil, Anda akan punya:

✅ **Aplikasi Stock Opname Android** yang berfungsi penuh  
✅ **Database SQLite** untuk menyimpan data barang  
✅ **Export CSV** untuk backup dan sharing data  
✅ **UI Modern** dengan design bersih dan user-friendly  
✅ **Fitur Lengkap** - CRUD, Search, Export, Warning  
✅ **Data Persistence** - Data tersimpan permanen  

**SIAP DIGUNAKAN UNTUK MANAJEMEN STOK BARANG! 📦📱**

---

## 🚀 QUICK COMMANDS

```cmd
REM Setup (run as Administrator, sekali saja)
setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"

REM Restart CMD, lalu:
cd stock-opname-app
npm install

REM Start emulator via Android Studio, lalu:
REM CMD 1: npx react-native start
REM CMD 2: npx react-native run-android
```

**ATAU CUKUP DOUBLE-CLICK: `run-windows.bat` 🚀**

---

## 📋 KESIMPULAN

Aplikasi Stock Opname Android sudah **100% SIAP PAKAI** dengan:
- SQLite database untuk data persistence
- CRUD operations lengkap
- CSV export & share functionality
- Modern UI dengan 4 screens
- Search & low stock warnings
- Error handling yang baik

**Tinggal ikuti langkah di atas dan aplikasi siap digunakan di Windows! 🪟📱**

**Happy coding! 🚀**
