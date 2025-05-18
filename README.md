# Task Manager Web Application

## Overview

The Task Manager is a full-stack web application for efficient task management, built with a React frontend and Node.js/Express backend. It follows **12-factor app** principles for scalability and portability. The project implements a **CI/CD pipeline** using **GitHub Actions** and **AWS ECS**, deploying the application on a single **EC2 instance** with a **bridge-networked ECS task definition**.

## Features

- **Frontend**: React SPA with task creation, editing, deletion, and status toggling, styled with Tailwind CSS.
- **Backend**: Express REST API with in-memory task storage and endpoints for task management and mocked auth.
- **Deployment**: Automated CI/CD pipeline deploying to AWS ECS on a single EC2 instance.
- **Networking**: Bridge network mode for frontend-backend communication within the ECS task.

## Technology Stack

- **Frontend**: React 18.2.0, Tailwind CSS 3.3.0, React Hooks
- **Backend**: Node.js 18, Express 4.18.2, CORS, dotenv
- **Deployment**:
  - AWS EC2 (single instance, `eu-north-1`)
  - AWS ECS (cluster: `manager-cluster`, service: `task-manager-service`, task: `task-manager-app`)
  - AWS ECR (repositories: `frontend`, `backend`)
  - Bridge network mode
  - CI/CD: GitHub Actions
- **Testing**: Jest 29.5.0, Supertest 6.3.3

## Project Architecture

- **Frontend**: Single-page React app served via `serve`, Dockerized with Node.js 18 Alpine.
- **Backend**: Express server with REST API, Dockerized similarly.

### AWS Infrastructure

- Single EC2 instance in `manager-cluster`.
- ECS task definition (`task-manager-app`) with two containers:
  - **Frontend**: Port 3000
  - **Backend**: Port 5000
- Bridge networking for container communication via `localhost`.
- ECR stores Docker images.
- CI/CD: GitHub Actions workflow triggers on `master` branch pushes, building/pushing images, updating the ECS task definition, and redeploying the service.

## Setup Instructions

Follow these steps to set up the project locally:

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/rogrammer/task-manager.git
    cd task-manager
    ```

2.  **Install Dependencies:**

    - **Frontend:**
      ```bash
      cd frontend
      npm install
      ```
    - **Backend:**
      ```bash
      cd ../backend
      npm install
      ```

3.  **Configure Environment Variables:**

    - **Frontend:** Create a `.env` file in the `frontend` directory and set the API URL:
      ```env
      REACT_APP_API_URL=<your_backend_api_url>
      ```
    - **Backend:** Create a `.env` file in the `backend` directory and set the port:
      ```env
      PORT=<your_desired_port, e.g., 5000>
      ```

4.  **Run Locally:**

    - **Frontend:**
      ```bash
      cd frontend
      npm start
      ```
    - **Backend:**
      ```bash
      cd ../backend/src
      node index.js
      ```

## CI/CD Configuration

A CI/CD pipeline is set up using GitHub Actions:

- **GitHub Secrets:** `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are stored as secrets in the GitHub repository.
- **Workflow:** The `.github/workflows/main.yml` file is configured to build Docker images, push them to ECR, and update the ECS service upon code pushes to the main branch.

## CI/CD Pipeline

- **Trigger**: Push to `master` branch.

### Steps:

1. **Checkout code** – `actions/checkout@v4`
2. **Set up Node.js 18** – Configures Node.js 18 on GitHub Actions runner.
3. **Run backend tests** – Executes `npm test` in `backend/` directory.
4. **Configure AWS credentials** – Using secrets stored in GitHub.
5. **Login to ECR** – `aws-actions/amazon-ecr-login@v2`
6. **Build and push Docker images** – Tags and pushes `frontend` and `backend` images to ECR.
7. **Update ECS task definition** – With the latest image references.
8. **Update ECS service** – Triggers new deployment.
9. **Wait for service stability** – Ensures ECS service is stable post-deployment.

## AWS Setup

This project is configured for deployment on AWS ECS. The following resources were set up:

1.  **EC2 Instance:** Provisioned with an ECS-optimized AMI.
2.  **ECS Cluster:** Created named `manager-cluster`.
3.  **ECR Repositories:** Created for `frontend` and `backend` Docker images.
4.  **ECS Task Definition:** Defined (`task-manager-app`) using bridge networking for container communication.
5.  **ECS Service:** Created (`task-manager-service`) to manage the running tasks.

## Environment Variables

- `AWS_REGION`: `eu-north-1`
- `ECR_REPOSITORY_FRONTEND`, `ECR_REPOSITORY_BACKEND`
- `ECS_CLUSTER`: `manager-cluster`
- `ECS_SERVICE`: `task-manager-service`
- `ECS_TASK_DEFINITION`: `task-manager-app`
- **Secrets**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## Challenges Encountered and Overcome

During development and deployment, several challenges were addressed:

- **Inter-container Communication:** Configuring bridge networking for frontend-backend communication required resolving hostname issues within the Docker network.
- **CORS Errors:** Fixed by properly setting up CORS middleware in the backend and ensuring the frontend's API URL was correctly configured.
- **Docker Network Isolation:** Overcame container name resolution issues that arose in bridge mode.
- **Port Binding:** Ensured correct port mappings in the Docker configurations and EC2 security group settings for external access to the application.
- **ECS Task Configuration:** Iteratively refined the ECS task definition, adjusting port mappings, CPU, and memory allocations for optimal performance and resource utilization.

## 12-Factor App Compliance

The project adheres to several principles of the 12-Factor App methodology:

- **Codebase:** The entire application is managed in a single GitHub repository.
- **Dependencies:** All dependencies are explicitly declared in the `package.json` files for both frontend and backend.
- **Config:** Application configuration is managed via environment variables (`.env` files).
- **Build/Release/Run:** These stages are strictly separated and managed via GitHub Actions (Build/Release) and ECS (Run).
- **Processes:** Both the frontend and backend processes are stateless. Note: The current in-memory storage is for simplicity and would typically be replaced by a backing service in a production environment.
- **Port Binding:** The application exposes its services via configurable ports (3000 for frontend, 5000 for backend).
- **Disposability:** Containers are designed for fast startup and graceful shutdown, promoting disposability.
- **Dev/Prod Parity:** Efforts are made to keep development and production environments as similar as possible, especially regarding dependencies and configuration management.
- **Logs:** Logs are currently output to the console, which can be easily directed to centralized logging services like AWS CloudWatch.
