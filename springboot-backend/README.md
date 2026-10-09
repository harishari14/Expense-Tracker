# AetherSpend - Java Spring Boot Backend (Zero Database Architecture)

A modern, high-throughput **Java Spring Boot 3.3.4 (Java 21)** REST API engineered with an in-memory concurrent store.

## 🚀 Key Highlights
- **Zero Database Required**: Runs standalone with thread-safe `ConcurrentHashMap` and Java Stream aggregations. Zero database installation, zero connection strings, zero latency!
- **Swagger / OpenAPI 3**: Interactive testing UI at `http://localhost:8080/swagger-ui.html`.
- **REST Endpoints**:
  - `GET /api/transactions` - Fetch all or filter by type/category/date
  - `POST /api/transactions` - Create transaction
  - `PUT /api/transactions/{id}` - Update transaction
  - `DELETE /api/transactions/{id}` - Delete transaction
  - `GET /api/categories` - Fetch categories and monthly budget limits
  - `PUT /api/categories/{id}/budget` - Update category budget cap
  - `GET /api/analytics/summary` - Inflows, outflows, savings rate, burn rate
  - `POST /api/reset` - Reset all entries and caps to $0.00
  - `GET /api/health` - Health probe

## 💻 Run Locally
```bash
mvn clean spring-boot:run
```
Visit:
- API: `http://localhost:8080/api/transactions`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
