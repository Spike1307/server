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

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

COPY --from=builder /server/target/server-0.0.1-SNAPSHOT.jar server.jar
COPY --from=builder /server/src/main/resources/static /var/www/html

RUN printf '%s\n' 'server {' \
'    listen 80;' \
'    server_name localhost;' \
'    root /var/www/html;' \
'    index index.html;' \
'' \
'    location / {' \
'        try_files $uri $uri/ /index.html;' \
'    }' \
'' \
'    location /api {' \
'        proxy_pass http://127.0.0.1:8000;' \
'        proxy_set_header Host $host;' \
'        proxy_set_header X-Real-IP $remote_addr;' \
'        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
'        proxy_set_header X-Forwarded-Proto $scheme;' \
'        proxy_http_version 1.1;' \
'        proxy_set_header Connection "";' \
'    }' \
'}' > /etc/nginx/sites-available/default

RUN rm -f /etc/nginx/sites-enabled/default && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

EXPOSE 8000

EXPOSE 80

CMD ["sh", "-c", "nginx && java -jar server.jar"]