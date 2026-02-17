# SentinAI: Self-Healing GenAI Platform on Kubernetes (GitOps)

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=activity&logoColor=white)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Ollama](https://img.shields.io/badge/AI_Engine-Ollama-orange?style=for-the-badge&logo=openai&logoColor=white)

![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)
![ArgoCD](https://img.shields.io/badge/GitOps-ArgoCD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white)

**SentinAI** is a production-grade, microservices-based Generative AI platform designed to demonstrate **Day 2 Operations**, **Chaos Engineering**, and **GitOps** principles. 

Unlike standard wrappers around OpenAI, this platform runs a **self-hosted Large Language Model (LLM)** locally on Kubernetes, ensuring zero data egress and complete privacy. It features a self-healing architecture that automatically recovers from simulated infrastructure failures.

---

## 🏗️ System Architecture

The system follows an asynchronous, decoupled microservices pattern to handle high-latency AI workloads without blocking the user interface.



### **Core Components:**
1.  **Frontend (React + TypeScript):**
    * Implements **Optimistic UI** and **Long Polling** to handle AI generation delays.
    * Served via **Nginx**, acting as a Reverse Proxy to route API traffic.
2.  **Backend (FastAPI + Python):**
    * Stateless API Gateway that orchestrates tasks.
    * Connects to the local AI Engine (Ollama) and manages state in Redis.
3.  **Message Broker (Redis):**
    * Decouples the request submission from the AI processing.
    * Ensures reliable task queuing even during traffic spikes.
4.  **AI Engine (Ollama - Phi3):**
    * **Local LLM:** Runs entirely on the EC2 host (no external API keys).
    * Exposed via internal network bridging to the Kubernetes cluster.

---

## 🛠️ Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Orchestration** | **K3s (Kubernetes)** | Lightweight production-grade cluster on AWS EC2. |
| **GitOps** | **ArgoCD** | Continuous Delivery; syncs infrastructure state from Git. |
| **Observability** | **Prometheus & Grafana** | Real-time metrics (CPU/RAM) and dashboarding. |
| **Containerization** | **Docker** | Multi-stage builds for optimized images. |
| **AI / ML** | **Ollama (Phi-3)** | Self-hosted Generative AI model. |
| **Backend** | **FastAPI (Python)** | Async API with "Chaos" endpoints for testing. |
| **Frontend** | **React** | Interactive UI for job submission and result polling. |

---

## 🚀 Installation & Setup

### 1. Infrastructure (AWS EC2)
* The platform runs on a single **AWS t3.xlarge** instance (4 vCPU, 16GB RAM) running Ubuntu.

**Install K3s (Kubernetes):**
```bash
curl -sfL [https://get.k3s.io](https://get.k3s.io) | sh -
# Verify node is ready
sudo kubectl get nodes
```

### 2. AI Engine Setup (Ollama)
* We run the AI engine on the host to leverage full hardware capabilities.

```bash
# Install Ollama
curl -fsSL [https://ollama.com/install.sh](https://ollama.com/install.sh) | sh

# Configure to listen on all interfaces (0.0.0.0)
sudo systemctl edit ollama.service

# Pull the Phi-3 Model
ollama pull phi3
```
### 3. Deploying the Application (Kubernetes)
* The infrastructure is defined as code in the infrastructure/k8s/ directory.

```bash
# Apply Nginx Config, Redis, Backend, and Frontend
kubectl apply -f infrastructure/k8s/
```
### 📊 Observability & Monitoring
* The platform uses the Kube-Prometheus Stack (installed via Helm) to provide deep insights into cluster health.

Accessing Grafana:
```
URL: http://<EC2-IP>:30xxx
```
* Dashboards: Tracks CPU saturation, Memory usage, and Pod restarts.

* Key Metrics Tracked:

* Golden Signals: Latency, Traffic, Errors, and Saturation.

* Pod Health: Real-time monitoring of "CrashLoopBackOff" events during chaos testing.

### 🔄 GitOps Workflow (ArgoCD)
* Deployment is managed automatically by ArgoCD.

* Source of Truth: This GitHub Repository.

* Mechanism: ArgoCD watches the infrastructure/k8s/ folder.

* Auto-Sync: Any commit to main triggers an immediate cluster update.

### 🧪 Chaos Engineering & Self-Healing
* To validate reliability, the backend includes a specific "Trap" endpoint designed to crash the application.

The Experiment:
* Trigger: Send a request to GET /api/kill.

* Effect: The backend intentionally consumes memory until it hits the Kubernetes limits.memory threshold (512Mi).

* Result: * OOMKilled: The Linux kernel terminates the pod.

* Self-Healing: Kubernetes immediately detects the failure and spins up a fresh replica.

* Zero Downtime: The Load Balancer routes traffic to healthy pods during the recovery.

Evidence:
```
Grafana captures the memory spike and drop, proving the resource limits are active and the scheduler is responsive.
```
### 📝 Usage Guide
* Open the SentinAI Control Panel in your browser.

* Enter a prompt (e.g., "Write a haiku about servers").

* Click Submit Async Job.

* The system queues the task in Redis -> Backend processes it with Ollama -> Frontend polls and displays the result.
```
JSON
{
  "task_id": "a5a75de6-680c-49e3-ab7f-315414f5332c",
  "status": "COMPLETED",
  "result": "Servers hum at night,\nData flows like endless streams,\nSilence in the code."
}
```
Author
```
Built by Mithesh with ❤️ as a demonstration of Cloud Native engineering.
```
