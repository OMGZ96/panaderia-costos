# 📱 Compilar APK en GitHub - Guía Completa

## ✅ ¿Qué está configurado?

Tu proyecto tiene **dos workflows de GitHub Actions** listos para compilar el APK:

### 1️⃣ **build-apk.yml** (Compilación Continua)
- Se ejecuta automáticamente en cada push a `main`
- Compila APK de **DEBUG** (para desarrollo)
- No requiere secretos ni configuración adicional
- Los APK se guardan como **artifacts** en GitHub (válidos por 7 días)

### 2️⃣ **release-apk.yml** (Compilación de Release)
- Se ejecuta cuando se crea un **tag con versión** (ej: v1.0.0)
- Compila APK de **RELEASE** (sin firmar)
- Crea una **Release en GitHub** con el APK descargable
- No requiere secretos

---

## 🚀 Cómo Compilar el APK

### **Opción A: Compilación Automática (Recomendado - Sin configuración)**

#### Paso 1: Crear un tag
```bash
# En tu máquina local
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

#### Paso 2: Esperar a que GitHub compile
- Ve a tu repositorio: https://github.com/OMGZ96/panaderia-costos
- Haz click en **"Actions"** (pestaña superior)
- Verás el workflow `Build and Release APK` ejecutándose
- Espera a que termine (2-5 minutos)

#### Paso 3: Descargar el APK
- Ve a **"Releases"** en tu repositorio
- O ve directamente a: https://github.com/OMGZ96/panaderia-costos/releases
- Descarga el archivo `app-release-unsigned.apk`

---

### **Opción B: Compilación en cada Push (Automático)**

Cada vez que hagas `git push` a la rama `main`:
1. GitHub automáticamente compila un APK de DEBUG
2. Lo guarda como artifact por 7 días
3. Puedes descargarlo en la sección **Actions** → **Artifacts**

---

## 📥 Cómo Instalar el APK en tu Dispositivo Android

### Método 1: Descarga Directa
1. Descarga el APK desde GitHub Releases o Artifacts
2. En tu teléfono, ve a: **Configuración → Seguridad**
3. Habilita **"Instalar desde fuentes desconocidas"**
4. Abre el archivo APK descargado
5. Toca **"Instalar"**

### Método 2: Usando ADB (Desde tu PC)
```bash
# Conecta tu dispositivo Android por USB
adb devices  # Verifica que aparezca tu dispositivo

# Instala el APK
adb install app-release-unsigned.apk

# O:
adb install -r app-release-unsigned.apk  # Para actualizar
```

---

## 📊 Estado de los Workflows

| Workflow | Trigger | APK Tipo | Requisitos | Estado |
|----------|---------|----------|-----------|--------|
| **build-apk.yml** | Push a `main` | DEBUG | Ninguno ✅ | ✅ Listo |
| **release-apk.yml** | Crear tag `v*` | RELEASE | Ninguno ✅ | ✅ Listo |

---

## 🔄 Pasos para Compilar Ahora Mismo

### Opción Rápida (1 minuto):

1. Abre una terminal en tu proyecto:
```bash
cd "c:\Users\Semillas\Downloads\panadería-costos-pro(3)"
```

2. Crea un nuevo tag:
```bash
git tag -a v1.0.1 -m "First APK Release"
git push origin v1.0.1
```

3. Espera 2-5 minutos

4. Descarga el APK desde: https://github.com/OMGZ96/panaderia-costos/releases

---

## 🎯 Qué Sucede en GitHub

Cuando subes un tag, GitHub hace esto automáticamente:

```
1. Descarga tu código
2. Instala Node.js y Java
3. Ejecuta: npm install
4. Ejecuta: npm run build (compila la web app)
5. Agrega Capacitor para Android
6. Compila con Gradle: ./gradlew assembleRelease
7. Genera el APK
8. Crea una Release con el APK
9. Lo deja disponible para descargar
```

**Todo completamente automatizado ⚡**

---

## 📱 Información del APK

- **Nombre del app:** Panadería Costos Pro
- **Package ID:** com.panaderia.costos
- **Versión:** Según el tag (v1.0.0, v1.0.1, etc.)
- **Tamaño:** ~15-25 MB (sin recursos extra)
- **Compatibilidad:** Android 5.0+ (API 21+)
- **Arquitecturas:** arm64-v8a, armeabi-v7a, x86, x86_64

---

## ✨ Características del APK

✅ Cálculo de costos de producción  
✅ Gestión de inventario  
✅ Historial de producción  
✅ Exportación a Excel  
✅ Interfaz responsive  
✅ Sin dependencias externas de API  

---

## 🐛 Solución de Problemas

### El workflow falla
- Ve a **Actions** → haz click en el workflow fallido
- Lee los logs para ver el error
- Los errores más comunes son por archivo faltante

### El APK no se genera
- Verifica que la carpeta `dist/` se haya compilado
- Los logs deben mostrar: "Build APK"
- Si ves error de Gradle, probablemente falta Java (ya está en GitHub)

### No puedo descargar el APK
- Los artifacts de DEBUG duran 7 días
- Los APK de RELEASE (tags) son permanentes
- Crea un tag si necesitas un APK permanente

### El APK se instala pero hay error
- Es probable que sea APK de DEBUG, intenta con RELEASE
- Desinstala la versión anterior primero

---

## 🔗 Enlaces Útiles

- **Mi Repositorio:** https://github.com/OMGZ96/panaderia-costos
- **Releases:** https://github.com/OMGZ96/panaderia-costos/releases
- **Actions:** https://github.com/OMGZ96/panaderia-costos/actions
- **Documentación Capacitor:** https://capacitorjs.com/docs
- **Documentación Android:** https://developer.android.com/

---

## 💡 Próximos Pasos

1. **Ahora:** Crea un tag y compila el primer APK
2. **Luego:** Descarga y prueba en tu dispositivo
3. **Después:** Puedes mejorar el app y crear nuevas versiones
4. **Opcional:** Configurar firma digital para publicar en Play Store

---

## 🎊 ¡Listo!

Tu APK está 100% configurado para compilarse en GitHub. Solo necesitas:

1. Hacer cambios en el código
2. Commit y push
3. Crear un tag
4. **¡GitHub compila automáticamente el APK!**

**¿Necesitas ayuda?** Revisa los logs en la sección Actions de GitHub.

---

Generado: 28/11/2025  
Última actualización: Configuración completa para APK automático
