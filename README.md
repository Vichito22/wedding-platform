# Wedding Platform

## Stack

- Next.js
- FastAPI
- PostgreSQL
- Docker
- Railway

## Running Locally

### Option 1: With Docker (Recommended)

```bash
docker compose up --build
```

### Option 2: Running Services Separately

#### Backend (FastAPI)

1. **Create a virtual environment**
   ```bash
   cd apps/backend
   python -m venv venv
   ```

2. **Activate the virtual environment**
   
   On Windows (PowerShell):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
   
   On Windows (CMD):
   ```cmd
   .\venv\Scripts\activate
   ```
   
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`

#### Frontend (Next.js)

1. **Install dependencies**
   ```bash
   cd apps/frontend
   npm install
   ```

2. **Option A: Development mode**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

3. **Option B: Build and production**
   ```bash
   npm run build
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Notes

- Make sure you're in the correct directory before running any commands
- For development, use `npm run dev` on the frontend
- For production, use `npm run build` followed by `npm start`
- The backend requires Python 3.8+ to be installed