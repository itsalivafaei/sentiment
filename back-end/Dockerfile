# Use the official lightweight Python image.
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY app ./app

# Expose port 8080 (the default port for Cloud Run)
EXPOSE 8080

# Command to run when starting the container
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app.main:app"]