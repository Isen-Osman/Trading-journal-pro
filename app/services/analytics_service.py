from sqlalchemy.orm import Session
from app.models.trade import Trade

class AnalyticsService:
    @staticmethod
    def get_pnl_summary(db: Session, user_id: int):
        trades = db.query(Trade).filter(Trade.user_id == user_id, Trade.status == "CLOSED").all()
        results = [
            (t.exit_price - t.entry_price) * t.quantity
            if t.side in ("BUY", "LONG")
            else (t.entry_price - t.exit_price) * t.quantity
            for t in trades if t.exit_price is not None
        ]
        return {
            "total_pnl": sum(results),
            "total_trades": len(results),
            "win_trades": sum(1 for r in results if r > 0),
            "loss_trades": sum(1 for r in results if r < 0),
        }
