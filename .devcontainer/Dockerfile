FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g npm@latest 