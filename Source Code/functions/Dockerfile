# Use Google Cloud Run optimized Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables for Google Cloud Run
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=8080

# Install system dependencies (minimal for Cloud Run)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security (Google Cloud Run best practice)
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Google Cloud Run handles health checks, so we don't need HEALTHCHECK

# Run the application with gunicorn (optimized for Cloud Run)
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 --preload app:app