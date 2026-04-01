from sqlalchemy.orm import Session
from app.models.trade import Trade

class AnalyticsService:
    @staticmethod
    def get_pnl_summary(db: Session, user_id: int):
        all_trades = db.query(Trade).filter(Trade.user_id == user_id).all()
        closed_trades = [t for t in all_trades if t.status == "CLOSED" and t.exit_price is not None]
        
        total_pnl = 0
        win_trades = 0
        loss_trades = 0
        
        for t in closed_trades:
            pnl = (t.exit_price - t.entry_price) * t.quantity if t.side == "LONG" else (t.entry_price - t.exit_price) * t.quantity
            total_pnl += pnl
            if pnl > 0:
                win_trades += 1
            else:
                loss_trades += 1
                
        return {
            "total_pnl": total_pnl,
            "total_trades": len(all_trades),
            "closed_trades": len(closed_trades),
            "win_trades": win_trades,
            "loss_trades": loss_trades
        }
