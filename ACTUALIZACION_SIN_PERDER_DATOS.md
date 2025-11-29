# Configuración para Build de APK con Preservación de Datos

## 🎯 Cómo funciona la preservación de datos en Android

Cuando el sistema Android **actualiza una app**, mantiene los datos si:

1. ✅ El `packageName` (appId) es **IGUAL** en ambas versiones
2. ✅ El certificado de firma es **IGUAL** (nosotros usamos debug/release sin firma)
3. ✅ Los datos están guardados en `SharedPreferences` o `localStorage`

**Nuestra app ya cumple estos requisitos porque:**
- Usa `localStorage` para guardar el historial (JSON)
- El `appId` es `com.panaderia.costos` (siempre igual)
- Los datos se guardan en el navegador local

---

## 📝 Archivos configurados:

### 1. `capacitor.config.json`
```json
{
  "appId": "com.panaderia.costos",  // ✅ Debe ser siempre igual
  "appName": "Panadería Costos Pro",
  "webDir": "dist"
}
```

### 2. `version.gradle` (nuevo)
```gradle
// Automáticamente actualiza versiones desde package.json
apkVersionCode = 100040    // Para v1.0.4
apkVersionName = "1.0.4"   // Versión legible
```

### 3. Flujo de Actualización

```
Instalación V1.0.0
└─ localStorage guardado en el dispositivo
└─ Datos: historial, ingredientes, etc.

Usuario actualiza a V1.0.1
└─ Android compara packageName: com.panaderia.costos
└─ ✅ packageName es igual → PRESERVA datos
└─ ✅ localStorage sigue disponible
└─ Datos se cargan automáticamente
```

---

## 🔒 Persistencia de Datos en Capacitor

Capacitor guarda datos en:
```
/data/data/com.panaderia.costos/
├── app_webview/    # localStorage aquí
├── shared_prefs/   # Preferences
└── files/          # Otros archivos
```

Estos datos **persisten automáticamente** entre actualizaciones si el packageName no cambia.

---

## 🚀 Para Asegurar Actualización Correcta:

### Paso 1: Verifica el appId (ya está correcto)
```bash
grep "appId" capacitor.config.json
# Debe ser: "com.panaderia.costos"
```

### Paso 2: Actualiza el package.json con la nueva versión
```json
{
  "name": "panaderia-costos-pro",
  "version": "1.0.5"  // Nueva versión
}
```

### Paso 3: Compila y crea tag
```bash
git add package.json
git commit -m "bump: version 1.0.5"
git tag -a v1.0.5 -m "Release 1.0.5"
git push origin main
git push origin v1.0.5
```

GitHub Actions compilará automáticamente con la nueva versión.

---

## ✅ Lo que sucede en cada actualización:

| Acción | Resultado |
|--------|-----------|
| Usuario instala v1.0.0 | ✅ App funciona, datos guardados en localStorage |
| Usuario descarga v1.0.5 APK | ✅ Mismo packageName (com.panaderia.costos) |
| Usuario abre e instala v1.0.5 | ✅ Android detecta actualización |
| Actualización se completa | ✅ localStorage se preserva |
| App se abre | ✅ Historial cargado automáticamente |

---

## 💾 Estructura de Datos Guardados

Tu app guarda en `localStorage`:

```javascript
// En App.tsx
localStorage.setItem('productionHistory', JSON.stringify(newHistory));

// Se recupera automáticamente:
const saved = localStorage.getItem('productionHistory');
const history = saved ? JSON.parse(saved) : [];
```

Esto **persiste entre actualizaciones** sin necesidad de código especial.

---

## 🎯 Procedimiento para Nueva Actualización:

### Cuando quieras lanzar v1.0.5:

1. **Actualiza versión:**
   ```bash
   # Edita package.json
   "version": "1.0.5"
   ```

2. **Compila y actualiza:**
   ```bash
   git add package.json
   git commit -m "bump: version 1.0.5"
   git tag -a v1.0.5 -m "Release 1.0.5"
   git push origin v1.0.5
   ```

3. **GitHub compila APK v1.0.5**

4. **Usuario instala actualización:**
   - Descarga APK v1.0.5
   - Toca "Actualizar"
   - ✅ Datos se preservan automáticamente

---

## ⚠️ Importante: No cambies esto

❌ **NUNCA cambies el appId:**
```json
// ✗ MALO - Perderá datos
"appId": "com.panaderia.nueva"
```

✅ **SIEMPRE mantén el mismo appId:**
```json
// ✓ CORRECTO - Preserva datos
"appId": "com.panaderia.costos"
```

---

## 🔄 Flujo Completo de Actualización:

```
Usuario tiene v1.0.2 instalada
├─ Historial guardado en localStorage
├─ Datos guardados en: /data/data/com.panaderia.costos/

Lanzas v1.0.5
├─ Compilas en GitHub con nuevo APK
├─ Publicas en Releases

Usuario descarga v1.0.5
├─ Mismo appId: com.panaderia.costos ✅
├─ Android permite actualizar
├─ Nuevos archivos reemplazan los antiguos
├─ ✅ localStorage se mantiene intacto

App se abre
├─ Lee localStorage
├─ Carga historial
├─ Todo funciona normalmente
```

---

## 📱 Datos que se Preservan:

✅ Historial de producción (`productionHistory`)  
✅ Ingredientes  
✅ Configuración  
✅ Cualquier cosa guardada en `localStorage`  

❌ NO se preservan:
- Cache de navegador
- Cookies (si las usaras)
- Preferencias del sistema

---

## 🎊 ¡Ya está configurado!

Tu app **YA está lista** para actualizarse sin perder datos porque:

1. ✅ Usa `localStorage` (persiste entre actualizaciones)
2. ✅ `appId` siempre será `com.panaderia.costos`
3. ✅ Android preserva datos cuando el packageName es igual

Solo necesitas:
1. Actualizar `package.json` con la nueva versión
2. Crear un tag
3. GitHub compila el nuevo APK
4. Usuarios pueden actualizar y mantienen sus datos

---

**Generado:** 28/11/2025  
**Versión:** Configuración completa para actualizaciones sin pérdida de datos
