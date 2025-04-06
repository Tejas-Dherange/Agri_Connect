from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'classifier1.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Fertilizer label mapping
fertilizer_labels = {
    0: "TEN-TWENTY SIX-TWENTY SIX",
    1: "Fourteen-Thirty Five-Fourteen",
    2: "Seventeen-Seventeen-Seventeen",
    3: "TWENTY-TWENTY",
    4: "TWENTY EIGHT-TWENTY EIGHT",
    5: "DAP",
    6: "UREA"
}

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    try:
        data = request.json
        
        # Extract N, P, K values
        N = float(data.get('N', 0))
        P = float(data.get('P', 0))
        K = float(data.get('K', 0))
        
        # Make prediction
        prediction = model.predict([[N, P, K]])[0]
        
        # Get fertilizer name from mapping
        fertilizer = fertilizer_labels.get(prediction, "Unknown")
        
        return jsonify({"fertilizer": fertilizer})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 