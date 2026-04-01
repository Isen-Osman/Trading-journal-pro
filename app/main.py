from fastapi import FastAPI
from app.api.v1.routes import auth, trades, analytics
from app.core.config import settings
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Create tables
Base.metadata.create_all(bind=engine)

# 1. Креирај го app САМО ЕДНАШ со сите подесувања
app = FastAPI(title=settings.PROJECT_NAME)

# 2. Дефинирај ги дозволените извори
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# 3. Додај го Middleware-от на тој објект
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Вклучи ги рутерите
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(trades.router, prefix="/api/v1/trades", tags=["trades"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {"message": "Welcome to Trading Journal Pro API"}