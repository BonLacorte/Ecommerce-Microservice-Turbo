# 🚀 Setup Guide: Ecommerce Microservice Turbo

This project is a full-stack microservices architecture managed with Turborepo, utilizing Kafka for event-driven communication and Docker for containerized infrastructure.

---

## 🐳 Quick Start with Docker (Recommended)

This is the fastest way to get the entire project running. It requires only **Docker Desktop**.

### Prerequisites
- **Docker & Docker Compose**: Ensure Docker Desktop is installed and running.

### Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/BonLacorte/Ecommerce-Microservice-Turbo.git
cd Ecommerce-Microservice-Turbo
```

#### 2. Configure Environment Variables
Copy the example environment file and fill in your API keys:
```bash
cp .env.example .env
```
Open the `.env` file and fill in the **External API Keys** section:
- **Clerk**: Sign up at [clerk.com](https://clerk.com/), create a new application, and copy the Publishable & Secret keys.
- **Stripe**: Sign up at [stripe.com](https://stripe.com/), get API keys from the Developers Dashboard. For the webhook secret, you can use the Stripe CLI or set up a webhook endpoint.
- **Cloudinary**: Sign up at [cloudinary.com](https://cloudinary.com/) and copy your Cloud Name.

> **Note**: The database URLs, Kafka brokers, and internal service URLs are pre-configured and do not need to be changed.

#### 3. Build and Start Everything
```bash
docker-compose up --build
```
This single command will:
- Start PostgreSQL, MongoDB, and a 3-node Kafka cluster
- Automatically create all required Kafka topics
- Install dependencies, run Prisma migrations, and start all 7 services

> **First run** may take 3-5 minutes to download images and build. Subsequent runs will be much faster.

#### 4. Access the Application

| Service | URL |
|---|---|
| **Client Storefront** | [http://localhost:3002](http://localhost:3002) |
| **Admin Dashboard** | [http://localhost:3003](http://localhost:3003) |
| **Kafka UI Dashboard** | [http://localhost:8080](http://localhost:8080) |

#### Stopping
```bash
docker-compose down
```
To also remove the database volumes (fresh start):
```bash
docker-compose down -v
```

---

## 🔧 Manual Local Development Setup (Alternative)

Use this method if you want to develop without Docker for the application services. You will still need Docker for infrastructure (databases, Kafka).

### Prerequisites
- **Node.js**: v18+
- **pnpm**: `npm install -g pnpm`
- **Docker & Docker Compose**: Ensure Docker Desktop is running.

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

## 🛠 Architecture Overview
- **Message Broker**: Apache Kafka (Event-driven decoupling)
- **Database (Relational)**: PostgreSQL + Prisma (Product management)
- **Database (NoSQL)**: MongoDB + Mongoose (Order processing)
- **Frameworks**: Next.js (Frontends), Fastify/Express/Hono (Backends)
- **Monorepo Management**: Turborepo
