#!/bin/bash
#============================================================
# STUDEX FLEET — UNIVERSAL INSTALL SCRIPT
# Run on any machine: Linux, macOS, WSL2, Termux
#============================================================
set -e

STUDEX_SERVER="${STUDEX_SERVER:-10.0.0.1:2244}"  # Herdr server IP
STUDEX_USER="${STUDEX_USER:-tumelo}"
STUDEX_DIR="${STUDEX_DIR:-$HOME/studex}"

echo "=========================================="
echo "  STUDEX FLEET — Universal Install"
echo "  Machine: $(hostname)"
echo "  Herdr Server: $STUDEX_SERVER"
echo "=========================================="

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    elif [ "$(uname)" = "Darwin" ]; then
        echo "macos"
    elif [ -d /data/data/com.termux ]; then
        echo "termux"
    elif grep -qEi "(Microsoft|WSL)" /proc/version; then
        echo "wsl"
    else
        echo "unknown"
    fi
}

OS=$(detect_os)
echo "Detected OS: $OS"

# Create studex directory
mkdir -p "$STUDEX_DIR"
cd "$STUDEX_DIR"

#============================================================
# 1. TAILSCALE
#============================================================
echo ""
echo "[1/6] Setting up Tailscale..."

install_tailscale() {
    case "$OS" in
        ubuntu|debian)
            curl -fsSL https://tailscale.com/install.sh | sh || sudo curl -fsSL https://tailscale.com/install.sh | sh
            ;;
        fedora|rhel|centos)
            sudo dnf install -y tailscale
            ;;
        bazzite|fedora)
            sudo rpm-ostree install tailscale
            ;;
        arch)
            sudo pacman -S --noconfirm tailscale
            ;;
        macos)
            brew install --cask tailscale
            ;;
        termux)
            pkg install tailscale
            ;;
        wsl)
            curl -fsSL https://tailscale.com/install.sh | sh
            ;;
        *)
            echo "  Skipping Tailscale (unknown OS: $OS)"
            return 0
            ;;
    esac
}

# Check if tailscale is already running
if ! command -v tailscale &>/dev/null && ! [ -f /usr/sbin/tailscaled ]; then
    install_tailscale
else
    echo "  Tailscale already installed"
fi

# Start tailscaled if needed
if command -v tailscaled &>/dev/null && ! pgrep -x tailscaled &>/dev/null; then
    sudo tailscaled &
    sleep 2
fi

# Connect to Tailscale (need auth key from tailscale.com/consol)
if command -v tailscale &>/dev/null; then
    if ! sudo tailscale status &>/dev/null; then
        echo "  Tailscale not logged in. Run: sudo tailscale up --accept-routes"
        echo "  Or set TAILSCALE_AUTH_KEY env var for unattended setup"
    else
        echo "  Tailscale: Connected"
    fi
fi

#============================================================
# 2. OLLAMA
#============================================================
echo ""
echo "[2/6] Setting up Ollama..."

if command -v ollama &>/dev/null; then
    echo "  Ollama already installed: $(ollama --version)"
    OLLAMA_VERSION=$(ollama --version 2>/dev/null || echo "unknown")
else
    echo "  Installing Ollama..."
    curl -fsSL https://ollama.ai/install.sh | sh
    echo "  Ollama installed"
fi

# Start ollama if not running
if ! pgrep -x ollama &>/dev/null; then
    ollama serve &
    sleep 3
    echo "  Ollama server started on port 11434"
else
    echo "  Ollama server already running"
fi

# Pull essential models
echo "  Pulling models (this may take a while)..."
ollama pull qwen2.5-coder:7b 2>/dev/null || echo "  qwen2.5-coder:7b pull skipped (or failed)"
ollama pull qwen2.5:14b 2>/dev/null || echo "  qwen2.5:14b pull skipped (or failed)"

#============================================================
# 3. HERDR AGENT
#============================================================
echo ""
echo "[3/6] Installing Herdr agent..."

if command -v herdr &>/dev/null; then
    echo "  Herdr already installed"
else
    echo "  Installing Herdr..."
    curl -fsSL https://herdr.dev/install.sh | sh
    echo "  Herdr installed"
fi

# Create herdr config
mkdir -p "$HOME/.config/herdr"
cat > "$HOME/.config/herdr/hermes.toml" << 'HERDRCONFIG'
[agent]
name = "studex-agent"
server = "{{HERDR_SERVER}}"
hostname = "{{HOSTNAME}}"

[agent.tags]
role = "homelab-node"
os = "{{OS}}"
fleet = "studex-warehouse"

[runtime]
ollama_url = "http://localhost:11434"
HERDRCONFIG

# Replace placeholders
sed -i "s/{{HERDR_SERVER}}/$STUDEX_SERVER/g" "$HOME/.config/herdr/hermes.toml"
sed -i "s/{{HOSTNAME}}/$(hostname)/g" "$HOME/.config/herdr/hermes.toml"
sed -i "s/{{OS}}/$OS/g" "$HOME/.config/herdr/hermes.toml"

# Start herdr agent
if command -v herdr &>/dev/null; then
    if ! pgrep -f "herdr agent" &>/dev/null; then
        herdr agent --server "$STUDEX_SERVER" &
        echo "  Herdr agent started"
    else
        echo "  Herdr agent already running"
    fi
fi

#============================================================
# 4. STUDENT INTELLIGENCE SCANNER
#============================================================
echo ""
echo "[4/6] Cloning Studex Intelligence..."

if [ -d "$STUDEX_DIR/studex-intelligence" ]; then
    cd "$STUDEX_DIR/studex-intelligence"
    git pull 2>/dev/null || echo "  Pull failed, using existing"
    cd "$STUDEX_DIR"
else
    git clone https://github.com/studex-os/studex-intelligence "$STUDEX_DIR/studex-intelligence"
fi

#============================================================
# 5. DOCKER (Linux only)
#============================================================
echo ""
echo "[5/6] Docker setup..."

if [ "$OS" != "termux" ] && [ "$OS" != "macos" ]; then
    if ! command -v docker &>/dev/null; then
        echo "  Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        sudo usermod -aG docker "$STUDEX_USER"
        echo "  Docker installed"
    else
        echo "  Docker already installed"
    fi
    
    if ! command -v docker &>/dev/null && command -v sudo &>/dev/null; then
        sudo systemctl enable docker 2>/dev/null || true
        sudo systemctl start docker 2>/dev/null || true
    fi
elif [ "$OS" = "macos" ]; then
    if ! command -v docker &>/dev/null; then
        echo "  Install Docker Desktop from https://docker.com/products/docker-desktop"
    fi
fi

#============================================================
# 6. STUDEX CLI ALIAS
#============================================================
echo ""
echo "[6/6] Setting up Studex CLI..."

cat >> "$HOME/.bashrc" << 'ALIAS'

# Studex Fleet
export STUDEX_DIR="$HOME/studex"
export STUDEX_HERDR="$STUDEX_SERVER"

# Studex aliases
alias studex-scan='python3 $STUDEX_DIR/studex-intelligence/scanner.py'
alias studex-status='curl -s localhost:11434/api/tags'
alias studex-models='ollama list'
alias herdr-status='herdr status'
ALIAS

echo "  Aliases added to ~/.bashrc"
echo "  Run 'source ~/.bashrc' or restart terminal"

#============================================================
# DONE
#============================================================
echo ""
echo "=========================================="
echo "  INSTALL COMPLETE"
echo "=========================================="
echo ""
echo "  Next steps:"
echo "  1. Connect to Tailscale: sudo tailscale up --accept-routes"
echo "  2. Start Ollama: ollama serve"
echo "  3. Test Ollama: curl http://localhost:11434/api/tags"
echo "  4. Run scanner: bash $STUDEX_DIR/studex-intelligence/scanner.py"
echo "  5. Get Tailscale IP: tailscale ip -4"
echo ""
echo "  Then give me your Tailscale IP and I'll add you to the fleet."
echo "=========================================="
