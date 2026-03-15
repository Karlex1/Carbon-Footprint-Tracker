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
@app.route('/health',methods=['GET','HEAD'])
def health():
    return {"status":'awake',"message":"MLP is ready"},200

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

# suggestion part start
def clean_for_model(data_dict):
    """Ensures input matches the MLP model requirements exactly"""
    temp_df = pd.DataFrame([data_dict])
    for col in FEATURE_ORDER:
        if col not in temp_df.columns:
            temp_df[col] = 0 if col in NUM_COLS else 'unknown'
    for col in NUM_COLS:
        temp_df[col] = pd.to_numeric(temp_df[col], errors='coerce').fillna(0)
    return temp_df[FEATURE_ORDER]
LADDERS = {
    'diet_type': ['omnivore', 'pescatarian', 'vegetarian', 'vegan'],
    'vehicle_fuel_type': ['diesel', 'petrol', 'cng', 'electric'],
    'energy_efficiency_level': ['No', 'Sometimes', 'Yes'],
    'transport_mode': ['private', 'public', 'walk/bicycle'],
    'air_travel_frequency': ['very frequently', 'frequently', 'rarely', 'never']
}
@app.route('/suggestion',methods=['POST'])
def suggestionengine():
    try:
        data=request.get_json()
        curr_df=clean_for_model(data)
        baseline_emission=float(model.predict(curr_df)[0])
        suggestions=[]
        for feature,steps in LADDERS.items():
            curr_val=data.get(feature)
            if curr_val in steps:
                curr_idx=steps.index(curr_val)
                if curr_idx<len(steps)-1:
                    next_step=steps[curr_idx+1]
                    alt_profile=data.copy()
                    alt_profile[feature]=next_step
                    alt_df=clean_for_model(alt_profile)
                    new_pred=model.predict(alt_df)[0]
                    saving=baseline_emission-new_pred
                    if saving>0:
                        suggestions.append({
                            "category":feature,
                            "tip":f"Try moving from {curr_val} to {next_step}.",
                            "replacement":next_step,
                            "potential_saving":round(saving,2),
                            "is_incremental":True
                        })
        return jsonify(sorted(suggestions,key=lambda x:x['potential_saving'],reverse=True))
    except Exception as e:
        return jsonify({"error":str(e)}),400     

if __name__ == '__main__':
    app.run(port=5001,debug=True)