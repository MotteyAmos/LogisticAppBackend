# Throttle App Backend

This is the backend server for the Throttle App, built with Node.js and Dockerized for easy development and deployment.

---

## 🚀 Getting Started Locally

To run this app on your local machine, you must have **Docker** installed.

### 📦 Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your system (make sure Docker Engine is running)

---

### 🛠️ Run the App

1. **Clone this repository**

```bash
git clone https://github.com/your-username/throttle-app-backend.git
cd throttle-app-backend

2. **Start the services using Docker Compose**

docker compose -f docker-compose.dev.yml up --build -d

The app is running on http://localhost:4000


3. **To stop the app run**
Run  docker compose -f docker-compose.dev.yml down