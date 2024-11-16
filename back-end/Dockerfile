# Use the official lightweight Python image.
FROM python:3.9-slim

# Set environment variables
ENV PYTHONUNBUFFERED = True
ENV APP_HOME = /app

# Set the working directory in the container
WORKDIR $APP_HOME

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# COPY app ./app
COPY app/ ./app/

# Expose port 8080 (the default port for Cloud Run)
EXPOSE 8080

# Set environment variables
# ENV PORT 8080

# Command to run the application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--threads", "8", "flask_app_instance:app"]