# 📱 Guía Rápida - Compilar APK

## Método 1: Compilación Automática (Recomendado)

Los APKs se compilan automáticamente en cada push. Descárgalos desde:

1. Ve a la pestaña **"Actions"** del repositorio
2. Selecciona el workflow **"Build Android APK"**
3. Descarga el artifact `panaderia-costos-debug` o `panaderia-costos-release`

## Método 2: Compilación Local

### Requisitos
- Node.js 18+
- Java JDK 17+
- Android SDK

### Pasos

```bash
# 1. Clonar y entrar al directorio
git clone https://github.com/OMGZ96/panaderia-costos.git
cd panaderia-costos

# 2. Instalar dependencias
npm install

# 3. Crear .env.local
cp .env.local.example .env.local
# Editar .env.local y agregar tu clave de Gemini

# 4. Compilar APK debug
npm run android:debug

# O para release
npm run android:release
```

### APK Debug
- Ruta: `android/app/build/outputs/apk/debug/app-debug.apk`
- Propósito: Desarrollo y pruebas
- Firma: Automática del sistema

### APK Release
- Ruta: `android/app/build/outputs/apk/release/app-release-unsigned.apk`
- Propósito: Distribución
- Firma: Requiere configuración (ver SIGNING_SETUP.md)

## Instalación en el dispositivo

```bash
# Con USB debugging activado
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

O simplemente copia el APK al teléfono y abre.

## Solución de Problemas

- **Error de Gradle**: `./gradlew clean` en el directorio android
- **Error de Node**: Ejecuta `npm install` nuevamente
- **Puerto ocupado**: Cambia el puerto en vite.config.ts

## Más Información

- [Guía Completa de Compilación](GUIA_COMPILAR_APK.md)
- [Instalación del APK](INSTALAR_APK.md)
- [Configuración de Firma](SIGNING_SETUP.md)
