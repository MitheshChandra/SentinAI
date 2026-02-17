# SentinAI: Self-Healing GenAI Platform on Kubernetes

## 🚀 Project Overview
A microservices-based Generative AI platform that demonstrates **Day 2 Operations**, **Chaos Engineering**, and **GitOps** principles.

The system uses a **Python/FastAPI** backend to orchestrate AI tasks (via **Ollama/Phi-3**) and a **React** frontend for user interaction, decoupled by a **Redis** queue for asynchronous processing.

## 🏗️ Architecture
- **Orchestrator:** Kubernetes (K3s) on AWS EC2
- **GitOps:** ArgoCD for continuous delivery
- **AI Engine:** Self-hosted Ollama (Phi-3)
- **Observability:** Prometheus & Grafana
- **Ingress:** Traefik + Nginx Reverse Proxy

## ⚡ Key Features
- **Self-Healing:** Kubernetes automatically restarts pods during simulated memory leaks.
- **Async Processing:** Redis Task Queue handles high-latency AI workloads.
- **Chaos Ready:** Custom endpoints (`/kill`) to validate reliability.
- **Zero-Egress:** AI runs entirely locally (No OpenAI API keys).

## 🛠️ How to Run
1. **Infrastructure:**
   ```bash
   kubectl apply -f infrastructure/k8s/
2. **Monitoring**
   helm install monitoring prometheus-community/kube-prometheus-stack
**3. Save and Exit:**
* Press `Ctrl+O`, `Enter` (to save).
* Press `Ctrl+X` (to exit).

**4. Commit and Push (Normal Push this time):**
```bash



