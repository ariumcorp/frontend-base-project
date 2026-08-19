#!/bin/sh
# Genera env-config.js con las variables de entorno de runtime.
# Solo se exponen variables con prefijo VITE_ (config de runtime).
set -eu

OUTPUT=/usr/share/nginx/html/env-config.js

printf 'window._env_ = {\n' > "$OUTPUT"

# IFS='=' + read -r key rest: maneja valores con espacios y múltiples '='
env | grep -E '^VITE_' | while IFS='=' read -r key rest; do
    # Escapar backslashes y comillas dobles para JS string literal seguro
    escaped=$(printf '%s' "$rest" | sed 's/\\/\\\\/g; s/"/\\"/g')
    printf '  %s: "%s",\n' "$key" "$escaped" >> "$OUTPUT"
done

printf '};\n' >> "$OUTPUT"
echo "env-config.js generated"
