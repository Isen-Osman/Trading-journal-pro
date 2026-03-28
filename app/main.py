from fastapi import FastAPI
from app.api.v1.routes import auth, trades, analytics
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(trades.router, prefix="/api/v1/trades", tags=["trades"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {"message": "Welcome to Trading Journal Pro API"}
