# 📱 Guía: Dónde Encontrar el APK Compilado

## 🎯 El problema

El APK se compila en GitHub pero puede estar en diferentes ubicaciones según el tipo de build:
- **Release Build**: `android/app/build/outputs/apk/release/`
- **Debug Build**: `android/app/build/outputs/apk/debug/`

Los archivos pueden tener diferentes nombres:
- `app-release.apk`
- `app-release-unsigned.apk`
- `app-debug.apk`
- Otros variantes

---

## ✅ Solución: El workflow ahora busca TODOS los APK

### En GitHub:

#### **Opción 1: Desde Releases (Permanente)**
```
https://github.com/OMGZ96/panaderia-costos/releases
```
- Busca la versión que compilaste (ej: v1.0.4)
- Verás los archivos APK listados
- Descarga el que necesites

#### **Opción 2: Desde Actions (Temporal - 7 días)**
```
https://github.com/OMGZ96/panaderia-costos/actions
```
1. Haz click en el último workflow que ejecutó
2. Baja hasta "Artifacts"
3. Descarga `apk-files` (contiene todos los APK generados)

---

## 🔍 Cómo saber qué APK descargar

| Tipo | Nombre | Uso | Tamaño |
|------|--------|-----|--------|
| **Release** | `app-release.apk` | Producción | ~20-30 MB |
| **Release Unsigned** | `app-release-unsigned.apk` | Pruebas | ~20-30 MB |
| **Debug** | `app-debug.apk` | Desarrollo | ~25-35 MB |

**Recomendación**: Para instalar en tu teléfono, usa cualquiera. Los Debug y Release Unsigned funcionan igual.

---

## 📥 Pasos para Instalar en tu Dispositivo

### Método 1: Descarga desde GitHub (Recomendado)

1. Ve a: https://github.com/OMGZ96/panaderia-costos/releases/tag/v1.0.4
2. Descarga cualquier archivo `.apk`
3. Abre el archivo en tu teléfono
4. Toca "Instalar"

### Método 2: Descarga desde Actions

1. Ve a: https://github.com/OMGZ96/panaderia-costos/actions
2. Busca el último workflow exitoso
3. Baja a la sección "Artifacts"
4. Descarga `apk-files` (es un .zip)
5. Descomprime y extrae el APK
6. Instala en tu teléfono

### Método 3: Usando ADB (desde tu PC)

```bash
# Conecta tu dispositivo por USB
adb devices

# Descarga el APK primero, luego:
adb install "ruta/al/apk.apk"
```

---

## 🐛 Si no ves archivos APK en GitHub

### Paso 1: Verifica el estado del workflow
- Ve a https://github.com/OMGZ96/panaderia-costos/actions
- Si dice ❌ Failed → hay un error en la compilación
- Si dice ✅ Passed → debería haber APK disponible

### Paso 2: Lee los logs
1. Haz click en el workflow fallido
2. Abre el paso "Find and List APK files"
3. Verás si encontró APK o qué error tuvo

### Paso 3: Soluciones comunes

**"No APK found"**
- El build puede haber fallado
- Revisa el paso "Build Release APK"
- Busca errores de Gradle

**"Android platform already exists"**
- Ya está arreglado en v1.0.3+
- Intenta con una versión más nueva

**"Error en build.gradle"**
- Contacta si los logs dicen específicamente qué está mal

---

## 📊 La Estructura del APK Compilado

```
android/
└── app/
    └── build/
        └── outputs/
            └── apk/
                ├── debug/
                │   ├── app-debug.apk          ← APK de DEBUG
                │   ├── output.json
                │   └── ...
                └── release/
                    ├── app-release.apk        ← APK de RELEASE
                    ├── app-release-unsigned.apk
                    ├── output.json
                    └── ...
```

---

## 🎯 Resumen Rápido

| Necesidad | Dónde Encontrarlo |
|-----------|-------------------|
| **Quiero el APK más reciente** | Releases → v1.0.4 |
| **Quiero todos los APK compilados** | Actions → Artifacts → apk-files |
| **Quiero APK de desarrollo** | Actions → apk-debug |
| **No veo el APK** | Revisa que el workflow diga ✅ |

---

## ✨ Lo que cambié en v1.0.4

- ✅ El workflow busca **TODOS** los archivos `.apk` recursivamente
- ✅ Muestra **todos los APK encontrados** en los logs
- ✅ Sube **todos los APK** como artifacts (válidos 7 días)
- ✅ Crea Release con **todos los APK** (permanentes)

---

## 🚀 Próximo build

Para compilar una nueva versión:
```bash
git tag -a v1.0.5 -m "Tu descripción"
git push origin v1.0.5
```

Y el APK estará disponible en ~2-5 minutos.

---

**¿Necesitas ayuda?** Revisa los logs en:
👉 https://github.com/OMGZ96/panaderia-costos/actions

Busca el paso "Find and List APK files" para ver todos los APK encontrados.

---

Actualizado: 28/11/2025
