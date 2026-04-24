# 🚀 Setup Guide: Ecommerce Microservice Turbo

This project is a full-stack microservices architecture managed with Turborepo, utilizing Kafka for event-driven communication and Docker for containerized infrastructure.

## Prerequisites
- **Node.js**: v18+ 
- **pnpm**: `npm install -g pnpm`
- **Docker & Docker Compose**: Ensure Docker Desktop is running.

## Local Development Setup

Follow these steps to spin up the entire cluster:

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Infrastructure
Run the following to start the Kafka cluster and databases:

**Kafka (3 Brokers + UI)**
```bash
cd packages/kafka
docker compose up -d
cd ../..
```

**PostgreSQL (Product DB)**
```bash
docker run -d --name ecommerce-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecommerce_products -p 5432:5432 postgres:16-alpine
```

**MongoDB (Order DB)**
```bash
docker run -d --name ecommerce-mongodb -p 27017:27017 mongo:7
```

*Wait about 30 seconds for the containers to fully initialize.*

### 3. Initialize Kafka Topics
Run this command to create the necessary message topics:
```bash
docker exec kafka-broker-1 /bin/bash -c "/opt/kafka/bin/kafka-topics.sh --create --topic user.created --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3 --if-not-exists && /opt/kafka/bin/kafka-topics.sh --create --topic order.created --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3 --if-not-exists && /opt/kafka/bin/kafka-topics.sh --create --topic product.created --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3 --if-not-exists && /opt/kafka/bin/kafka-topics.sh --create --topic product.deleted --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3 --if-not-exists && /opt/kafka/bin/kafka-topics.sh --create --topic payment.successful --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3 --if-not-exists"
```

### 4. Database Setup (Prisma)
Generate the client and apply the migrations:
```bash
pnpm --filter @repo/product-db run db:generate
pnpm --filter @repo/product-db exec npx prisma migrate dev --name init
```

### 5. Run All Services
Start all 7 microservices and frontends simultaneously:
```bash
pnpm dev
```

---

## 🌐 Access Points

| Service | URL |
|---|---|
| **Client Storefront** | [http://localhost:3002](http://localhost:3002) |
| **Admin Dashboard** | [http://localhost:3003](http://localhost:3003) |
| **Kafka UI Dashboard** | [http://localhost:8080](http://localhost:8080) |

## 🛠 Architecture Overview
- **Message Broker**: Apache Kafka (Event-driven decoupling)
- **Database (Relational)**: PostgreSQL + Prisma (Product management)
- **Database (NoSQL)**: MongoDB + Mongoose (Order processing)
- **Frameworks**: Next.js (Frontends), Fastify/Express/Hono (Backends)
- **Monorepo Management**: Turborepo
