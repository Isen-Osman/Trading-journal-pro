from sqlalchemy.orm import Session
from app.models.trade import Trade

class AnalyticsService:
    @staticmethod
    def get_pnl_summary(db: Session, user_id: int):
        trades = db.query(Trade).filter(Trade.user_id == user_id, Trade.status == "CLOSED").all()
        total_pnl = sum((t.exit_price - t.entry_price) * t.quantity
                        if t.side == "BUY"
                        else (t.entry_price - t.exit_price) * t.quantity
                            for t in trades
                                if t.exit_price
                        )
        return {"total_pnl": total_pnl}
