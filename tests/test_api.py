import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

# Setup test database (SQLite in memory)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_db.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def get_token_for_user(username, email, password):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": password}
    )
    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": username, "password": password}
    )
    return response.json()["access_token"]

def test_user_registration():
    response = client.post(
        "/api/v1/auth/register",
        json={"username": "testuser", "email": "test@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

def test_user_login_endpoint():
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={"username": "loginuser", "email": "login@test.com", "password": "password123"}
    )
    
    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "loginuser", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_create_and_get_trade():
    token = get_token_for_user("tradeuser", "trade@test.com", "password123")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create trade
    trade_data = {
        "symbol": "BTCUSDT",
        "entry_price": 60000.0,
        "quantity": 0.5,
        "side": "BUY",
        "status": "OPEN"
    }
    response = client.post("/api/v1/trades/", json=trade_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["symbol"] == "BTCUSDT"
    
    # Get trades
    response = client.get("/api/v1/trades/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_analytics_summary():
    token = get_token_for_user("analyticsuser", "analytics@test.com", "password123")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get summary (should be 0 for now)
    response = client.get("/api/v1/analytics/summary", headers=headers)
    assert response.status_code == 200
    assert "total_pnl" in response.json()
