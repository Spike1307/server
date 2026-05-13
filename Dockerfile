# Stage 1: Build the Java application
FROM eclipse-temurin:21 AS builder
WORKDIR /server
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application with nginx as reverse proxy
FROM eclipse-temurin:21
WORKDIR /server

# Install nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy the built jar
COPY --from=builder /server/target/server-0.0.1-SNAPSHOT.jar server.jar

# Copy static files to nginx's default html directory
COPY --from=builder /server/src/main/resources/static /var/www/html

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /var/www/html; \
    index index.html; \
    \
    # Serve static files directly \
    location / { \
        try_files $uri $uri/ =404; \
    } \
    \
    # Proxy API requests to the Java app \
    location /api { \
        proxy_pass http://localhost:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Expose port 80 for nginx
EXPOSE 80

# Start both nginx and the Java app
CMD service nginx start && java -jar server.jar