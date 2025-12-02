# Script para diagnosticar el build de APK localmente

$ErrorActionPreference = "SilentlyContinue"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Diagnóstico de Build APK" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Verificar si existe android folder
Write-Host "`n1. Verificando carpeta android..." -ForegroundColor Yellow
if (Test-Path "android") {
    Write-Host "✅ Carpeta android encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Carpeta android NO encontrada" -ForegroundColor Red
}

# Verificar Capacitor
Write-Host "`n2. Verificando Capacitor..." -ForegroundColor Yellow
if (Test-Path "capacitor.config.json") {
    Write-Host "✅ capacitor.config.json encontrado" -ForegroundColor Green
    Get-Content capacitor.config.json | Select-Object -First 10
} else {
    Write-Host "❌ capacitor.config.json NO encontrado" -ForegroundColor Red
}

# Verificar build web
Write-Host "`n3. Verificando build web..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Write-Host "✅ Carpeta dist encontrada" -ForegroundColor Green
    Get-ChildItem dist
} else {
    Write-Host "❌ Carpeta dist NO encontrada - Compilando..." -ForegroundColor Red
    Write-Host "Ejecutando: npm run build" -ForegroundColor Yellow
    npm run build
}

# Listar archivos en android
Write-Host "`n4. Buscando archivos APK generados..." -ForegroundColor Yellow
$apkFiles = Get-ChildItem -Path "android" -Filter "*.apk" -Recurse -ErrorAction SilentlyContinue
if ($apkFiles) {
    Write-Host "✅ APK files encontrados:" -ForegroundColor Green
    $apkFiles | ForEach-Object { Write-Host "   - $($_.FullName)" }
} else {
    Write-Host "❌ No se encontraron archivos APK" -ForegroundColor Red
    Write-Host "Buscando directorios de output..." -ForegroundColor Yellow
    Get-ChildItem -Path "android/app/build/outputs" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName
}

# Verificar gradle
Write-Host "`n5. Verificando Gradle..." -ForegroundColor Yellow
if (Test-Path "android/gradlew") {
    Write-Host "✅ Gradle wrapper encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Gradle wrapper NO encontrado" -ForegroundColor Red
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Fin del diagnóstico" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
