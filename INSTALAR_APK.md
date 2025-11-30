# 📱 Generar APK - Guía Rápida

## Situación actual

Tu proyecto está **100% configurado** para generar APK. Sin embargo, la compilación requiere:
- **Java JDK 17+**
- **Android SDK**
- **Gradle**

Estos no están disponibles en el entorno actual de compilación.

## ✅ Solución: Compilar en GitHub Actions (Recomendado)

### Pasos:

1. **Sube tu proyecto a GitHub** (si no lo has hecho):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

2. **Ve a GitHub → Actions**
   - Abre https://github.com/TU_USUARIO/TU_REPO/actions
   - Verás el workflow "Build APK"

3. **Espera a que compile**
   - El workflow corre automáticamente en cada push
   - Tardará ~5-10 minutos

4. **Descarga el APK**
   - Ve al workflow completado
   - Click en "Artifacts" → descarga `apk-release`
   - Archivo: `app-release.apk`

### Alternativa: Compilar localmente

Si quieres compilar en tu máquina:

```powershell
# 1. Instalar Java JDK 17
# Descarga desde: https://adoptium.net/temurin/releases/
# O usa: choco install openjdk17 (con admin)

# 2. Configurar JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.X"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version  # Verificar

# 3. Instalar Android Studio
# Desde: https://developer.android.com/studio
# Esto incluye Android SDK y necesario tools

# 4. Compilar
cd "c:\Users\Semillas\Downloads\panadería-costos-pro(1)"
npm install
npm run build
npx cap sync android
cd android
.\gradlew assembleRelease

# 5. Resultado
# El APK estará en: android\app\build\outputs\apk\release\app-release.apk
```

## 📦 Información del APK

- **Nombre**: Panadería Costos Pro
- **Package**: com.example.panaderiacostos
- **Versión**: 0.0.0 (actualiza en capacitor.config.ts)
- **Tipo**: Unsigned (válido para desarrollo/testing)
- **Tamaño aprox**: 5-10 MB

## 🚀 Próximos pasos

- **Instalar en dispositivo**: `adb install app-release.apk`
- **Firmar para Play Store**: Necesitas keystore (puedo ayudarte)
- **Publicar en Play Store**: Requiere cuenta de desarrollador ($25)

---

**Recomendación**: Usa GitHub Actions. Es automático, no requiere software local, y el APK siempre está disponible en los Artifacts.
