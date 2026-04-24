# System Architecture Diagram

This diagram illustrates the flow of data and events between the various microservices and the central Kafka message broker.

```mermaid
graph TD
    subgraph Frontends
        Client["Client Storefront (Next.js :3002)"]
        Admin["Admin Dashboard (Next.js :3003)"]
    end

    subgraph "Infrastructure Layer (Docker)"
        Kafka{{"Apache Kafka Broker Cluster"}}
        Postgres[("PostgreSQL (Product DB)")]
        Mongo[("MongoDB (Order DB)")]
    end

    subgraph "Backend Microservices"
        AuthService["Auth Service (Clerk)"]
        ProductService["Product Service (Fastify :8000)"]
        OrderService["Order Service (Express :8001)"]
        PaymentService["Payment Service (Express :8002)"]
        EmailService["Email Service (Hono)"]
    end

    %% Interactions
    Client --> AuthService
    Client --> ProductService
    Admin --> ProductService
    
    ProductService --> Postgres
    OrderService --> Mongo

    %% Event Flows
    OrderService -- "order.created" --> Kafka
    Kafka -- "user.created" --> EmailService
    Kafka -- "order.created" --> EmailService
    Kafka -- "order.created" --> PaymentService
    PaymentService -- "payment.successful" --> Kafka
    Kafka -- "payment.successful" --> OrderService
    
    ProductService -- "product.created" --> Kafka
    Kafka -- "product.created" --> PaymentService
```

## How it works:
1. **Frontend Interaction**: Users interact with the **Client** storefront or **Admin** panel.
2. **Synchronous APIs**: Services like **Product Service** are called synchronously for data fetching from **PostgreSQL**.
3. **Asynchronous Events**: When an order is placed, the **Order Service** writes to **MongoDB** and emits an `order.created` event to **Kafka**.
4. **Event Consumers**:
    - **Payment Service** listens for `order.created` to process payments via Stripe.
    - **Email Service** listens for various events to send transactional notifications.
    - **Order Service** listens for `payment.successful` to update the order status.
