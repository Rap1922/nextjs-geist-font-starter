#!/bin/bash

# 🚀 Script Otomatis Setup Android Development Environment
# Untuk Ubuntu/Debian Linux

echo "🔧 SETUP ANDROID DEVELOPMENT ENVIRONMENT"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "Script ini dibuat untuk Linux. Untuk Windows/Mac, ikuti panduan manual."
    exit 1
fi

print_step "1. Update system packages"
sudo apt update

print_step "2. Install Java Development Kit (JDK)"
if ! command -v java &> /dev/null; then
    print_status "Installing OpenJDK 11..."
    sudo apt install -y openjdk-11-jdk
else
    print_status "Java sudah terinstall: $(java -version 2>&1 | head -n 1)"
fi

print_step "3. Install Android SDK Command Line Tools"
ANDROID_HOME="$HOME/Android/Sdk"
CMDLINE_TOOLS_DIR="$ANDROID_HOME/cmdline-tools"

if [ ! -d "$ANDROID_HOME" ]; then
    print_status "Creating Android SDK directory..."
    mkdir -p "$ANDROID_HOME"
    
    print_status "Downloading Android Command Line Tools..."
    cd /tmp
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
    
    print_status "Extracting Command Line Tools..."
    unzip -q commandlinetools-linux-9477386_latest.zip
    
    mkdir -p "$CMDLINE_TOOLS_DIR"
    mv cmdline-tools "$CMDLINE_TOOLS_DIR/latest"
    
    rm commandlinetools-linux-9477386_latest.zip
else
    print_status "Android SDK directory already exists"
fi

print_step "4. Setup Environment Variables"
SHELL_RC="$HOME/.bashrc"
if [[ $SHELL == *"zsh"* ]]; then
    SHELL_RC="$HOME/.zshrc"
fi

# Add Android environment variables if not already present
if ! grep -q "ANDROID_HOME" "$SHELL_RC"; then
    print_status "Adding Android environment variables to $SHELL_RC"
    cat >> "$SHELL_RC" << EOF

# Android Development Environment
export ANDROID_HOME=\$HOME/Android/Sdk
export PATH=\$PATH:\$ANDROID_HOME/emulator
export PATH=\$PATH:\$ANDROID_HOME/tools
export PATH=\$PATH:\$ANDROID_HOME/tools/bin
export PATH=\$PATH:\$ANDROID_HOME/platform-tools
export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin
EOF
    
    print_status "Environment variables added. Please run: source $SHELL_RC"
else
    print_status "Android environment variables already configured"
fi

# Source the environment variables for current session
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/emulator"
export PATH="$PATH:$ANDROID_HOME/tools"
export PATH="$PATH:$ANDROID_HOME/tools/bin"
export PATH="$PATH:$ANDROID_HOME/platform-tools"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"

print_step "5. Install Android SDK Components"
if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    print_status "Installing Android SDK platforms and tools..."
    
    # Accept licenses
    yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses > /dev/null 2>&1
    
    # Install required SDK components
    "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" \
        "platform-tools" \
        "platforms;android-30" \
        "build-tools;30.0.3" \
        "emulator" \
        "system-images;android-30;google_apis;x86_64" > /dev/null 2>&1
    
    print_status "Android SDK components installed"
else
    print_error "SDK Manager not found. Please check Android SDK installation."
fi

print_step "6. Create Android Virtual Device (AVD)"
AVD_NAME="StockOpname_Emulator"

if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" ]; then
    # Check if AVD already exists
    if ! "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" list avd | grep -q "$AVD_NAME"; then
        print_status "Creating Android Virtual Device: $AVD_NAME"
        echo "no" | "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" create avd \
            -n "$AVD_NAME" \
            -k "system-images;android-30;google_apis;x86_64" \
            -d "pixel_4" > /dev/null 2>&1
        
        print_status "AVD '$AVD_NAME' created successfully"
    else
        print_status "AVD '$AVD_NAME' already exists"
    fi
else
    print_error "AVD Manager not found. Please check Android SDK installation."
fi

print_step "7. Verify Installation"
echo ""
echo "🔍 VERIFICATION RESULTS:"
echo "======================="

# Check Java
if command -v java &> /dev/null; then
    echo -e "✅ Java: $(java -version 2>&1 | head -n 1)"
else
    echo -e "❌ Java: Not found"
fi

# Check Android SDK
if [ -d "$ANDROID_HOME" ]; then
    echo -e "✅ Android SDK: $ANDROID_HOME"
else
    echo -e "❌ Android SDK: Not found"
fi

# Check ADB
if [ -f "$ANDROID_HOME/platform-tools/adb" ]; then
    echo -e "✅ ADB: Available"
else
    echo -e "❌ ADB: Not found"
fi

# Check Emulator
if [ -f "$ANDROID_HOME/emulator/emulator" ]; then
    echo -e "✅ Emulator: Available"
else
    echo -e "❌ Emulator: Not found"
fi

# List AVDs
if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" ]; then
    AVD_COUNT=$("$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" list avd | grep -c "Name:")
    echo -e "✅ AVDs: $AVD_COUNT available"
else
    echo -e "❌ AVD Manager: Not found"
fi

echo ""
print_step "8. Next Steps"
echo "============="
echo "1. Restart terminal atau jalankan: source $SHELL_RC"
echo "2. Masuk ke folder project: cd stock-opname-app"
echo "3. Start emulator: ./start-emulator.sh"
echo "4. Run aplikasi: ./run-app.sh"

echo ""
print_status "Setup selesai! 🎉"
print_warning "PENTING: Restart terminal Anda atau jalankan 'source $SHELL_RC' sebelum melanjutkan."
