# APK Build Setup Guide

Este proyecto está configurado para construir un APK en GitHub Actions. Sigue estos pasos:

## 1. Generar Keystore para Firma

Ejecuta en tu máquina local:

```bash
keytool -genkey -v -keystore panaderia-costos.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias panaderia
```

Ingresa una contraseña fuerte y completa la información solicitada.

## 2. Convertir a Base64

```bash
# En PowerShell (Windows)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("panaderia-costos.keystore")) | Out-File -NoNewline keystore-base64.txt
```

## 3. Configurar Secretos en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions → New repository secret
3. Crea los siguientes secretos:

| Nombre | Valor |
|--------|-------|
| `ANDROID_SIGNING_KEY` | Contenido del archivo `keystore-base64.txt` |
| `ANDROID_KEY_ALIAS` | El alias usado en keytool (ej: `panaderia`) |
| `ANDROID_KEYSTORE_PASSWORD` | La contraseña del keystore |
| `ANDROID_KEY_PASSWORD` | La contraseña de la clave (igual a keystore si usaste la misma) |

## 4. Crear una Etiqueta para Construir

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

El APK se construirá automáticamente y se adjuntará a la Release.

## 5. Construcción Manual (Local)

Si prefieres construir localmente:

```bash
npm install
npm run build
npx cap add android
npx cap sync
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/`

## Notas Importantes

- El proyecto necesita Node.js 18+ y JDK 17
- Capacitor convierte la app web en una app Android nativa
- Los secretos de GitHub se usan para firmar el APK automáticamente
- El keystore NUNCA debe compartirse públicamente
