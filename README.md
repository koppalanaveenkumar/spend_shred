# 👻 SpendShred

> **Stop paying for software you don't use.**
> SpendShred connects to your financial data and email to automatically identify "Zombie Subscriptions"—SaaS tools you pay for but never log into.

![SpendShred Dashboard](client/public/vite.svg)

## 🚀 Features

*   **🕵️‍♂️ Zombie Detection:** Scans your Gmail for receipts and "We miss you" emails to find unused subscriptions.
*   **📊 Command Center:** A unified dashboard to track your total monthly burn and active services.
*   **🔌 Integrations:** Seamlessly connects with Google (Gmail) to auto-discover spending.
*   **✂️ One-Click Cancellation:** Generate cancellation emails instantly to stop the bleeding.
*   **📈 Analytics:** Visual breakdowns of spend by category, team, and usage status.

## 🛠️ Tech Stack

### Frontend
*   **React:** Modern UI library.
*   **Vite:** Blazing fast build tool.
*   **CSS Objects:** Custom glassmorphism design system (no generic UI libraries).
*   **Lucide React:** Beautiful, consistent iconography.

### Backend
*   **FastAPI:** High-performance Python web framework.
*   **SQLModel:** Interact with SQL databases using Python objects.
*   **TiDB Cloud (MySQL):** Scalable, distributed SQL database.
*   **Google OAuth 2.0:** Secure authentication and Gmail API integration.

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   MySQL Database (Remote TiDB or Local)
*   Google Cloud Console Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/spendshred.git
cd spendshred
```

### 2. Backend Setup
```bash
cd server
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `server/`:
```ini
DATABASE_URL="mysql+mysqlconnector://user:pass@host:4000/db?ssl_ca=..."
SECRET_KEY="your_super_secret_key"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
FRONTEND_URL="http://localhost:5173"
```

Run the server:
```bash
uvicorn main:app --reload
# API will be running at http://localhost:8000
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in `client/`:
```ini
VITE_API_URL="http://localhost:8000"
```

Run the client:
```bash
npm run dev
# App will be running at http://localhost:5173
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string (TiDB recommended). |
| `SECRET_KEY` | Secret for JWT token generation. |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console. |
| `VITE_API_URL` | URL of the backend API (Frontend Only). |

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a complete step-by-step guide to deploying on:
*   **Backend:** Render / Railway
*   **Frontend:** Vercel / Netlify
*   **Database:** TiDB Cloud

## 📜 License
MIT License. Built by **Naveenkumar Koppala**.
