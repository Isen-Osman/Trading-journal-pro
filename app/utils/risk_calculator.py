class RiskCalculator:
    @staticmethod
    def calculate_risk_reward(entry: float, stop_loss: float, take_profit: float) -> float:
        risk = abs(entry - stop_loss)
        reward = abs(take_profit - entry)
        if risk == 0:
            return 0.0
        return reward / risk
