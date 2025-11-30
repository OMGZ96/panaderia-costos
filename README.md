# 🍞 Panadería Costos Pro

## Descripción
Aplicación web/móvil para gestionar costos de producción en panaderías, con inteligencia artificial integrada.

## 🚀 Características
- Análisis de costos de producción
- Integración con Google Gemini AI
- Exportación a Excel
- Historial de análisis
- Interfaz responsiva

## 📱 Plataformas Soportadas
- Web (navegador)
- Android (APK)

## 🛠️ Requisitos
- Node.js 18+
- JDK 17 (para Android)
- Android SDK (para compilar APK)

## 📦 Instalación Local

### Ejecutar en desarrollo
```bash
npm install
npm run dev
```

### Compilar APK localmente

**En Windows:**
```bash
setup-android.bat
```

**En macOS/Linux:**
```bash
bash setup-android.sh
```

## 🤖 Construcción Automática en GitHub

Este proyecto incluye GitHub Actions para compilar y firmar el APK automáticamente.

### Configuración requerida:

1. **Generar certificado de firma** - Ver [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)
2. **Configurar secretos en GitHub** - Ver [APK_BUILD_GUIDE.md](APK_BUILD_GUIDE.md)
3. **Crear un tag de release**:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

El APK se compilará automáticamente y estará disponible en los Releases de GitHub.

## 📁 Estructura del Proyecto

```
├── src/
│   ├── components/        # Componentes React
│   ├── services/         # Servicios (Gemini API)
│   ├── App.tsx          # Componente principal
│   └── index.tsx        # Punto de entrada
├── .github/workflows/   # GitHub Actions
├── capacitor.config.json # Configuración de Capacitor
├── vite.config.ts       # Configuración de Vite
└── package.json
```

## 🔒 Seguridad

- Las claves API se almacenan como secretos de GitHub
- El keystore de firma NUNCA debe ser commiteado
- Use variables de entorno para datos sensibles

## 📚 Documentación Adicional

- [APK Build Guide](./APK_BUILD_GUIDE.md) - Guía detallada para compilar APK
- [Capacitor Documentation](https://capacitorjs.com/)
- [Google Gemini API](https://ai.google.dev/)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Soporte

Para reportar problemas o sugerencias, abre un Issue en GitHub.
