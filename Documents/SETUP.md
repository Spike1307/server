# QuestShaper Server - Setup & Deployment Guide

## Overview
This is a Spring Boot application that serves a game frontend (HTML/CSS/JS) alongside a REST API backend. The frontend files are bundled into the JAR as static resources.

## Prerequisites
- Java 21 (OpenJDK or similar)
- Maven 3.8+
- Docker (for containerization)

---

## Local Development

### 1. Build the Project
```bash
cd server
./mvnw clean package -DskipTests
```

This will:
- Compile Java sources
- Bundle frontend files (HTML, CSS, JS) from `src/main/resources/static/` into the JAR
- Create `target/server-0.0.1-SNAPSHOT.jar`

### 2. Run Locally
```bash
java -jar target/server-0.0.1-SNAPSHOT.jar
```

Server starts on **http://localhost:8000**
- Homepage (game): `http://localhost:8000/`
- API endpoints: `http://localhost:8000/info`, `http://localhost:8000/test`, etc.

### 3. Game Frontend Assets
The frontend expects image assets in `src/main/resources/static/assets/64x64/`:
- `brickwall.png`
- `grass.png`
- `waterwaves.png`
- `player1.png`
- etc.

**Ensure these files exist before building, or the game will have missing textures.**

---

## Project Structure
```
src/main/resources/static/
├── index.html          # Game UI
├── script.js          # Game logic
├── style.css          # Styling
└── assets/64x64/      # Tile images (required)
```

### Important: Static Files Location
**All frontend files MUST be in `src/main/resources/static/`** — NOT just in the `Frontend/` folder.
- `index.html`
- `script.js`
- `style.css`
- `assets/64x64/` (all PNG images)

Spring Boot automatically serves these at the root path (`/`).

---

## Docker Build & Run

### 1. Build the Docker Image
```bash
./mvnw clean package -DskipTests
docker build -t tileserver:latest .
```

### 2. Run Container Locally
```bash
docker run -p 8000:8000 tileserver:latest
```

Access: **http://localhost:8000/**

---

## Troubleshooting

### Port Already in Use
If port 8000 is already in use:
```powershell
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### Static Files Not Serving
Ensure files are in the correct location:
- ✅ **Correct**: `src/main/resources/static/index.html`
- ❌ **Wrong**: `Frontend/index.html` (won't be bundled)

Rebuild after adding files:
```bash
./mvnw clean package -DskipTests
```

### Missing Game Assets
If game shows black squares instead of textures:
1. Add all PNG files to `src/main/resources/static/assets/64x64/`
2. Rebuild the project
3. Restart the application

---

## Key Changes Made

### pom.xml
No special plugins needed — Spring Boot automatically includes static files from `src/main/resources/static/`.

### Dockerfile
```dockerfile
FROM eclipse-temurin:21
WORKDIR /server
COPY target/server-0.0.1-SNAPSHOT.jar server.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "server.jar"]
```

### Controller Configuration
The `@RestController` automatically serves:
- Static files from `src/main/resources/static/` (HTML, CSS, JS)
- REST API endpoints (`/info`, `/test`, etc.)

---

## Development Workflow

1. **Make changes**
   - Edit frontend files in `src/main/resources/static/`
   - Edit Java code in `src/main/java/`

2. **Build & Test Locally**
   ```bash
   ./mvnw clean package -DskipTests
   java -jar target/server-0.0.1-SNAPSHOT.jar
   ```

3. **Test in Docker**
   ```bash
   docker build -t tileserver:latest .
   docker run -p 8000:8000 tileserver:latest
   ```


- **Backend**: Check Java logs for stack traces
- **Deployment**: Check Docker/container logs and container status
