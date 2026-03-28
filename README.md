# Trading Journal Pro

A full-stack trading journal and analytics application.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (TypeScript, Tailwind CSS, App Router)
- **Database:** PostgreSQL (via SQLAlchemy)

## Getting Started

### Backend Setup
1. Navigate to the root directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env` (use `.env.example` as a template).
5. Run the backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Project Structure
- `app/`: FastAPI backend implementation.
- `frontend/`: Next.js frontend application.
- `tests/`: Backend test suite.
- `migrations/`: Database migrations.
