# ⚠️ Compilación de APK - Resumen de Estado

## Estado Actual

✅ **Instalado:**
- Java JDK 17 (OpenJDK 17.0.11 LTS)
- Capacitor configurado
- Gradle wrapper descargado
- Proyecto web compilado (`dist/` generado)

❌ **No disponible en este entorno:**
- Android SDK (requiere ~10GB)
- Conexión de red para descargar dependencias de gradle
- Emulador de Android

---

## 🚀 Soluciones Recomendadas (en orden de facilidad)

### Opción 1: GitHub Actions (RECOMENDADO - Más fácil)

**Ventajas:**
- ✅ No requiere software local
- ✅ Automático en cada push
- ✅ APK siempre disponible
- ✅ Sin dependencias de red en tu máquina

**Pasos:**
```powershell
# 1. Sube a GitHub
git push origin main

# 2. Ve a: https://github.com/TU_USER/TU_REPO/actions
# 3. Espera a que compile (5-10 min)
# 4. Descarga APK de Artifacts
```

**Archivo del workflow:** `.github/workflows/build-apk.yml` (ya está configurado)

---

### Opción 2: Compilar localmente (tu máquina)

**Requisitos:**
1. **Android Studio** (instala desde https://developer.android.com/studio)
   - Incluye Android SDK automáticamente
   - ~10GB de espacio en disco

2. **Java JDK 17** ← Ya instalado ✅

3. **Conexión a internet** para descargar dependencias

**Pasos:**
```powershell
# 1. Instala Android Studio (GUI)
# 2. En PowerShell, configura entorno:
$env:JAVA_HOME = "C:\Users\Semillas\jdk-17"
$env:ANDROID_HOME = "C:\Users\Semillas\AppData\Local\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\tools\bin;$env:Path"

# 3. Verifica
java -version
sdkmanager --version

# 4. Compila
cd "c:\Users\Semillas\Downloads\panadería-costos-pro(1)\android"
.\gradlew.bat assembleRelease

# 5. El APK estará en:
# android\app\build\outputs\apk\release\app-release.apk
```

---

### Opción 3: CI/CD en tu propia máquina

Ejecuta un script local que haga el build automáticamente:
```powershell
# Desde PowerShell con Java + Android SDK instalado
.\setup-build-env.ps1
```

---

## 📊 Comparación

| Opción | Facilidad | Requisitos | Tiempo | Resultado |
|--------|-----------|-----------|--------|-----------|
| **GitHub Actions** | ⭐⭐⭐⭐⭐ | Solo Git | 5-10 min | APK listo para descargar |
| **Local** | ⭐⭐ | Java + Android Studio | 20-30 min | APK en `android/app/build/...` |
| **Script local** | ⭐⭐⭐ | Java + Android Studio + Script | 20-30 min | Automatizado |

---

## 📝 Instalación de Android SDK (si optas por compilar localmente)

```powershell
# Opción A: Descargar Android Studio GUI (más fácil)
# https://developer.android.com/studio

# Opción B: Desde línea de comandos (si tienes SDK tools)
sdkmanager --install "platforms;android-34" "build-tools;34.0.0"

# Luego configura:
$env:ANDROID_HOME = "C:\Users\Semillas\AppData\Local\Android\Sdk"
$env:Path = "$env:ANDROID_HOME\tools\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
```

---

## ✅ Siguiente Paso

**La opción más rápida es GitHub Actions:**

1. Asegúrate de que el repo esté en GitHub
2. Ve a Actions → Build APK
3. Espera el resultado
4. Descarga `app-release.apk`

Si prefieres compilar localmente, instala Android Studio y sigue la Opción 2.

---

**¿Necesitas ayuda?** Dime qué opción prefieres y te doy instrucciones más detalladas.
