#!/bin/bash

# Script para setup local de Capacitor

echo "🍞 Configurando Panadería Costos Pro para Android..."

# Instalar dependencias
echo "📦 Instalando dependencias de npm..."
npm install

# Construir web app
echo "🔨 Construyendo la aplicación web..."
npm run build

# Agregar plataforma Android
echo "🤖 Agregando soporte para Android..."
npx cap add android

# Sincronizar código
echo "🔄 Sincronizando código con Capacitor..."
npx cap sync

echo "✅ Setup completado!"
echo ""
echo "Próximos pasos:"
echo "1. Abre el proyecto Android en Android Studio: cd android && open -a 'Android Studio' ."
echo "2. Conecta un dispositivo Android o inicia un emulador"
echo "3. Ejecuta: npx cap run android"
echo ""
echo "Para crear un APK para release:"
echo "cd android && ./gradlew assembleRelease"
