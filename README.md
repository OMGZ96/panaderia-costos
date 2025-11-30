# Panadería Costos Pro

Aplicación web y móvil para gestionar costos y análisis de ventas en panaderías, potenciada con IA mediante Gemini API.

## Características

- 📊 Análisis de costos y ventas con gráficos interactivos
- 🤖 Análisis inteligente con IA (Gemini)
- 💾 Exportación a Excel
- 📱 Compatible con web y Android (APK)
- 🔄 Interfaz reactiva con React

## Requisitos Previos

- Node.js 18+
- Para generar APK: Java 17, Android SDK

## Instalación Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/OMGZ96/panaderia-costos.git
   cd panaderia-costos
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo `.env.local` (basado en `.env.local.example`):
   ```bash
   cp .env.local.example .env.local
   ```

4. Agregar tu clave de API de Gemini en `.env.local`:
   ```
   VITE_GEMINI_API_KEY=tu_clave_gemini_aqui
   ```
   
   Obtén tu clave en: https://ai.google.dev/

5. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

   La app estará disponible en `http://localhost:3000`

## Generar APK

### Prerequisitos para Android
- Java Development Kit (JDK) 17+
- Android SDK 34+
- Gradle 8.x

### Build local del APK

1. Compilar la aplicación web:
   ```bash
   npm run build
   ```

2. Agregar plataforma Android (primera vez):
   ```bash
   npm run cap:add
   ```

3. Sincronizar cambios:
   ```bash
   npm run cap:sync
   ```

4. Abrir Android Studio:
   ```bash
   npm run cap:open
   ```

5. Compilar en Android Studio:
   - En Android Studio, ve a `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Espera a que se complete la compilación
   - El APK estará en `android/app/build/outputs/apk/release/`

### Compilación automática con GitHub Actions

El APK se compila automáticamente en cada push. Para acceder a los APK:

1. Ve a la pestaña "Actions" en el repositorio
2. Selecciona el workflow "Build Android APK"
3. Descarga el artifact `panaderia-costos-pro-apk`

## Configuración de Firma para Release

Para releases automáticos, configura estos secrets en GitHub:
- `GEMINI_API_KEY`: Tu clave de API de Gemini
- `SIGNING_KEY`: Clave privada en base64
- `KEY_ALIAS`: Alias de la clave
- `KEY_STORE_PASSWORD`: Contraseña del keystore
- `KEY_PASSWORD`: Contraseña de la clave

## Scripts disponibles

```bash
npm run dev              # Desarrollo local
npm run build            # Build producción (web)
npm run preview          # Preview del build
npm run cap             # Comando Capacitor
npm run cap:add         # Agregar plataforma Android
npm run cap:sync        # Sincronizar con Android
npm run cap:open        # Abrir Android Studio
npm run cap:build       # Build release de Capacitor
npm run cap:run         # Ejecutar con livereload
npm run android:build   # Build completo (web + Android)
```

## Desarrollo

Este proyecto usa:
- **React 19** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Capacitor** - Framework para apps móviles
- **Gemini API** - IA para análisis

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo licencia MIT.

## Soporte

Para reportar bugs o sugerencias, abre un issue en el repositorio.
