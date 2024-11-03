# Use the official lightweight Python image.
# Use Python 3.9-slim as TensorFlow 2.7 may not support Python 3.10+.
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /venv3.9

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY requirements.txt requirements.txt

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8080 (the default port for Cloud Run)
EXPOSE 8080

# Command to run when starting the container
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "venv3.9.main:app"]