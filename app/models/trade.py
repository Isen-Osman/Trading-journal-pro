from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
##типовите за колони (како SQL типови: int, string, float...)
from sqlalchemy.orm import relationship
##Се користи за врска меѓу табели (User ↔ Trade)
from app.core.database import Base
## base e osnovata od koja se pravat site modeli
from datetime import datetime, timezone


class Trade(Base):
    ## imeto na tabelata
    __tablename__ = "trades"

    ## index = pobrzo prebaruvanje
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    entry_price = Column(Float)
    exit_price = Column(Float, nullable=True)
    quantity = Column(Float)
    side = Column(String)  # BUY or SELL
    status = Column(String)  # OPEN or CLOSED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="trades")
    ##pravi vrska pomegu User modelot
