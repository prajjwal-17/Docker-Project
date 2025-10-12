# Step 1: Use Python 3.12 slim image
FROM python:3.12-slim

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies + netcat-openbsd for wait-for-db.sh
RUN apt-get update && apt-get install -y \
    netcat-openbsd gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Step 4: Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy backend code
COPY . .

# Step 6: Expose Flask port
EXPOSE 5000

# Step 7: Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

# Step 8: Run wait-for-db.sh first, then start Flask
CMD ["./wait-for-db.sh", "db", "5000", "flask", "run"]
