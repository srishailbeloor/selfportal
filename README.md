🚀 Kubernetes Self-Service Portal

A full-stack web application that allows users to create, manage, and delete Kubernetes namespaces with resource quotas using a simple UI.

---

📌 Features

- Create Kubernetes namespaces
- Apply CPU and Memory resource quotas
- Delete namespaces with confirmation
- View namespaces dynamically
- Backend integration with Kubernetes (Minikube)
- MySQL database for tracking records

---

🛠️ Tech Stack

- Frontend: React (Vite)
- Backend: Django (Python)
- Database: MySQL (Docker)
- Kubernetes: Minikube
- Containerization: Docker

---
🏗️ Architecture of the Solution

"Architecture" (architecture.png)

The system follows a full-stack architecture:

- The user interacts with the React frontend
- The frontend communicates with the Django backend via REST APIs
- The backend uses the Kubernetes Python client to interact with the Minikube cluster
- Kubernetes handles namespace creation, deletion, and resource quotas
- MySQL database stores metadata such as namespace details and status

Flow:
User → React → Django → Kubernetes → MySQL

---

⚙️ Prerequisites

Make sure you have installed:

- Python 3.9+
- Node.js
- Docker Desktop
- Minikube
- kubectl

---

📦 Installation

1️⃣ Clone the repository

git clone https://github.com/srishailbeloor/selfportal.git
cd selfportal

---

2️⃣ Backend Setup (Django)

cd backend

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

---

3️⃣ Frontend Setup (React)

cd ../frontend

npm install

---

🐳 Database Setup (MySQL using Docker)

docker run --name mysql-selfportal ^
-e MYSQL_ROOT_PASSWORD=root123 ^
-e MYSQL_DATABASE=selfportal ^
-p 3307:3306 ^
-d mysql:8

---

☸️ Start Kubernetes (Minikube)

minikube start --driver=docker

# Set context
kubectl config use-context minikube

# Verify
kubectl get nodes

---

▶️ Run the Application

🔹 Start Backend

cd backend
venv\Scripts\activate
python manage.py runserver

---

🔹 Start Frontend

cd frontend
npm run dev

---

🔍 Usage

1. Open frontend in browser
2. Enter namespace details
3. Click Create Namespace
4. View namespaces in list
5. Click Delete to remove namespace

---

📊 Verification

kubectl get namespaces

---

📊 Resource Quota Verification

kubectl get resourcequota -n <namespace>

---

🧠 Project Architecture

React → Django API → Kubernetes (Minikube) → MySQL

👨‍💻 Author

Srishail Kumar
