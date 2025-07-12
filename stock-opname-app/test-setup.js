#!/usr/bin/env node

/**
 * Stock Opname App - Setup Verification Script
 * This script checks if all required dependencies and files are properly configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Stock Opname App - Setup Verification\n');

// Check if we're in the right directory
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Make sure you\'re in the stock-opname-app directory.');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📱 App Name: ${packageJson.name}`);
console.log(`📦 Version: ${packageJson.version}\n`);

// Check required files
const requiredFiles = [
  'App.js',
  'index.js',
  'babel.config.js',
  'metro.config.js',
  'src/screens/HomeScreen.js',
  'src/screens/AddItemScreen.js',
  'src/screens/EditItemScreen.js',
  'src/screens/ExportScreen.js',
  'src/services/DatabaseService.js',
  'src/services/CSVExportService.js'
];

console.log('📁 Checking required files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(currentDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the file structure.');
  process.exit(1);
}

// Check required dependencies
console.log('\n📦 Checking key dependencies:');
const requiredDeps = [
  'react',
  'react-native',
  'react-native-sqlite-storage',
  'react-native-fs',
  'react-native-share',
  '@react-navigation/native',
  '@react-navigation/stack'
];

const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
let allDepsExist = true;

requiredDeps.forEach(dep => {
  if (dependencies[dep]) {
    console.log(`  ✅ ${dep} (${dependencies[dep]})`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allDepsExist = false;
  }
});

if (!allDepsExist) {
  console.log('\n⚠️  Some dependencies are missing. Run: npm install');
}

// Check Node.js version
console.log('\n🔧 Environment Check:');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ Node.js: ${nodeVersion}`);
  
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ npm: ${npmVersion}`);
} catch (error) {
  console.log('  ❌ Node.js/npm not found');
}

// Check React Native CLI
try {
  const rnVersion = execSync('npx react-native --version', { encoding: 'utf8' }).trim();
  console.log(`  ✅ React Native CLI: Available`);
} catch (error) {
  console.log('  ⚠️  React Native CLI: Not found (will use npx)');
}

// Check Android development environment
console.log('\n🤖 Android Environment:');
try {
  const adbVersion = execSync('adb version', { encoding: 'utf8' });
  console.log('  ✅ ADB: Available');
} catch (error) {
  console.log('  ❌ ADB: Not found - Install Android SDK');
}

// Check for Android devices/emulators
try {
  const devices = execSync('adb devices', { encoding: 'utf8' });
  const deviceLines = devices.split('\n').filter(line => line.includes('\tdevice'));
  if (deviceLines.length > 0) {
    console.log(`  ✅ Android Devices: ${deviceLines.length} connected`);
  } else {
    console.log('  ⚠️  Android Devices: None connected');
  }
} catch (error) {
  console.log('  ⚠️  Cannot check Android devices');
}

console.log('\n🚀 Quick Start Commands:');
console.log('  1. Install dependencies:     npm install');
console.log('  2. Start Metro bundler:     npx react-native start');
console.log('  3. Run on Android:          npx react-native run-android');
console.log('  4. View logs:               npx react-native log-android');

console.log('\n📋 Testing Checklist:');
console.log('  □ Add new stock item');
console.log('  □ Edit existing item');
console.log('  □ Delete item');
console.log('  □ Search functionality');
console.log('  □ Export to CSV');
console.log('  □ Share CSV file');
console.log('  □ Low stock warning');

console.log('\n✨ Setup verification complete!');

if (allFilesExist && allDepsExist) {
  console.log('🎉 Your Stock Opname app is ready to run!');
} else {
  console.log('⚠️  Please fix the issues above before running the app.');
}
