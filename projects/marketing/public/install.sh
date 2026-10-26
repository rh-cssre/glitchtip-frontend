#!/bin/sh
set -e

# --- Configuration ---
PROJECT_URL="https://gitlab.com/glitchtip/glitchtip-cli"
LATEST_TAG="__GLITCHTIP_CLI_VERSION__"

echo "Installing GlitchTip CLI..."

if [ "$LATEST_TAG" = "\_\_GLITCHTIP_CLI_VERSION\_\_" ]; then
    echo "Warning: Version placeholder was not replaced. Attempting to fetch latest version dynamically..."
    PROJECT_API="https://gitlab.com/api/v4/projects/glitchtip%2Fglitchtip-cli"
    LATEST_TAG=$(curl -s "$PROJECT_API/releases" | grep '"tag_name":' | head -n 1 | awk -F'"' '{print $4}')
    
    if [ -z "$LATEST_TAG" ]; then
        echo "Error: Failed to fetch the latest release tag from GitLab."
        echo "Fallback: Try installing via cargo:"
        echo "  cargo install glitchtip-cli"
        exit 1
    fi
fi

# --- Detect OS & Architecture ---
OS="$(uname -s)"
ARCH="$(uname -m)"

TARGET_OS=""
TARGET_ARCH=""

case "$OS" in
    Linux) TARGET_OS="linux" ;;
    Darwin) TARGET_OS="macos" ;;
    MINGW*|CYGWIN*|MSYS*) TARGET_OS="windows" ;;
    *)
        echo "Unsupported OS: $OS"
        echo "Fallback: Try installing via cargo:"
        echo "  cargo install glitchtip-cli"
        exit 1
        ;;
esac

case "$ARCH" in
    x86_64|amd64) TARGET_ARCH="x86_64" ;;
    arm64|aarch64) TARGET_ARCH="arm64" ;;
    *)
        echo "Unsupported architecture: $ARCH"
        echo "Fallback: Try installing via cargo:"
        echo "  cargo install glitchtip-cli"
        exit 1
        ;;
esac

# --- Check for missing CI targets ---
if [ "$TARGET_OS" = "macos" ] && [ "$TARGET_ARCH" = "x86_64" ]; then
    echo "No pre-built binary available for macOS x86_64 (Intel)."
    echo "Please install via cargo:"
    echo "  cargo install glitchtip-cli"
    exit 1
fi

if [ "$TARGET_OS" = "windows" ] && [ "$TARGET_ARCH" = "arm64" ]; then
    echo "No pre-built binary available for Windows ARM64."
    echo "Please install via cargo:"
    echo "  cargo install glitchtip-cli"
    exit 1
fi

# --- Map to GitLab Artifacts ---
if [ "$TARGET_OS" = "windows" ]; then
    BIN_NAME="glitchtip-cli.exe"
    ARTIFACT_NAME="glitchtip-cli-windows-x86_64.exe"
else
    BIN_NAME="glitchtip-cli"
    ARTIFACT_NAME="glitchtip-cli-${TARGET_OS}-${TARGET_ARCH}"
fi

JOB_NAME="build-${TARGET_OS}-${TARGET_ARCH}"

DOWNLOAD_URL="${PROJECT_URL}/-/jobs/artifacts/${LATEST_TAG}/raw/artifacts/${ARTIFACT_NAME}?job=${JOB_NAME}"

# --- Download & Install ---
echo "Downloading $BIN_NAME $LATEST_TAG for $TARGET_OS-$TARGET_ARCH..."

TMP_DIR=$(mktemp -d)
if ! curl -fL "$DOWNLOAD_URL" -o "$TMP_DIR/$BIN_NAME"; then
    echo "Error: Failed to download binary."
    echo "Fallback: Try installing via cargo:"
    echo "  cargo install glitchtip-cli"
    rm -rf "$TMP_DIR"
    exit 1
fi

chmod +x "$TMP_DIR/$BIN_NAME"

# Determine install location
INSTALL_DIR="/usr/local/bin"
if [ ! -w "$INSTALL_DIR" ]; then
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
fi

mv "$TMP_DIR/$BIN_NAME" "$INSTALL_DIR/$BIN_NAME"
rm -rf "$TMP_DIR"

echo "Successfully installed $BIN_NAME to $INSTALL_DIR!"

if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo ""
    echo "⚠️  Note: $INSTALL_DIR is not in your PATH."
    echo "Please add it to your shell configuration file (e.g., ~/.bashrc or ~/.zshrc):"
    echo "  export PATH=\"\$PATH:$INSTALL_DIR\""
fi
