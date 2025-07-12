# Stock Opname Android App

Aplikasi Android untuk manajemen stok opname dengan database SQLite dan fitur export CSV.

## Fitur Utama

- ✅ Manajemen data barang (CRUD operations)
- ✅ Database SQLite lokal
- ✅ Export data ke format CSV
- ✅ Share file CSV
- ✅ Pencarian barang
- ✅ Notifikasi stok rendah
- ✅ UI modern dan responsif

## Struktur Aplikasi

```
stock-opname-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Halaman utama & daftar barang
│   │   ├── AddItemScreen.js       # Tambah barang baru
│   │   ├── EditItemScreen.js      # Edit barang
│   │   └── ExportScreen.js        # Export & share CSV
│   └── services/
│       ├── DatabaseService.js     # SQLite database operations
│       └── CSVExportService.js    # CSV export & file management
├── App.js                         # Navigation & app initialization
├── index.js                       # App entry point
└── package.json                   # Dependencies
```

## Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda telah menginstall:

1. **Node.js** (versi 16 atau lebih baru)
2. **React Native CLI**
3. **Android Studio** dengan Android SDK
4. **Java Development Kit (JDK)**

## Instalasi & Setup

### 1. Install Dependencies

```bash
cd stock-opname-app
npm install
```

### 2. Install React Native CLI (jika belum ada)

```bash
npm install -g react-native-cli
```

### 3. Setup Android Development Environment

Pastikan Android Studio sudah terinstall dengan:
- Android SDK
- Android Virtual Device (AVD) atau perangkat Android fisik

### 4. Link Native Dependencies (untuk React Native < 0.60)

```bash
npx react-native link
```

## Cara Menjalankan Aplikasi

### Method 1: Menggunakan Android Emulator

1. **Buka Android Studio dan start AVD (Android Virtual Device)**

2. **Jalankan Metro Bundler:**
```bash
cd stock-opname-app
npx react-native start
```

3. **Build dan jalankan aplikasi (terminal baru):**
```bash
npx react-native run-android
```

### Method 2: Menggunakan Perangkat Android Fisik

1. **Enable Developer Options & USB Debugging di perangkat Android**

2. **Hubungkan perangkat ke komputer via USB**

3. **Verifikasi perangkat terdeteksi:**
```bash
adb devices
```

4. **Jalankan aplikasi:**
```bash
cd stock-opname-app
npx react-native run-android
```

## Testing & Debugging

### 1. Testing Fungsionalitas Utama

#### A. Database Operations
- **Tambah Barang:** Buka app → Tap "Tambah" → Isi form → Tap "Simpan"
- **Edit Barang:** Tap item di list → Edit data → Tap "Update"
- **Hapus Barang:** Tap ikon 🗑️ pada item → Konfirmasi hapus
- **Pencarian:** Gunakan search bar di HomeScreen

#### B. CSV Export
- **Export Data:** Tap "Export" → Tap "Export & Share CSV"
- **Verifikasi File:** Check file tersimpan di device storage
- **Share Functionality:** Test sharing via WhatsApp, Email, dll

### 2. Debug Console Logs

Untuk melihat logs aplikasi:

```bash
# Android logs
npx react-native log-android

# Atau menggunakan adb
adb logcat
```

### 3. React Native Debugger

1. **Install React Native Debugger:**
```bash
npm install -g react-native-debugger
```

2. **Enable Debug Mode di aplikasi:**
- Shake device atau Ctrl+M (emulator)
- Pilih "Debug"

### 4. Testing Scenarios

#### Scenario 1: Basic CRUD Operations
```
1. Buka aplikasi
2. Tambah 3-5 barang dengan data lengkap
3. Edit salah satu barang
4. Hapus satu barang
5. Verifikasi data tersimpan dengan benar
```

#### Scenario 2: Search Functionality
```
1. Tambah beberapa barang dengan kategori berbeda
2. Test pencarian berdasarkan:
   - Nama barang
   - Kode barang
   - Kategori
3. Verifikasi hasil pencarian akurat
```

#### Scenario 3: CSV Export
```
1. Pastikan ada data barang di database
2. Buka Export Screen
3. Tap "Export & Share CSV"
4. Verifikasi file CSV terbuat
5. Test sharing ke aplikasi lain
6. Buka file CSV di Excel/Google Sheets
```

#### Scenario 4: Low Stock Warning
```
1. Tambah barang dengan stok = 5, min_stock = 10
2. Verifikasi warning "Stok Rendah" muncul
3. Check warna merah pada item
```

## Troubleshooting

### Common Issues & Solutions

#### 1. Build Errors

**Error: "Unable to load script"**
```bash
cd stock-opname-app
npx react-native start --reset-cache
```

**Error: "Android SDK not found"**
- Set ANDROID_HOME environment variable
- Add Android SDK tools to PATH

#### 2. Database Issues

**Error: "Database not initialized"**
- Check DatabaseService.js import
- Verify SQLite package installation
- Clear app data dan restart

#### 3. CSV Export Issues

**Error: "Permission denied"**
- Check AndroidManifest.xml permissions
- Test pada Android 6.0+ (runtime permissions)

**Error: "File not found"**
- Verify react-native-fs installation
- Check file path permissions

#### 4. Navigation Issues

**Error: "Screen not found"**
- Verify all screen imports in App.js
- Check screen component exports

### Performance Testing

#### Memory Usage
```bash
# Monitor memory usage
adb shell dumpsys meminfo com.stockopnameapp
```

#### Database Performance
- Test dengan 100+ items
- Measure search response time
- Check SQLite query performance

## Build untuk Production

### 1. Generate Signed APK

```bash
cd stock-opname-app/android
./gradlew assembleRelease
```

### 2. Install APK ke Device

```bash
adb install app/build/outputs/apk/release/app-release.apk
```

## File Structure untuk Testing

```
Testing Files:
├── sample_data.sql          # Sample data untuk testing
├── test_scenarios.md        # Detailed test scenarios
└── performance_tests.js     # Performance testing scripts
```

## Monitoring & Analytics

### 1. Crash Reporting
- Implement Crashlytics (optional)
- Monitor app crashes

### 2. Usage Analytics
- Track feature usage
- Monitor export frequency

## Support & Maintenance

### Regular Maintenance Tasks:
1. **Database Cleanup:** Remove old exported files
2. **Performance Monitoring:** Check app response time
3. **Security Updates:** Update dependencies
4. **Backup Strategy:** Export data regularly

## Contact & Support

Untuk pertanyaan atau issues:
- Check console logs first
- Verify all dependencies installed
- Test pada multiple devices/Android versions

---

**Happy Testing! 🚀**
