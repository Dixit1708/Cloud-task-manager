# Minor Project Report
## Cloud Task Manager — Web Application Deployment on AWS

### 1. Introduction
Cloud Task Manager is a simple web application developed to demonstrate how a web application can be deployed on a cloud platform. The project uses Node.js and Express for the backend, MongoDB Atlas for cloud database storage, AWS EC2 for hosting, and Nginx as a reverse proxy.

### 2. Objective
To develop and deploy a basic web application on AWS and understand the practical workflow of cloud deployment, database connectivity, domain/SSL configuration, testing, logging, and troubleshooting.

### 3. Technologies Used
| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Cloud | AWS EC2 |
| Web server | Nginx |
| Process manager | systemd |
| Version control | Git/GitHub |
| Containerization | Docker (optional) |

### 4. System Architecture
Browser → Nginx → Express API → MongoDB Atlas

### 5. Main Modules
- Task creation
- Task listing
- Status update
- Task deletion
- Status filtering
- Dashboard statistics
- Health monitoring

### 6. Deployment Procedure
1. Created the Node.js application.
2. Created MongoDB Atlas database.
3. Tested the application locally.
4. Created AWS EC2 Ubuntu instance.
5. Configured security group.
6. Uploaded/cloned the project using Git.
7. Added production environment variables.
8. Started the application using systemd.
9. Configured Nginx reverse proxy.
10. Configured HTTPS for a domain.
11. Tested the application through a browser.
12. Checked logs and health endpoint.

### 7. Testing
Test CRUD operations, status filtering, responsive UI, database persistence, `/health`, Nginx routing, and HTTPS.

### 8. Monitoring and Troubleshooting
Application logs can be checked using `journalctl`. Nginx configuration is validated using `nginx -t`. The `/health` endpoint reports application and database status.

### 9. Conclusion
The project demonstrates the complete basic lifecycle of deploying a web application to a cloud server, connecting it to a managed database, exposing it safely through a reverse proxy, and monitoring the running service.

### 10. Future Scope
- User authentication
- Role-based access
- Task due dates and reminders
- Search and pagination
- Email/WhatsApp notifications
- CI/CD with GitHub Actions
- Cloud monitoring and alerts
