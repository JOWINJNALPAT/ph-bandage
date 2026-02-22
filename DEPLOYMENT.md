# 🏥 DEPLOYMENT GUIDE

Complete instructions for deploying the pH Bandage System to production.

## 📋 Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] .env.example files updated
- [ ] Database backups in place
- [ ] SSL certificates ready
- [ ] Domain name configured
- [ ] Environment variables set

## 🚀 Deployment Options

### Option 1: Heroku + MongoDB Atlas

#### Backend on Heroku
```bash
cd backend

# Create Heroku app
heroku create ph-bandage-api

# Set environment variables
heroku config:set JWT_SECRET=your_very_secret_key
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ph-bandage

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Frontend on Netlify
```bash
cd frontend

# Build production version
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### MongoDB Atlas Setup
1. Go to mongodb.com/cloud
2. Create account and free tier cluster
3. Create database user
4. Add IP whitelist
5. Get connection string
6. Update in Heroku config

---

### Option 2: Docker + AWS

#### Create Dockerfile (Backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/ph-bandage
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongodb

  web:
    build: ./frontend
    ports:
      - "3000:3000"

volumes:
  mongo_data:
```

#### Build & Run
```bash
docker-compose up --build
```

---

### Option 3: AWS EC2 + RDS + S3

#### EC2 Setup
```bash
# SSH into instance
ssh -i key.pem ec2-user@your-ip

# Update system
sudo yum update -y
sudo yum install nodejs npm git -y

# Clone repo
git clone your-repo
cd ph-bandage

# Setup backend
cd backend
npm install
cp .env.example .env

# Edit .env with RDS MongoDB URI and JWT secret
nano .env

# Start with PM2
npm install -g pm2
pm2 start server.js --name "ph-bandage-api"
pm2 save

# Setup frontend
cd ../frontend
npm install
npm run build

# Serve with nginx
sudo amazon-linux-extras install nginx -y
sudo systemctl start nginx

# Copy build to nginx
sudo cp -r build/* /var/www/html/
```

---

### Option 4: DigitalOcean App Platform

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo
git push -u origin main
```

2. **Create App on DigitalOcean**
   - Go to app.digitalocean.com
   - Click "Create App"
   - Select GitHub repository
   - Configure:
     - Backend: `node server.js` on port 5000
     - Frontend: `npm run build` with `build/` directory
   - Add MongoDB (DBaaS)
   - Set environment variables

3. **Deploy**
   - Click Deploy
   - Monitor logs

---

## 🔒 Security in Production

### Environment Variables
Never commit:
```
JWT_SECRET=
MONGODB_URI=
API_KEY=
```

Use `.env` file (in .gitignore):
```bash
# backend/.env
JWT_SECRET=very_long_random_string_here
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NODE_ENV=production
PORT=5000
```

### SSL/TLS Certificate
```bash
# Use Let's Encrypt (free)
sudo certbot certonly --standalone -d yourdomain.com
```

### CORS Configuration
Update backend/server.js:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Database Backups
```bash
# Backup MongoDB
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ph-bandage"

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" dump/
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

### Application Insights (Azure)
1. Create Application Insights resource
2. Add to Node.js app:
```javascript
const appInsights = require("applicationinsights");
appInsights.setup("instrumentation-key").start();
```

### CloudWatch (AWS)
```bash
# Install agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/linux/amd64/latest/amazon-cloudwatch-agent.rpm
rpm -U ./amazon-cloudwatch-agent.rpm
```

---

## 🔧 Scaling Considerations

### Horizontal Scaling
- Use load balancer (HAProxy, Nginx, AWS ALB)
- Run multiple Node.js instances
- Use sticky sessions for JWT

### Vertical Scaling
- Increase server RAM/CPU
- Upgrade database tier
- Optimize queries with indexes

### Database Optimization
```javascript
// Add indexes
userSchema.index({ email: 1 });
patientSchema.index({ assignedDoctor: 1 });
scanSchema.index({ patientId: 1, timestamp: -1 });
```

---

## 📈 Performance Optimization

### Frontend Optimization
```bash
# Production build
npm run build

# Analyze bundle
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Backend Optimization
- Use Redis caching for frequently accessed data
- Implement request rate limiting
- Enable gzip compression

---

## 🚨 Incident Response

### Server Down
1. Check PM2 status: `pm2 status`
2. Restart service: `pm2 restart ph-bandage-api`
3. Check logs: `pm2 logs`
4. Monitor CPU/Memory: `pm2 monit`

### Database Connection Lost
1. Check MongoDB status
2. Verify connection string in .env
3. Check firewall/IP whitelist
4. Restart application

### High CPU Usage
1. Check processes: `top`
2. Review slow queries
3. Add database indexes
4. Increase server resources

---

## 📞 Post-Deployment

1. **Test all endpoints**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **Monitor application**
   - Set up alerts for errors
   - Monitor response times
   - Track user activity

3. **Backup strategy**
   - Daily database backups
   - Upload backups to S3
   - Test restore process

4. **Update monitoring**
   - Set CPU threshold alert
   - Set memory threshold alert
   - Set error rate alert

---

## 📝 Domain Configuration

### DNS Records Needed
```
A Record: @ -> Your Server IP
CNAME: api -> api.yourdomain.com
CNAME: www -> yourdomain.com
```

### Example with Cloudflare
1. Add domain to Cloudflare
2. Update nameservers at registrar
3. Create A record pointing to server IP
4. Enable SSL/TLS (Full or Flexible)
5. Set up Page Rules if needed

---

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Database running and connected
- [ ] SSL certificate installed
- [ ] CORS properly configured
- [ ] Backups automated
- [ ] Monitoring set up
- [ ] Error logging enabled
- [ ] Performance baseline established
- [ ] Documentation updated
- [ ] Team trained on deployment

---

**Happy Deploying! 🚀**
