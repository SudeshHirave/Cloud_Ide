# Cloud IDE

## Description
Cloud IDE is a scalable cloud-based Integrated Development Environment (IDE) that enables developers to code, execute, and test applications directly in the cloud. The platform is designed to ensure efficient communication, security, and scalability, offering an isolated and collaborative environment for users.

## Features
- **Interactive Frontend**: Built with **React**, providing a user-friendly interface for coding and interacting with the terminal.
- **Backend Communication**: Powered by **Express.js**, facilitating seamless communication between the frontend, IDE, and terminal.
- **Real-Time Interactions**: Utilized **Socket.IO** for real-time communication between the IDE and terminal.
- **Dynamic Subdomains**: Automatically generates subdomains for each user to enable isolated communication with their dedicated Kubernetes pod.
- **Secure File Management**: Integrated **Amazon S3** for storing and managing user files and folders efficiently.
- **Code Execution**: Runs user code in isolated **Docker containers** to ensure security and user-specific environments.
- **Scalability**: Uses **Kubernetes** for container orchestration, dynamically creating and managing pods, with traffic routed securely using **Ingress**.
- **Security and Isolation**: Ensures complete user isolation through containerization and secure communication between components.

## Architecture
1. **Frontend**: React-based user interface.
2. **Backend**: Express.js for API and communication logic.
3. **Real-Time Communication**: Socket.IO for seamless IDE-terminal interactions.
4. **File Storage**: Amazon S3 for persistent file storage.
5. **Containerized Execution**: Docker containers for running user code in isolated environments.
6. **Container Orchestration**: Kubernetes for dynamic pod creation and management.
7. **Traffic Management**: Ingress for efficient routing to user pods via dynamic subdomains.

## Technologies Used
- **Frontend**: React
- **Backend**: Express.js
- **Real-Time Communication**: Socket.IO
- **Containerization**: Docker
- **Container Orchestration**: Kubernetes
- **Traffic Routing**: Ingress
- **File Storage**: Amazon S3

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Docker
- Kubernetes (setup with tools like Kind For setting up a Kind cluster, refer to [this guide](https://github.com/SudeshHirave/kubestarter/tree/main/kind-cluster).)
- AWS Account (for S3 bucket setup)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:SudeshHirave/Cloud_Ide.git
   cd cloud-ide
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   AWS_ACCESS_KEY=<your-aws-access-key>
   AWS_SECRET_KEY=<your-aws-secret-key>
   S3_BUCKET_NAME=<your-s3-bucket-name>
   KUBERNETES_NAMESPACE=<namespace>
   ```
   
5. **Deploy on Kubernetes**:
   - Build Docker images for the application.
   - Push images to a container registry (e.g., Docker Hub).
   - Deploy Kubernetes manifests (Pods, Services, Ingress) to your cluster.


## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
