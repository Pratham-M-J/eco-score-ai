# predictor.py
import torch 
import pandas as pd
import joblib
from models import EcoScoreModel

print("🧠 Loading ML Models into memory...")

# 1. Load models globally so they only load ONCE
target_encoder = joblib.load('target_encoder.pkl')
distance_scaler = joblib.load('distance_scaler.pkl')

eco_predictor = EcoScoreModel(input_features=9)
eco_predictor.load_state_dict(torch.load("eco_model_weights.pth"))
eco_predictor.eval()

def preprocess_user_input(raw_user_data: dict) -> torch.Tensor:
    """Converts a dictionary of raw user inputs into a PyTorch tensor."""
    df = pd.DataFrame([raw_user_data])

    bool_cols = ['chemical_finish', 'has_oeko_tex', 'is_fair_trade', 'is_b_corp']
    for col in bool_cols:
        df[col] = df[col].astype(int)

    cat_cols = ['primary_material', 'dye_type', 'manufacturing_country']
    df[cat_cols] = target_encoder.transform(df[cat_cols])

    df[['shipping_distance_km']] = distance_scaler.transform(df[['shipping_distance_km']])

    expected_order = [
        'primary_material', 'recycled_percentage', 'dye_type',
        'chemical_finish', 'manufacturing_country', 'shipping_distance_km',
        'has_oeko_tex', 'is_fair_trade', 'is_b_corp'
    ]
    df = df[expected_order]

    input_tensor = torch.tensor(df.values, dtype=torch.float32)
    return input_tensor

def get_eco_score(user_payload: dict) -> dict:
    """
    Main function to be called by LangGraph.
    Takes the payload, runs inference, and returns formatted scores.
    """
    try:
        ready_tensor = preprocess_user_input(user_payload)
        
        with torch.no_grad():
            prediction = eco_predictor(ready_tensor).numpy()
            
        # Assuming your model returns a 1D array or a 2D array like [[carbon_score, eco_score]]
        # Adjust these indices based on exactly what your model outputs!
        scores = prediction[0] 
        
        return {
            "status": "success",
            "raw_prediction": scores.tolist() # Convert numpy to list for JSON serialization
        }
    except Exception as e:
        print(f"🚨 Prediction Error: {e}")
        return {"status": "error", "message": str(e)}