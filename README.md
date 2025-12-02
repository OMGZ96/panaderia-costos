<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🍞 Panadería Costos Pro

Aplicación web y móvil para gestionar costos de producción y análisis de ventas en panaderías, potenciada con IA mediante Google Gemini.

## ✨ Características

- 📊 Análisis detallado de costos y ventas
- 🤖 Análisis inteligente con Google Gemini AI
- 📈 Gráficos interactivos en tiempo real
- 💾 Exportación a Excel
- 📱 Compatible con web y Android (APK)
- 🔄 Interfaz responsiva y moderna
- 💾 Historial de análisis y transacciones

## 🚀 Quick Start

### 1. Ejecutar Localmente (Web)

```bash
# Clonar el repositorio
git clone https://github.com/OMGZ96/panaderia-costos.git
cd panaderia-costos

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.local.example .env.local

# Agregar tu clave de Gemini en .env.local
# Obtén una en https://ai.google.dev/

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 2. Descargar APK (Recomendado para Móvil)

Los APKs se compilan automáticamente en cada actualización.

**Descargar desde GitHub Actions:**

1. Ve a la pestaña **"Actions"**
2. Selecciona el workflow **"Build Android APK"**
3. Descarga el archivo `panaderia-costos-debug.zip`
4. Extrae e instala el APK en tu dispositivo Android

**O desde Releases:**

- Ve a la pestaña **"Releases"**
- Descarga el APK de la versión deseada

### 3. Compilar APK Localmente

Ver [QUICK_START_APK.md](QUICK_START_APK.md) para instrucciones detalladas.

## 📋 Requisitos

### Para ejecutar la web

- Node.js 18+
- npm o yarn

### Para compilar APK

- Node.js 18+
- Java JDK 17+
- Android SDK 34+
- Gradle 8.x

## 🛠️ Scripts Disponibles

```bash
npm run dev              # Inicia servidor de desarrollo
npm run build            # Construye para producción (web)
npm run preview          # Vista previa del build

# Comandos para Android
npm run cap:add          # Agrega plataforma Android
npm run cap:sync         # Sincroniza cambios con Android
npm run cap:open         # Abre Android Studio
npm run android:debug    # Construye APK debug
npm run android:release  # Construye APK release
npm run android:build    # Build completo (web + APK)
```

## 📁 Estructura del Proyecto

```
panaderia-costos/
├── components/              # Componentes React
│   ├── AnalysisModal.tsx
│   ├── SalesConfirmationModal.tsx
│   ├── HistoryModal.tsx
│   └── ...
├── services/
│   └── geminiService.ts     # Integración con Gemini API
├── App.tsx                  # Aplicación principal
├── index.tsx                # Punto de entrada
├── types.ts                 # Tipos TypeScript
├── constants.ts             # Constantes
├── .github/workflows/
│   └── build-apk.yml        # Workflow para compilar APK
├── android/                 # Proyecto Android (generado)
├── capacitor.config.ts      # Configuración de Capacitor
├── vite.config.ts           # Configuración de Vite
└── package.json
```

## ⚙️ Configuración

### Variables de Entorno

Copia `.env.local.example` a `.env.local` y configura:

```env
# Tu clave de API de Gemini (obligatoria)
VITE_GEMINI_API_KEY=tu_clave_aqui
```

Obtén tu clave en: <https://ai.google.dev/>

### GitHub Secrets (Para CI/CD automático)

Para que el workflow automático funcione, configura estos secretos:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agrega `GEMINI_API_KEY` con tu clave de API

Ver [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md) para más detalles.

## 📱 Instalación del APK

### Desde un dispositivo Android

1. Habilita **"Instalar desde fuentes desconocidas"** en Ajustes
2. Descarga el APK
3. Abre el archivo descargado para instalar
4. Aceptar permisos

### Desde terminal (adb)

```bash
adb install -r app-debug.apk
```

## 🔧 Desarrollo

### Estructura de Componentes

- **AnalysisModal**: Modal para análisis con IA
- **SalesConfirmationModal**: Confirmación de ventas
- **HistoryModal**: Historial de transacciones
- **TrendChart**: Gráficos de tendencias
- **SummaryCard**: Resumen de datos

### Agregar una Característica

1. Crea el componente en `components/`
2. Importa en `App.tsx`
3. Agrega los tipos en `types.ts` si es necesario
4. Commit y push para activar CI/CD

## 🐛 Solución de Problemas

### Error: "VITE_GEMINI_API_KEY is not defined"

- Verifica que `.env.local` existe
- Recarga el servidor (Ctrl+C y `npm run dev`)

### Error al compilar APK: "Command 'gradlew' not found"

- Ejecuta: `npm run cap:add` nuevamente
- Verifica que Java está instalado: `java -version`

### Puerto 3000 en uso

- Cambia el puerto en `vite.config.ts`
- O ejecuta: `npm run dev -- --port 3001`

## 📚 Documentación

- [QUICK_START_APK.md](./QUICK_START_APK.md) - Guía rápida para APK
- [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) - Configurar CI/CD
- [SIGNING_SETUP.md](./SIGNING_SETUP.md) - Firma de APK
- [Capacitor Docs](https://capacitorjs.com/)
- [Google Gemini API](https://ai.google.dev/)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit cambios: `git commit -m 'feat: Agregar mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT - ver [LICENSE](LICENSE) para más detalles.

## 📞 Soporte y Reporte de Bugs

- Abre un [Issue en GitHub](https://github.com/OMGZ96/panaderia-costos/issues)
- Proporciona el máximo detalle posible sobre el problema
- Incluye screenshots si es relevante

## 🎯 Roadmap

- [ ] Soporte para múltiples idiomas
- [ ] Base de datos en la nube
- [ ] Autenticación de usuarios
- [ ] Reportes avanzados en PDF
- [ ] Versión iOS

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.6
