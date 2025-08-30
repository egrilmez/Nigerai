FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Create directory for models
RUN mkdir -p /root/.ollama

# Set environment variables
ENV OLLAMA_ORIGINS="*"
ENV OLLAMA_HOST="0.0.0.0"
ENV PORT=11434

# Expose port
EXPOSE 11434

# Start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]