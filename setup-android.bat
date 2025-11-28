@echo off
REM Script para setup local de Capacitor en Windows

echo 🍞 Configurando Panadería Costos Pro para Android...

REM Instalar dependencias
echo 📦 Instalando dependencias de npm...
call npm install

REM Construir web app
echo 🔨 Construyendo la aplicación web...
call npm run build

REM Agregar plataforma Android
echo 🤖 Agregando soporte para Android...
call npx cap add android

REM Sincronizar código
echo 🔄 Sincronizando código con Capacitor...
call npx cap sync

echo ✅ Setup completado!
echo.
echo Próximos pasos:
echo 1. Abre el proyecto Android en Android Studio: android\
echo 2. Conecta un dispositivo Android o inicia un emulador
echo 3. Ejecuta: npx cap run android
echo.
echo Para crear un APK para release:
echo cd android
echo gradlew.bat assembleRelease
pause
