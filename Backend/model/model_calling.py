from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('indian_carbon_mlp_model.pkl')

FEATURE_ORDER = [
    'body_type', 'gender', 'diet_type', 'transport_mode', 
    'vehicle_fuel_type', 'social_activity_level', 'air_travel_frequency', 
    'waste_bag_size', 'energy_efficiency_level', 'monthly_grocery_bill', 
    'vehicle_distance_km', 'waste_bag_count', 'tv_pc_hours_daily', 
    'new_clothes_monthly', 'internet_hours_daily', 'recycling_count', 
    'cooking_count'
]
NUM_COLS = [
            'monthly_grocery_bill', 'vehicle_distance_km', 'waste_bag_count',
            'tv_pc_hours_daily', 'new_clothes_monthly', 'internet_hours_daily',
            'recycling_count', 'cooking_count'
        ]
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # 1. Create DataFrame
        df = pd.DataFrame([data])
        
        # 2. Add missing columns with default values to prevent KeyError
        for col in FEATURE_ORDER:
            if col not in df.columns:
                # Default for numerical is 0, default for categorical is 'unknown'
                df[col] = 0 if col in NUM_COLS else 'unknown'
        
        # 3. Enforce the exact order the model expects
        df = df[FEATURE_ORDER]
        
        # 4. Convert numbers properly
       
        for col in NUM_COLS:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        prediction = model.predict(df)
        
        return jsonify({
            "total_carbon_emission": float(prediction[0]), 
            "status": "success"
        })

    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}") # This will show in your Flask terminal
        return jsonify({"error": str(e), "status": "error"}), 400

if __name__ == '__main__':
    app.run(port=5001, debug=True)