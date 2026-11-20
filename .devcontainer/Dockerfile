FROM python:3.14-slim-bookworm
RUN apt-get update \
    && apt-get install -y --no-install-recommends git openssh-client ca-certificates sudo \
    && rm -rf /var/lib/apt/lists/* \
    && useradd -m -s /bin/bash vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode
ENV PYTHONUNBUFFERED=1
USER vscode
