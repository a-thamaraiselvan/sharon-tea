# Universal AWS Infrastructure & Production Deployment Guide for AI Agents
**Specification Version**: 2.0.0  
**Target Environment**: AWS EC2 (Single-Instance Architecture), S3, IAM, PostgreSQL/MySQL, Nginx, Let's Encrypt SSL, PM2, Git.

---

## 1. Absolute Golden Directives (Non-Negotiable Rules)

Any AI Agent tasked with deploying or maintaining applications on AWS **MUST** strictly adhere to these 7 Golden Rules. Violation of any rule results in project failure, unnecessary cloud bills, or production downtime.

### Rule 1: Zero Destruction of Existing Resources
- **NEVER** terminate, stop, reboot, modify, or detach resources (EC2 instances, S3 buckets, RDS databases, Security Groups, Elastic IPs) belonging to other projects or existing production services.
- **NEVER** run wildcard deletion commands (e.g., `aws ec2 terminate-instances` on unverified instance IDs, or `aws s3 rb --force` on buckets you did not create).
- Always verify the instance Name tag and ID before taking any action.

### Rule 2: Single-Instance Policy (No Duplicate / Trial-and-Error Instances)
- **STRICTLY ONE INSTANCE**: Deploy the entire backend and database stack onto **one dedicated instance** (or the designated existing instance).
- If a build step, dependency install, or service fails, **DO NOT terminate the instance and start a new one**. You MUST diagnose and repair the configuration directly on the existing instance.
- Creating multiple instances incurs cumulative storage and compute costs and breaks domain DNS records.

### Rule 3: Zero Elastic IP for Development / Testing
- **DO NOT** allocate or attach AWS Elastic IPs for dev, staging, or low-cost testing instances. AWS charges $0.005/hour for unattached or remapped Elastic IPs.
- Use the **standard free AWS Public IPv4 address** assigned automatically to the EC2 instance upon launch (`AssociatePublicIpAddress: true`).
- Point the domain's DNS `A` record directly to the EC2 public IP.

### Rule 4: Git-First Deployment (No Fragile File Transfers)
- **NEVER** attempt raw SCP or multi-megabyte direct uploads through restricted or proxied local terminal connections.
- **Workflow**:
  1. Commit clean production code locally.
  2. Push to the project's Git repository (`main` or `release` branch).
  3. SSH into the EC2 instance and run `git clone` or `git pull`.
  4. Build and start services natively on the instance.
- **Security**: NEVER commit `.pem` private keys, `.env` files with secret passwords, or AWS root access keys to Git repositories.

### Rule 5: Mandatory 2GB Swap Space
- Free-tier / low-cost EC2 instances (`t2.micro` or `t3.micro`) have only **1 GB of physical RAM**.
- Running `npm install`, `pnpm install`, or TypeScript `tsc` builds will trigger the Linux Out-Of-Memory (OOM) Killer without swap.
- **FIRST ACTION ON ANY NEW INSTANCE**: Create a 2GB swapfile immediately before installing packages.

### Rule 6: Ubuntu 24.04 Compatibility (No `apt-get install awscli`)
- On Ubuntu 24.04 LTS (Noble Numbat), the package `awscli` has been deprecated/removed from default APT repositories.
- Running `apt-get install -y awscli` will fail with `E: Unable to locate package awscli`.
- Use direct `git clone`, official AWS CLI v2 zip installer, or public S3 URLs with `curl`.

### Rule 7: Pre-Execution Implementation Plan
- Before running any cloud provisioning commands, the agent **MUST** present an explicit step-by-step plan specifying:
  - Exact target AWS Region (e.g., `ap-south-1`).
  - Target S3 Bucket name (with account-scoped suffix).
  - Target Instance Type (`t3.micro`) and OS (`Ubuntu 24.04 LTS`).
  - Required ports to be opened in Security Group.
  - Database name, database user, and local port.
  - Domain / Subdomain routing plan.
- The agent must wait for user confirmation before executing cloud provisioning steps.

---

## 2. Project-Scoped IAM & S3 Security Architecture

Every project must have its own isolated IAM User and dedicated S3 bucket to prevent cross-project interference.

### 2.1 S3 Bucket Naming Standard
```text
<project-name>-assets-<aws-account-id>
Example: sharon-tea-stall-assets-483428953837
```

### 2.2 Project-Scoped IAM Policy (Least-Privilege)
Attach this policy to the project's dedicated IAM user. It grants full access **only** to the project's specific bucket and denies access to any other bucket in the AWS account:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ProjectBucketManagement",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:PutBucketPolicy",
        "s3:GetBucketCors",
        "s3:PutBucketCors"
      ],
      "Resource": "arn:aws:s3:::<project-name>-assets-<aws-account-id>"
    },
    {
      "Sid": "ProjectObjectOperations",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::<project-name>-assets-<aws-account-id>/*"
    }
  ]
}
```

### 2.3 S3 Public Read & CORS Configuration (For Web Assets)
If the project serves public uploaded images or documents:

**Public Read Bucket Policy (`public/*` only)**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadForMedia",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::<project-name>-assets-<aws-account-id>/public/*"
    }
  ]
}
```

**S3 CORS Configuration**:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://<your-project-domain>.com",
      "https://*.<your-project-domain>.com",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 3. Standard EC2 Instance Provisioning Specification

### 3.1 Security Group Configuration (`<project>-backend-sg`)
Create one unified Security Group with these exact rules:

| Rule Type | Protocol | Port Range | Source / Destination | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Inbound** | TCP | `22` | `0.0.0.0/0` | Secure SSH Management |
| **Inbound** | TCP | `80` | `0.0.0.0/0` | HTTP / Let's Encrypt ACME |
| **Inbound** | TCP | `443` | `0.0.0.0/0` | Production HTTPS Traffic |
| **Inbound** | TCP | `5000` (or App Port) | `0.0.0.0/0` | Direct API Testing |
| **Outbound** | All | `All` | `0.0.0.0/0` | Package downloads & updates |

### 3.2 Canonical Cloud-Init / UserData Script
This script guarantees a production-ready Ubuntu 24.04 server in a single boot:

```bash
#!/bin/bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

echo "=== Step 1: System Updates & Essential Packages ==="
apt-get update -y
apt-get install -y curl wget unzip git net-tools postgresql postgresql-contrib nginx certbot python3-certbot-nginx

echo "=== Step 2: Configure 2GB Swap Space (Prevents OOM Crashes) ==="
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "=== Step 3: Install Node.js LTS (v20.x) & Global Managers ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2 pnpm

echo "=== Step 4: Configure Local PostgreSQL Database ==="
systemctl enable postgresql
systemctl start postgresql

DB_NAME="<project_db>"
DB_USER="<project_admin>"
DB_PASS="<Secure_Password_Here>"

sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';" || true
sudo -u postgres psql -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"
sudo -u postgres psql -d ${DB_NAME} -c "ALTER SCHEMA public OWNER TO ${DB_USER};"

echo "=== Step 5: Network MTU Normalization (Prevents TLS Blackholes) ==="
IFACE=$(ip route | grep default | awk '{print $5}')
ip link set dev "${IFACE}" mtu 1500 || true

echo "=== Server Baseline Initialization Complete ==="
```

---

## 4. Application Deployment & Process Management Workflow

Once the instance baseline is active, the agent executes this deployment sequence via SSH:

### 4.1 Git Clone & Build
```bash
# Clone to standard application directory
cd /home/ubuntu
git clone https://<git-token-or-url>/<repo>.git app
cd /home/ubuntu/app

# Install project dependencies
pnpm install

# Run build if TypeScript
pnpm --filter=@<project>/api build || npm run build
```

### 4.2 Production Environment Configuration (`.env`)
Generate `.env` in the API root directory:
```bash
cat << 'EOF' > /home/ubuntu/app/services/api/.env
PORT=5000
NODE_ENV=production

# Local PostgreSQL connection (URL-encoded password)
DATABASE_URL=postgresql://<project_admin>:<Encoded_Password>@localhost:5432/<project_db>

# Authentication
JWT_ACCESS_SECRET=<Generated_Random_Secret_Key_64_Chars>
JWT_REFRESH_SECRET=<Generated_Random_Secret_Key_64_Chars>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Allowed Origins (Comma separated)
CORS_ORIGINS=https://<your-project-domain>.com,https://admin.<your-project-domain>.com,http://localhost:5173

# S3 Assets Storage
UPLOAD_MODE=s3
AWS_REGION=<aws-region>
AWS_S3_BUCKET=<project-name>-assets-<aws-account-id>
AWS_ACCESS_KEY_ID=<project-iam-access-key>
AWS_SECRET_ACCESS_KEY=<project-iam-secret-key>
EOF
```

### 4.3 Database Migrations & Seeds
Run migrations before launching PM2:
```bash
cd /home/ubuntu/app/services/api
node dist/database/migrations.js || npm run migrate
node dist/seed/index.js || npm run seed
```

### 4.4 PM2 Process Daemon & Systemd Persistence
```bash
cd /home/ubuntu/app/services/api
pm2 start dist/server.js --name "<project>-api"
pm2 save

# Register systemd restart service
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -n 1 | sudo bash
```

---

## 5. Nginx Reverse Proxy & Let's Encrypt SSL

### 5.1 Canonical Nginx Configuration (`/etc/nginx/sites-available/default`)
```nginx
# HTTP - Redirect all traffic to HTTPS and handle ACME verification
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name <api-subdomain.domain.com>;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS - Reverse proxy to Node.js backend
server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name <api-subdomain.domain.com>;

    ssl_certificate /etc/letsencrypt/live/<api-subdomain.domain.com>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<api-subdomain.domain.com>/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Proxy headers
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 5.2 Automated SSL Certificate Issuance
```bash
sudo certbot --nginx -d <api-subdomain.domain.com> --non-interactive --agree-tos -m <admin-email> --redirect
```

---

## 6. Enterprise Network Troubleshooting & Edge Firewalls

### Corporate SSL Gateway Inspection (Tacitine / Squid / Zscaler)
If users on internal office networks receive `Network Error` or `net::ERR_CERT_AUTHORITY_INVALID` when accessing the API:
1. **Diagnosis**: Enterprise middlebox firewalls intercept port 443 and replace public certificates with internal self-signed certificates (e.g., `CN=*.Tacitine.GateWay`).
2. **Immediate Verification**: Open `https://<api-subdomain>/health` in a browser and check if an enterprise gateway warning appears.
3. **Architectural Workaround**:
   - If the frontend is hosted behind a trusted CDN (e.g., Cloudflare, Hostinger CDN, AWS CloudFront), configure a path proxy `/api/v1` on the frontend domain.
   - Browsers will communicate via the same-origin CDN domain, completely bypassing middlebox certificate rewriting.

---

## 7. AI Agent Step-by-Step Execution Checklist

When starting any new deployment task, check off these steps in order:

```text
[ ] 1. Run AWS Discovery: List existing instances and buckets; record them to NEVER touch them.
[ ] 2. Present Architecture & Implementation Plan to user and wait for confirmation.
[ ] 3. Create dedicated Project S3 Bucket with public-read policy on public/* only.
[ ] 4. Create dedicated Project IAM User with scoped policy for this bucket only.
[ ] 5. Provision 1 EC2 Instance (Ubuntu 24.04, t3.micro, Ports 22/80/443/App).
[ ] 6. Allocate 2GB Swap space immediately on the instance.
[ ] 7. Install Node.js 20, Git, PostgreSQL, Nginx, PM2, and pnpm.
[ ] 8. Configure local PostgreSQL database, owner user, and schema grants.
[ ] 9. Push code to GitHub, then clone repository onto the EC2 instance.
[ ] 10. Generate .env with database credentials and S3 configuration.
[ ] 11. Run database migrations and seed scripts.
[ ] 12. Start backend under PM2 and configure systemd persistence.
[ ] 13. Map domain DNS 'A' record to EC2 Public IP.
[ ] 14. Configure Nginx reverse proxy and issue Let's Encrypt SSL certificate.
[ ] 15. Verify endpoints: /health, /api/v1, and CORS from frontend origins.
```
