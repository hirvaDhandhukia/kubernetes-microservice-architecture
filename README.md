# Microservice Architecture on GKE
A cloud-native implementation of two microservices deployed on GKE with persistent storage and automated CI/CD pipelines.

## Technologies
- Backend: `Node.js`
- Containerization: `Docker`
- Orchestration: `Kubernetes (GKE)`
- CI/CD: `GCP Cloud Build, Artifact Registry`
- Infrastructure: `Terraform`
- Storage: `Persistent Volume`


##  Watch demo
<a href="https://youtu.be/dXuvfcf6iY0?si=5dUJsD__s7YsxH1q" target="_blank">
  <img src="https://i.imgur.com/aOeC8C2.png" alt="Architecture Explanation" width="700" />
</a>


## Architecture
<img src="https://i.imgur.com/LO9q4Le.png" alt="Description of the image" width="700" />


## 🚀  Getting Started

### Prerequisites
- Node.js v16+
- Docker
- `gcloud`,  `kubectl`,  `terraform`  CLI tools installed


## Working 
*Container1 (API Service)*:
-   Listens to RESTful HTTP requests via  `/store-file`  and  `/calculate` endpoints.
-   Safeguards data by storing files in a  **shared persistent volume**, ensuring no data is lost.
-   Validates JSON requests and HTTP status codes for all API endpoints based on error conditions. 
        
*Container2 (Calculator)*:
-   Parses CSV files from the shared volume to sum product amounts, returning the result in JSON format or an error response if the data is malformed

