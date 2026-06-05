# Assignment 2 - Team D.A.T.A

## QuestShaper Server - Spring Boot + Frontend Game

### QUICK START:
  Local: ./mvnw clean package -DskipTests && java -jar target/server-0.0.1-SNAPSHOT.jar
  Then open: http://localhost:8000

 #### IMPORTANT: Frontend files must be in src/main/resources/static/
  - index.html
  - script.js
  - style.css
  - assets/64x64/ (all PNG images)

For detailed setup instructions, see SETUP.md

#### DEPLOYMENT:
  1. Build: ./mvnw clean package -DskipTests
  2. Docker: docker build -t tileserver:latest . && docker run -p 8000:80 tileserver:latest
  3. Kubernetes: kubectl apply -f nginx-deployment.yaml && kubectl apply -f nginx-service.yaml


## AWS Setup

EC2 Instance - t3.small

AWS Linux - 2023 Kernal

ED25519 Encryption

.pem private key file format

Create security group for SSH traffic from 0.0.0.0/0

#### Security Groups inbound rules:


| Description  | Protocol | Port range | Source | CDIR Block |
| ------------- | ------- | ---------- | ------ | ---------- |
| Application | TCP | 8000 | Custom | 0.0.0.0/0 |
| HTTP | TCP | 80 | Custom | 0.0.0.0/0 |
| SSH | TCP | 22 | Custom | 0.0.0.0/0 |
| Prometheus | TCP | 9090 | Custom | 0.0.0.0/0 |
| Grafana | TCP | 3000 | Custom | 0.0.0.0/0 |

