class FOMODetector:
    @staticmethod
    def detect(entry_price: float, current_price: float, avg_entry: float) -> bool:
        # Simple placeholder logic: if entry is 10% higher than average, it might be FOMO
        if entry_price > avg_entry * 1.1:
            return True
        return False
