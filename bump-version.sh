#!/bin/bash
# Script para actualizar la versión y compilar el APK

if [ -z "$1" ]; then
    echo "Uso: ./bump-version.sh <nueva-versión>"
    echo "Ejemplo: ./bump-version.sh 1.0.5"
    exit 1
fi

NEW_VERSION=$1

echo "🚀 Actualizando versión a $NEW_VERSION..."

# Actualizar package.json
sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$NEW_VERSION\"/g" package.json

echo "✅ package.json actualizado"
echo "📦 Versión: $NEW_VERSION"

# Mostrar el cambio
echo ""
echo "Cambios realizados:"
grep "version" package.json | head -1

echo ""
echo "Próximos pasos:"
echo "1. git add package.json"
echo "2. git commit -m \"bump: version $NEW_VERSION\""
echo "3. git tag -a v$NEW_VERSION -m \"Release v$NEW_VERSION\""
echo "4. git push origin main"
echo "5. git push origin v$NEW_VERSION"
