@echo off
echo ========================================
echo    STOCK OPNAME APP - WINDOWS LAUNCHER
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from stock-opname-app folder
    pause
    exit /b 1
)

echo [INFO] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo [INFO] Checking Android environment...
adb version >nul 2>&1
if errorlevel 1 (
    echo WARNING: ADB not found in PATH
    echo Please set ANDROID_HOME and add platform-tools to PATH
    echo.
    echo Run these commands as Administrator:
    echo setx ANDROID_HOME "C:\Users\%USERNAME%\AppData\Local\Android\Sdk"
    echo setx PATH "%%PATH%%;%%ANDROID_HOME%%\platform-tools"
    echo.
    pause
)

echo [INFO] Checking for node_modules...
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo [INFO] Checking connected devices...
adb devices | findstr "device" >nul
if errorlevel 1 (
    echo WARNING: No Android devices/emulators found
    echo.
    echo Please:
    echo 1. Open Android Studio
    echo 2. Go to Tools ^> AVD Manager
    echo 3. Start an emulator
    echo 4. Wait for emulator to boot completely
    echo.
    echo Press any key when emulator is ready...
    pause >nul
)

echo.
echo ========================================
echo    STARTING STOCK OPNAME APP
echo ========================================
echo.
echo [INFO] This will open 2 windows:
echo 1. Metro Bundler (keep it running)
echo 2. App Builder and Installer
echo.
echo Press any key to continue...
pause >nul

REM Start Metro Bundler in new window
echo [INFO] Starting Metro Bundler...
start "Metro Bundler - Stock Opname" cmd /k "echo Starting Metro Bundler... && npx react-native start"

REM Wait a bit for Metro to start
echo [INFO] Waiting for Metro to start...
timeout /t 5 /nobreak >nul

REM Build and install app
echo [INFO] Building and installing app...
echo This may take a few minutes for the first build...
npx react-native run-android

if errorlevel 1 (
    echo.
    echo ERROR: Failed to build or install app
    echo.
    echo Common solutions:
    echo 1. Make sure emulator is running
    echo 2. Check if adb devices shows your emulator
    echo 3. Try: cd android ^&^& gradlew clean ^&^& cd ..
    echo 4. Try: npx react-native start --reset-cache
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SUCCESS! APP INSTALLED
echo ========================================
echo.
echo The Stock Opname app should now be running on your emulator!
echo.
echo To view logs: npx react-native log-android
echo To stop Metro: Close the Metro Bundler window
echo.
echo App Features:
echo - Add/Edit/Delete stock items
echo - Search functionality  
echo - Export to CSV
echo - Share CSV files
echo - Low stock warnings
echo.
pause
