from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TradeBase(BaseModel):
    symbol: str
    entry_price: float
    quantity: float
    side: str
    status: str

class TradeCreate(TradeBase):
    pass

class TradeUpdate(BaseModel):
    exit_price: Optional[float] = None
    status: Optional[str] = None

class Trade(TradeBase):
    id: int
    exit_price: Optional[float]
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)
