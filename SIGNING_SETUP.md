# Instrucciones para Configurar Firma de APK

## Generar clave de firma (solo primera vez)

```bash
# En Windows PowerShell (asumiendo JDK instalado):
$jdk_path = "C:\Program Files\Java\jdk-17" # Ajusta según tu instalación
& "$jdk_path\bin\keytool.exe" -genkey -v -keystore panaderia-costos.keystore `
  -keyalg RSA -keysize 2048 -validity 10000 -alias panaderia-key `
  -storepass tu_contraseña_keystore -keypass tu_contraseña_clave `
  -dname "CN=Panadería Costos Pro, O=Your Company, C=ES"
```

O usando Git Bash:
```bash
keytool -genkey -v -keystore panaderia-costos.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias panaderia-key
```

## Codificar clave para GitHub Secrets

```bash
# PowerShell
$file_content = Get-Content "panaderia-costos.keystore" -Encoding Byte
$base64 = [Convert]::ToBase64String($file_content)
Set-Clipboard -Value $base64
Write-Host "Clave en base64 copiada al portapapeles"
```

O en bash:
```bash
base64 -w 0 panaderia-costos.keystore | xclip -selection clipboard
```

## Guardar secretos en GitHub

1. Ve a tu repositorio → Settings → Secrets and variables → Actions
2. Haz click en "New repository secret"
3. Crea estos secretos:

| Nombre | Valor |
|--------|-------|
| `GEMINI_API_KEY` | Tu clave de API de Gemini |
| `SIGNING_KEY` | Contenido del keystore en base64 |
| `KEY_ALIAS` | `panaderia-key` (o el que uses) |
| `KEY_STORE_PASSWORD` | La contraseña del keystore |
| `KEY_PASSWORD` | La contraseña de la clave |

## Referencia

- [Documentación Capacitor - Android](https://capacitorjs.com/docs/android)
- [Android Signing](https://developer.android.com/studio/publish/app-signing)
