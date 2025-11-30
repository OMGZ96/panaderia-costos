#!/usr/bin/env pwsh
<#
.SYNOPSIS
Script para instalar dependencias (Java, Android SDK) y compilar APK
.DESCRIPTION
Instala Java JDK 17 y configura entorno para compilar APK
.NOTES
Requiere Windows 11 o Windows 10 con Windows Package Manager instalado
#>

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "APK Build Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Detectar si winget está disponible
$winget = Get-Command winget -ErrorAction SilentlyContinue

if ($null -eq $winget) {
    Write-Host "❌ Windows Package Manager (winget) no encontrado." -ForegroundColor Red
    Write-Host "Opción 1: Instala Windows Package Manager desde Microsoft Store" -ForegroundColor Yellow
    Write-Host "Opción 2: Descarga JDK 17 manualmente desde https://adoptium.net/temurin/releases/" -ForegroundColor Yellow
    Write-Host "Opción 3: Usa GitHub Actions (recomendado - ver INSTALAR_APK.md)" -ForegroundColor Green
    exit 1
}

Write-Host "✅ Instalando Java JDK 17..." -ForegroundColor Green
winget install --id=EclipseAdoptium.Temurin.17 -e -h

Write-Host "✅ Java instalado. Verificando..." -ForegroundColor Green
java -version

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Java configurado correctamente" -ForegroundColor Green
    Write-Host "`n📝 Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Instala Android Studio desde https://developer.android.com/studio"
    Write-Host "  2. En este proyecto, ejecuta: npm install && npm run build"
    Write-Host "  3. Luego: npx cap sync android"
    Write-Host "  4. Finalmente: cd android && .\gradlew assembleRelease"
    Write-Host "`n💡 O usa GitHub Actions para compilar automáticamente (más fácil)" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Error al instalar Java" -ForegroundColor Red
    exit 1
}
