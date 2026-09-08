#!/bin/bash
set -e

echo "=== Installing Flutter ==="
FLUTTER_VERSION="3.44.8"
FLUTTER_DIR="$HOME/flutter"

if [ ! -d "$FLUTTER_DIR" ]; then
  wget -q "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz" -O flutter.tar.xz
  tar xf flutter.tar.xz -C "$HOME"
  rm flutter.tar.xz
fi

export PATH="$FLUTTER_DIR/bin:$PATH"

echo "=== Flutter version ==="
flutter --version

echo "=== Enabling web ==="
flutter config --enable-web

echo "=== Getting dependencies ==="
flutter pub get

echo "=== Building web ==="
flutter build web --release

echo "=== Build complete! ==="
ls build/web
