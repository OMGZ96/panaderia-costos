# Script para actualizar la versión y compilar el APK (Windows)

param(
    [string]$Version = ""
)

if ([string]::IsNullOrEmpty($Version)) {
    Write-Host "Uso: .\bump-version.ps1 -Version 1.0.5" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Actualizando versión a $Version..." -ForegroundColor Cyan

# Leer package.json
$packageJson = Get-Content "package.json" -Raw
$packageJson = $packageJson -replace '"version": "[^"]*"', """version"": ""$Version"""
Set-Content "package.json" $packageJson

Write-Host "✅ package.json actualizado" -ForegroundColor Green

# Mostrar cambio
Write-Host ""
Write-Host "Versión en package.json:" -ForegroundColor Yellow
(Get-Content package.json | Select-String "version" | Select-Object -First 1).Line

Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. git add package.json"
Write-Host "2. git commit -m 'bump: version $Version'"
Write-Host "3. git tag -a v$Version -m 'Release v$Version'"
Write-Host "4. git push origin main"
Write-Host "5. git push origin v$Version"
Write-Host ""
Write-Host "¡El APK se compilará automáticamente!" -ForegroundColor Green
Write-Host "Datos guardados se preservarán en la actualización." -ForegroundColor Green
