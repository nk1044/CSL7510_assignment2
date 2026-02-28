# GCP Auto Scaling Demo

This project demonstrates how to deploy a Node.js web server on Google Cloud Platform, configure a Managed Instance Group, enable CPU-based auto scaling, and apply basic security measures.

---

## Project Structure

```
vcc_assignment2/
  application/
    server.js
    index.html
    style.css
    script.js
    package.json
    package-lock.json
  script.bash
  Readme.md
```

---

## What the Application Does

The server runs on port 8080 and exposes three routes:

- `/` — serves the static frontend
- `/api/info` — returns hostname, CPU count, load average, and uptime as JSON
- `/cpu` — runs a 15-second CPU load loop to trigger auto scaling
- `/health` — returns HTTP 200, used as a health check endpoint

---

## Prerequisites

- A Google Cloud Platform account with billing enabled
- `gcloud` CLI installed locally (optional, steps can be done via the console)
- Apache Bench (`ab`) installed locally for load testing

---

## Deployment Steps

### 1. Create a VM Instance

Go to Compute Engine -> VM Instances -> Create Instance.

- Machine type: e2-medium
- Boot disk: Ubuntu 22.04 LTS
- Allow HTTP traffic checked
- Add a firewall tag, for example `http-server`

SSH into the instance once it is running.

### 2. Install Dependencies and Run the Server

```bash
sudo apt update
sudo apt install -y nodejs npm git
git clone <your-repo-url>
cd vcc_assignment2/application
npm install
node server.js
```

The server starts on port 8080.

### 3. Open Firewall for Port 8080

Go to VPC Network -> Firewall -> Create Firewall Rule.

- Direction: Ingress
- Source IP ranges: 0.0.0.0/0
- Protocol: TCP, Port: 8080
- Target tags: http-server

Verify the server loads at `http://EXTERNAL_IP:8080`.

### 4. Create an Instance Template

Go to Compute Engine -> Instance Templates -> Create Instance Template.

Use the same machine type and boot disk. Under Management -> Startup Script, paste:

```bash
#!/bin/bash
apt update
apt install -y nodejs npm git
cd /home
git clone <your-repo-url>
cd vcc_assignment2/application
npm install
node server.js &
```

### 5. Create a Managed Instance Group

Go to Compute Engine -> Instance Groups -> Create Instance Group.

- Type: Managed
- Template: the one you just created
- Location: single zone
- Initial number of instances: 1

### 6. Enable Auto Scaling

Open the instance group and click Edit.

- Autoscaling mode: On
- Signal type: CPU utilization
- Target CPU utilization: 60%
- Minimum instances: 1
- Maximum instances: 5

Save.

### 7. Configure IAM

Go to IAM & Admin -> IAM -> Grant Access.

Add a user and assign the Compute Viewer role. This gives read-only access following the principle of least privilege.

### 8. Restrict SSH Access

Go to VPC Network -> Firewall. Find the default-allow-ssh rule and edit it.

Change the source IP range from `0.0.0.0/0` to your own public IP with a /32 suffix, for example `203.0.113.5/32`.

---

## Load Testing

Apache Bench was used to simulate traffic and trigger auto scaling:

```bash
ab -n 1000 -c 50 http://<EXTERNAL_IP>:8080/
```

This sends 1000 requests with 50 concurrent connections. During testing the server handled approximately 68 requests per second with a median response time of 671 ms.

To trigger CPU-based scaling, hit the `/cpu` endpoint:

```bash
ab -n 50 -c 10 http://<EXTERNAL_IP>:8080/cpu
```

Watch Compute Engine -> Instance Groups -> Monitoring for new instances being added.
