# ⚙️ Configuración de GitHub Secrets para CI/CD

Para que el workflow automático compile APKs correctamente, necesitas configurar estos secretos en GitHub.

## Pasos para Agregar Secretos

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

## Secretos Requeridos

### 1. `GEMINI_API_KEY` (Obligatorio)
Tu clave de API de Gemini para la funcionalidad de IA.

**Cómo obtenerla:**
- Visita https://ai.google.dev/
- Click en "Get API Key"
- Copia la clave generada
- Pégala en el secreto

**Ejemplo:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Secretos Opcionales (Para APK Firmado)

Si deseas que el workflow genere APKs firmados automáticamente, necesitas:

#### `SIGNING_KEY`
Tu keystore en formato base64.

**Cómo generarla:**

En PowerShell (Windows):
```powershell
$keystore_path = "path\to\panaderia.keystore"
$file_content = [IO.File]::ReadAllBytes($keystore_path)
$base64 = [Convert]::ToBase64String($file_content)
Set-Clipboard -Value $base64
Write-Host "Clave copiada al portapapeles"
```

En Bash (Linux/Mac):
```bash
base64 -w 0 panaderia.keystore | xclip -selection clipboard
```

#### `KEY_ALIAS`
El alias de tu clave (por defecto: `panaderia-key`)

#### `KEY_STORE_PASSWORD`
La contraseña de tu keystore

#### `KEY_PASSWORD`
La contraseña de tu clave privada

## Para Generar un Keystore

Si no tienes uno, crea uno:

```bash
keytool -genkey -v -keystore panaderia.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias panaderia-key
```

O usa el script proporcionado:
```bash
# En Linux/Mac
bash setup-build-env.sh

# En Windows
powershell -ExecutionPolicy Bypass -File setup-build-env.ps1
```

## Verificar Secretos

Puedes verificar que los secretos están configurados en:
Settings → Secrets and variables → Actions

## Resultado

Una vez configurados, el workflow:
- ✅ Compilará APK automáticamente en cada push
- ✅ Subirá los APKs como artifacts descargables
- ✅ Creará releases con los APKs si usas tags

## Soporte

Si tienes problemas:
1. Revisa los logs en la pestaña "Actions"
2. Verifica que los secretos estén correctamente configurados
3. Asegúrate de que tu clave de Gemini sea válida
