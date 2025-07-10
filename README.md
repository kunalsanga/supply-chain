# RetailFlow AI

Transforming the retail supply chain with AI, IoT simulation, and real-time tracking.

## Folder Structure

```
retailflow-ai/
│
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── ml/
│   │   ├── schemas/
│   │   └── main.py
│   ├── requirements.txt
│   └── iot_simulator.py
│
├── frontend/               # Next.js customer app
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── utils/
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
├── admin-dashboard/        # React.js admin dashboard
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Deployment
- **Frontend:** Deploy `frontend/` to Vercel (free tier)
- **Backend:** Deploy `backend/` to Render (free tier, web service)
- **Database:** PostgreSQL on Render (free tier)
- **Admin Dashboard:** Deploy `admin-dashboard/` to Vercel or Netlify

## Quickstart

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### IoT Simulator
```bash
cd backend
python iot_simulator.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm start
``` 