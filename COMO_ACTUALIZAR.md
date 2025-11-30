# 🔄 Cómo Actualizar la App Sin Perder Datos

## ✅ La Buena Noticia

**Tu app YA está configurada para preservar datos entre actualizaciones.**

- ✅ Usa `localStorage` (persiste datos entre versiones)
- ✅ `appId` siempre igual: `com.panaderia.costos`
- ✅ Android automáticamente preserva datos locales

---

## 🚀 Pasos para Actualizar a Nueva Versión

### Opción A: Actualización Rápida (Recomendado)

#### Paso 1: Actualizar versión con PowerShell
```powershell
# En tu PC (donde está el código)
.\bump-version.ps1 -Version 1.0.5
```

Esto automáticamente:
- Actualiza `package.json` con versión 1.0.5
- Muestra los próximos pasos

#### Paso 2: Subir cambios a GitHub
```bash
git add package.json
git commit -m "bump: version 1.0.5"
git tag -a v1.0.5 -m "Release v1.0.5"
git push origin main
git push origin v1.0.5
```

#### Paso 3: GitHub compila automáticamente
- GitHub Actions detecta el tag v1.0.5
- Compila automáticamente el APK
- Lo publica en Releases (en ~2-5 minutos)

---

### Opción B: Actualización Manual

#### Paso 1: Editar package.json
Abre el archivo `package.json` y cambiar:
```json
// Antes
"version": "1.0.4"

// Después
"version": "1.0.5"
```

#### Paso 2: Subir a GitHub
```bash
git add package.json
git commit -m "bump: version 1.0.5"
git tag -a v1.0.5 -m "Release v1.0.5"
git push origin main
git push origin v1.0.5
```

#### Paso 3: Esperar compilación
- Ve a: https://github.com/OMGZ96/panaderia-costos/actions
- Verás el workflow compilando
- En 2-5 minutos estará listo

---

## 📱 Usuario Instala Actualización

### En el Teléfono:

1. **Descarga el APK v1.0.5** desde GitHub Releases
2. **Abre el archivo APK**
3. Toca **"Actualizar"** (no "Instalar")
4. **¡Listo!** App se actualiza
5. **Los datos se preservan automáticamente** ✨

### ¿Qué sucede en segundo plano?

```
Tu teléfono detecta:
├─ Mismo appId (com.panaderia.costos) ✅
├─ Versión más nueva (1.0.5) ✅
├─ Archivo de actualización válido ✅

Android realiza:
├─ Copia los datos a carpeta temporal
├─ Desinstala versión anterior
├─ Instala versión nueva
├─ Restaura los datos
├─ ✅ TODO FUNCIONA IGUAL
```

---

## 💾 Datos Que Se Preservan

✅ **Historial de producción** - Todos los lotes registrados  
✅ **Ingredientes** - Recetas y precios  
✅ **Stock** - Cantidad de materiales  
✅ **Configuración** - Preferencias guardadas  

Esto se guarda automáticamente en:
```
/data/data/com.panaderia.costos/app_webview/
```

Android **protege esta carpeta** durante actualizaciones.

---

## 📊 Ejemplo: De v1.0.4 a v1.0.5

```bash
# Estado actual: v1.0.4 instalada en teléfono
# Con historial: 45 lotes registrados

# Comando en tu PC:
.\bump-version.ps1 -Version 1.0.5

# Resultado en package.json:
"version": "1.0.5"

# Commits:
git add package.json
git commit -m "bump: version 1.0.5"
git tag -a v1.0.5 -m "Release v1.0.5"
git push origin v1.0.5

# GitHub compila el APK v1.0.5

# Usuario descarga e instala APK v1.0.5
# ✅ 45 lotes siguen en el historial
# ✅ Configuración intacta
# ✅ Datos preservados
```

---

## 🔄 Ciclo de Vida Completo

```
Día 1: Usuario instala v1.0.0
  └─ Crea 10 registros
  └─ Guarda en localStorage

Día 2: Lanzas v1.0.1
  └─ Actualiza package.json
  └─ git push v1.0.1
  └─ GitHub compila

Día 2 (tarde): Usuario actualiza a v1.0.1
  └─ ✅ Los 10 registros se preservan

Día 3: Usuario crea 5 registros más (total: 15)

Día 7: Lanzas v1.0.5
  └─ .\bump-version.ps1 -Version 1.0.5
  └─ git push v1.0.5

Día 7 (tarde): Usuario actualiza a v1.0.5
  └─ ✅ Los 15 registros siguen ahí
  └─ App funciona normalmente
```

---

## ⚠️ IMPORTANTE: No Hagas Esto

❌ **Nunca cambies el appId**
```json
// MALO - Perderá datos
"appId": "com.panaderia.nueva"
```

❌ **No cambie el package.json estructura**
```json
// Cambiar SOLO el número de versión
// ✓ "version": "1.0.5"
// ✗ "name": "otro-nombre"
```

---

## 🛠️ Archivos de Ayuda

### `bump-version.ps1` (Windows)
```bash
.\bump-version.ps1 -Version 1.0.5
```
Actualiza versión automáticamente

### `bump-version.sh` (Linux/Mac)
```bash
./bump-version.sh 1.0.5
```
Igual que PowerShell pero para Linux/Mac

### `ACTUALIZACION_SIN_PERDER_DATOS.md`
Documentación técnica completa

---

## 📋 Checklist para Nueva Actualización

- [ ] Editaste los archivos que querías (App.tsx, etc.)
- [ ] Probaste los cambios localmente: `npm run dev`
- [ ] Ejecutaste: `.\bump-version.ps1 -Version X.X.X`
- [ ] Verificaste que package.json cambió
- [ ] Hiciste `git add package.json`
- [ ] Hiciste `git commit -m "bump: version X.X.X"`
- [ ] Creaste tag: `git tag -a vX.X.X -m "..."`
- [ ] Hiciste `git push origin main`
- [ ] Hiciste `git push origin vX.X.X`
- [ ] Fuiste a Actions y verificaste que compila
- [ ] Descargaste el APK de Releases
- [ ] Probaste en tu teléfono

---

## 🎯 Resumen Rápido

| Necesidad | Comando |
|-----------|---------|
| Actualizar a v1.0.5 | `.\bump-version.ps1 -Version 1.0.5` |
| Comitear cambios | `git add package.json && git commit -m "bump: v1.0.5"` |
| Compilar APK | `git tag -a v1.0.5 -m "..." && git push origin v1.0.5` |
| Ver compilación | https://github.com/OMGZ96/panaderia-costos/actions |
| Descargar APK | https://github.com/OMGZ96/panaderia-costos/releases |

---

## ✨ Lo Mejor

**No necesitas hacer NADA especial para preservar datos.**

Android automáticamente:
- ✅ Detecta que es la misma app (mismo appId)
- ✅ Preserva los datos locales
- ✅ Actualiza los archivos de la app
- ✅ Inicia la app con los datos intactos

**Solo actualiza versión en package.json y deja que GitHub compile.**

---

**¿Preguntas?** Revisa: `ACTUALIZACION_SIN_PERDER_DATOS.md`

Generado: 28/11/2025
