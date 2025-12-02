# Generar APK (Android) - Panadería Costos Pro

Este documento describe los pasos para generar una APK Android desde este proyecto web usando Capacitor.

Requisitos (en la máquina local):
- Node.js >= 18 y npm
- Java JDK 11+
- Android Studio (incluye Android SDK y emuladores)
- Variables de entorno: `ANDROID_HOME` y `PATH` que incluyan `platform-tools` (normalmente configuradas por Android Studio)

Nota: No puedo construir la APK aquí (requiere Android SDK/Gradle nativo). Los pasos abajo preparan el proyecto y explican cómo construir localmente o en CI.

Pasos (PowerShell) — comandos para ejecutar en la carpeta del proyecto:

```powershell
# 1) Instalar dependencias de node
npm install

# 2) Inicializar Capacitor (solo si no lo has hecho antes)
# Esto crea archivos de configuración de Capacitor. web-dir ya está configurado a 'dist'.
npx cap init "Panaderia Costos Pro" com.example.panaderiacostos --web-dir=dist

# 3) Construir la web (Vite) para producir la carpeta `dist` que empaquetará la app
npm run build

# 4) Añadir la plataforma Android (solo la primera vez)
npx cap add android

# 5) Sincronizar cambios (copiar build web a proyecto nativo)
npx cap sync android

# 6) Abrir el proyecto Android en Android Studio
npx cap open android

# 7) En Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
#    o desde terminal (Windows PowerShell) para un build release con Gradle wrapper:
cd android
.\\gradlew assembleRelease

# El APK resultante (release) suele estar en:
# android/app/build/outputs/apk/release/app-release.apk

```

Firmar el APK / Subir a Play Store:
- Para publicar en Google Play debes firmar el APK/AAB. Usa la assistant de Android Studio o crea un keystore con `keytool` y configura signingConfigs en Gradle.

Consejos y notas:
- Si tu app depende de recursos cargados desde CDN (como en `index.html` con importmap), se comportará igual cuando esté empaquetada, pero comprueba permisos de red si necesitas acceso a internet.
- Asegúrate de que `capacitor.config.ts` tiene `webDir: 'dist'` (ya está configurado en este repo).
- Para builds automatizados en CI, instala Android SDK y usa `./gradlew bundleRelease` o `assembleRelease` en un runner con Java + Android SDK.

Problemas comunes:
- Error: "Android SDK location not found": instala Android SDK y configura `ANDROID_HOME`.
- Errores de gradle: abre el proyecto en Android Studio y deja que sincronice/descargue dependencias.

## Opción más fácil: Compilar en GitHub Actions (CI)

Ya incluyo un workflow de GitHub Actions (`.github/workflows/build-apk.yml`) que **compila automáticamente un APK unsigned** cada vez que hagas push a `main`/`develop` o crees un release.

**Pasos para usar:**
1. Sube este repo a GitHub (si no lo has hecho).
2. Ve a la pestaña **Actions** en tu repo.
3. Busca el workflow **"Build APK"** y verás los builds anteriores.
4. Cada push/PR/release desencadenará una compilación automática.
5. Una vez que el workflow termine, descarga el APK desde **Artifacts** o desde la página de release (si lo pusiste como release).

El workflow se ejecuta en `ubuntu-latest` con:
- Node.js 20
- Java 17 + Gradle
- Android SDK API 34
- Build Tools 34.0.0

Ventajas:
- No necesitas configurar Android SDK/Java en tu máquina.
- El APK se genera automáticamente y está disponible para descargar.
- Es unsigned (para desarrollo); para publicar en Play Store necesitas firmarlo (ver abajo).

Notas de seguridad:
- El APK es **unsigned**: sirve para desarrollo/testing en emuladores o dispositivos en modo debug.
- Para publicar en Google Play, **necesitas un keystore para firmar** el APK. Puedo ayudarte a configurar el signing en el workflow si lo necesitas.

Soporte adicional:
- Si necesitas firmar el APK para producción (Play Store), proporciona un keystore o guíame para crear uno, y configuro el signing en el workflow.
