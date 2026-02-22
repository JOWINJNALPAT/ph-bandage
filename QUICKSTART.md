# ⚡ Quick Start Guide

Get the pH Bandage system running in 5 minutes!

## 1️⃣ Prerequisites Check
- [x] Node.js 16+ installed? (`node --version`)
- [x] MongoDB running? (`mongod` in terminal)
- [x] Git installed?

## 2️⃣ Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed        # Load sample data
npm run dev         # Start server (http://localhost:5000)
```

**Default Test Accounts:**
- Admin: `admin@hospital.com` / `password123`
- Doctor: `sarah@hospital.com` / `password123`
- Nurse: `emily@hospital.com` / `password123`

## 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm start           # Opens http://localhost:3000
```

## 4️⃣ Test the System

### Nurse Workflow (30 seconds)
1. Login as: `emily@hospital.com` / `password123`
2. Enter Bandage ID: `BANDAGE-001`
3. Select Color: `Yellow` (or upload image)
4. Click "Submit Scan"
5. See results instantly! ✅

### Doctor Workflow (1 minute)
1. Login as: `sarah@hospital.com` / `password123`
2. Click "View Details & Scans" for John Doe
3. See pH trend graph 📊
4. View all scan history with nurse names
5. Add medical notes
6. Mark wound status

### Admin Workflow (1 minute)
1. Login as: `admin@hospital.com` / `password123`
2. View analytics (total users, patients, scans)
3. See infection statistics
4. Create new users
5. Manage hospital staff

## 🎨 Color Reference

| Color | Meaning | pH |
|-------|---------|-----|
| 🟡 Yellow | Healthy | 5.5-6.5 |
| 🟢 Green | Mild Risk | 6.6-7.2 |
| 🔵 Blue | Medium | 7.3-8.0 |
| 🟦 Dark Blue | High Risk | >8.0 |

## 🐛 Common Issues

**Port 5000 already in use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**MongoDB not found?**
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud):
# 1. Create account at mongodb.com
# 2. Get connection string
# 3. Update MONGODB_URI in backend/.env
```

**npm install fails?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Full Documentation

See [README.md](./README.md) for complete API docs and database schemas

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with test accounts
- [ ] Can submit a scan as nurse
- [ ] Can view scans as doctor
- [ ] Can see analytics as admin

---

🎉 **You're ready! Start the system and begin scanning.**
