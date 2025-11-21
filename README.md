# Task Manager with Role-Based Access (Full ZIP with Attractive UI)

## Quick start

### Backend
```
cd backend
npm install
cp .env.example .env
# edit .env to set JWT_SECRET
npm run dev
```

### Frontend
```
cd frontend
npm install
npm run dev
```

Backend default: http://localhost:5001
Frontend (Vite): http://localhost:5173

Make first user admin:
```
cd backend
node promote.js 1
```
