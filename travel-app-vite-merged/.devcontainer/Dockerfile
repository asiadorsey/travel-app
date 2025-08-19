FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        git \
        curl \
        wget \
        vim \
        nano \
        htop \
        tree \
    && apt-get autoremove -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Ensure npm is up to date
RUN npm install -g npm@latest

# Install global development tools
RUN npm install -g \
    @vitejs/plugin-react \
    eslint \
    prettier \
    typescript

# Set environment variables
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Expose ports
EXPOSE 5173 3000

# Default command
CMD ["sleep", "infinity"]
