# Development container for Farm Match
FROM node:20-bookworm

# Install Python and other dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    python3-venv \
    postgresql-client \
    git \
    curl \
    wget \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (handle existing GID/UID)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN if getent group $USER_GID; then \
        existing_group=$(getent group $USER_GID | cut -d: -f1); \
        groupmod -n $USERNAME $existing_group || true; \
    else \
        groupadd --gid $USER_GID $USERNAME; \
    fi \
    && if id -u $USER_UID > /dev/null 2>&1; then \
        existing_user=$(id -nu $USER_UID); \
        usermod -l $USERNAME -d /home/$USERNAME -m $existing_user || true; \
    else \
        useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash; \
    fi \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Setup Python
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1 \
    && update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

# Remove PEP 668 externally managed environment restriction
RUN rm -f /usr/lib/python3.11/EXTERNALLY-MANAGED

# Install Python dependencies
COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

# Install global Node.js tools
RUN npm install -g npm@latest

# Set working directory
WORKDIR /workspace

# Switch to non-root user
USER $USERNAME

CMD ["/bin/bash"]
