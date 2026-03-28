from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.trade import Trade, TradeCreate
from app.services.trade_service import TradeService

router = APIRouter()

@router.get("/", response_model=List[Trade])
def read_trades(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TradeService.get_trades(db, current_user.id)

@router.post("/", response_model=Trade)
def create_trade(trade: TradeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TradeService.create_trade(db, trade, current_user.id)
