from sqlalchemy.orm import Session
from app.models.trade import Trade
from app.schemas.trade import TradeCreate, TradeUpdate

class TradeService:

    ## all trades for one user
    @staticmethod
    def get_trades(db: Session, user_id: int):
        return db.query(Trade).filter(Trade.user_id == user_id).all()

    ## create trade
    @staticmethod
    def create_trade(db: Session, trade: TradeCreate, user_id: int):
        db_trade = Trade(**trade.model_dump(), user_id=user_id)
        db.add(db_trade)
        db.commit()
        db.refresh(db_trade)
        return db_trade
