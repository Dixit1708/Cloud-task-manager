# Cloud Task Manager — Minor Internship Project

A simple full-stack web application that demonstrates cloud deployment using:

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Cloud:** AWS EC2
- **Reverse proxy:** Nginx
- **Process management:** systemd
- **Version control:** Git/GitHub
- **Optional containerization:** Docker

## Project objective

Deploy a simple web application on a cloud platform, connect it to a cloud database, make it accessible through a browser, and monitor the service.

## Features

1. Add tasks
2. Select priority
3. Select task status
4. Change status directly from the task list
5. Delete tasks
6. Filter tasks by status
7. Dashboard statistics
8. Health-check endpoint at `/health`
9. MongoDB persistence
10. Responsive UI

## 1. Run locally

Install Node.js 20+.

```bash
npm install
cp .env.example .env
```

Edit `.env` and put your MongoDB Atlas connection string in `MONGODB_URI`.

Then:

```bash
npm run seed
npm start
```

Open `http://localhost:3000`.

## 2. MongoDB Atlas

Create a free MongoDB Atlas deployment, create a database user, and allow the EC2 server's IP address in the network access settings.

Copy the connection string into `.env`.

Do not upload `.env` to GitHub.

## 3. AWS EC2 deployment

Recommended beginner setup:

- Ubuntu Server 24.04 LTS
- Small burstable instance suitable for a student/demo workload
- Security group:
  - SSH: port 22 — restrict to your IP
  - HTTP: port 80 — anywhere
  - HTTPS: port 443 — anywhere
- Do not expose port 3000 publicly when Nginx is used.

Connect to EC2:

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Install Node.js and Git, then clone your repository:

```bash
sudo apt update
sudo apt install -y git nginx
git clone YOUR_GITHUB_REPOSITORY_URL cloud-task-manager
cd cloud-task-manager
```

Install Node.js 20+ using your preferred supported Node.js installation method, then:

```bash
npm ci --omit=dev
cp .env.example .env
nano .env
```

Add your MongoDB URI.

Test:

```bash
npm start
```

In another terminal, verify:

```bash
curl http://127.0.0.1:3000/health
```

## 4. Run permanently with systemd

Copy the included service:

```bash
sudo cp systemd/cloud-task-manager.service /etc/systemd/system/cloud-task-manager.service
sudo systemctl daemon-reload
sudo systemctl enable cloud-task-manager
sudo systemctl start cloud-task-manager
sudo systemctl status cloud-task-manager
```

View logs:

```bash
sudo journalctl -u cloud-task-manager -f
```

## 5. Nginx

Edit:

```bash
sudo nano nginx/cloud-task-manager.conf
```

Replace `YOUR_DOMAIN_OR_EC2_IP` with your domain name or temporary EC2 public IP.

Copy it:

```bash
sudo cp nginx/cloud-task-manager.conf /etc/nginx/sites-available/cloud-task-manager
sudo ln -s /etc/nginx/sites-available/cloud-task-manager /etc/nginx/sites-enabled/cloud-task-manager
sudo nginx -t
sudo systemctl reload nginx
```

Now browse to your domain/IP over HTTP.

## 6. HTTPS

For a real domain pointing to the EC2 instance, install Certbot and use it to obtain an SSL certificate. The certificate tool can also update the Nginx configuration.

After HTTPS is configured, test:

```bash
curl https://YOUR_DOMAIN/health
```

## 7. Optional Docker deployment

Build:

```bash
docker build -t cloud-task-manager .
```

Run:

```bash
docker run -d \
  --name cloud-task-manager \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  cloud-task-manager
```

For a production-style setup, keep port 3000 private and use Nginx on ports 80/443.

## Troubleshooting

### App does not start

```bash
sudo systemctl status cloud-task-manager
sudo journalctl -u cloud-task-manager -n 100 --no-pager
```

### MongoDB connection error

Check:

- `MONGODB_URI` is correct.
- Database username/password are correct.
- MongoDB Atlas network access allows the EC2 public IP.
- Special characters in a database password are URL-encoded.

### Nginx error

```bash
sudo nginx -t
sudo systemctl status nginx
```

### Browser cannot connect

Check:

```bash
curl http://127.0.0.1:3000/health
```

Then check the EC2 security group for ports 80/443.

## Suggested viva explanation

**Why Node.js?**  
It is lightweight and suitable for building REST APIs quickly.

**Why MongoDB?**  
The task data is simple document-shaped data and MongoDB integrates easily with Node.js.

**Why EC2?**  
EC2 provides a virtual Linux server where the application can be deployed and controlled.

**Why Nginx?**  
Nginx acts as a reverse proxy and handles public HTTP/HTTPS traffic while the Node.js app runs internally on port 3000.

**Why systemd?**  
It keeps the application running as a service and restarts it if it crashes.

**How is the deployment tested?**  
The browser is used to test the UI, CRUD operations are tested from the interface, and `/health` verifies application/database status.

## Project flow

Browser → Nginx → Node.js/Express → MongoDB Atlas

## Deliverables

- Source code
- GitHub repository
- AWS EC2 deployment
- MongoDB Atlas database
- Working public URL/domain
- Screenshots of deployment
- Project report
- Viva/demo

