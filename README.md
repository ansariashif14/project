# 📦 Inventory Management System

An **end-to-end Inventory Management System** built with:

* **Backend**: Spring Boot, PostgreSQL, Kafka (Redpanda), JWT Authentication
* **Frontend**: React (Vite + TypeScript + TailwindCSS)

---

## 🚀 Features

* User authentication with **JWT**
* Manage **Products & Inventory Batches**
* Track **Sales & Costs**
* Kafka/Redpanda-based **event-driven messaging**
* Frontend built with **Vite + React + Tailwind**

---

## 🛠️ Tech Stack

### Backend

* Spring Boot (REST APIs)
* PostgreSQL (Database)
* Spring Data JPA (ORM)
* Kafka / Redpanda (Messaging)
* JWT (Authentication & Authorization)

### Frontend

* React 18 (Vite)
* TypeScript
* Tailwind CSS
* Lucide React Icons

---

## ⚙️ Backend Setup

### 1. Clone Repo

```bash
git clone <repo-url>
cd inventory_backend
```

### 2. Configure Database

Update `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://dpg-d27pokmuk2gs73egsgl0-a.oregon-postgres.render.com:5432/inevntory_49wl
spring.datasource.username=ashif
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Kafka / Redpanda Config

Already configured in `application.properties`:

```properties
spring.kafka.bootstrap-servers=d27fufnhgrd83724jht0.any.us-east-1.mpx.prd.cloud.redpanda.com:9092
spring.kafka.properties.security.protocol=SASL_SSL
spring.kafka.properties.sasl.mechanism=SCRAM-SHA-256
spring.kafka.properties.sasl.jaas.config=...
spring.kafka.consumer.group-id=inventory-group
```

### 4. JWT Config

```properties
app.jwt.secret=<your-secret-key>
app.jwt.expiration=86400000  # 24h
```

### 5. Run Backend

```bash
./mvnw spring-boot:run
```

---

## 🎨 Frontend Setup

### 1. Navigate to frontend

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

### 5. Preview

```bash
npm run preview
```

---

## 📂 Project Structure

### Backend

```
inventory_backend/
 ├── entity/         # JPA Entities
 ├── dto/            # Data Transfer Objects
 ├── repository/     # Spring Data JPA Repos
 ├── service/        # Business Logic
 ├── controller/     # REST Controllers
 ├── config/         # CORS, Kafka configs
 ├── security/       # JWT Utils
 └── resources/
     └── application.properties
```

### Frontend

```
frontend/
 ├── package.json
 ├── vite.config.ts
 ├── src/
 │   ├── main.tsx        # Entrypoint
 │   ├── components/     # UI Components
 │   ├── pages/          # Screens
 │   └── ...
 ├── tailwind.config.js  # (if added)
 └── tsconfig.json       # (if added)
```

---

## 🔑 Authentication Flow

1. User logs in → **JWT token generated**
2. Token stored in frontend (e.g., localStorage)
3. Each API call → token passed in `Authorization: Bearer <token>` header
4. Backend validates token via `JwtUtils`

---

## 📝 API Overview (Sample)

* `POST /api/auth/login` → Authenticate user
* `GET /api/products` → Get all products
* `POST /api/products` → Add product
* `GET /api/inventory` → Get inventory batches
* `POST /api/sales` → Record sale

---

## 🖥️ Run Full App

### Backend

```bash
cd inventory_backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit 👉 https://frontend-ws3t.onrender.com/

## 👨‍💻 Author
**Mohammad Ashif**

