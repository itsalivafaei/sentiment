# Import necessary libraries
import pickle
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'model')

# Load the model
model_load_path = os.path.join(MODEL_DIR, 'sentiment_analysis_model.h5')
model = load_model(model_load_path)
print("Model loaded successfully.")

# Load the tokenizer
tokenizer_load_path = os.path.join(MODEL_DIR, 'tokenizer.pickle')
with open(tokenizer_load_path, 'rb') as handle:
    tokenizer = pickle.load(handle)
print("Tokenizer loaded successfully.")

# Load max_seq_length
max_seq_length_load_path = os.path.join(MODEL_DIR, 'max_seq_length.pickle')
with open(max_seq_length_load_path, 'rb') as handle:
    max_seq_length = pickle.load(handle)
print("max_seq_length loaded successfully.")


# Define the text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # Remove HTML tags
    text = re.sub('https?://\S+|www\.\S+', '', text)  # Remove URLs
    text = re.sub(r'[^a-zA-Z\s]', '', text)  # Remove non-alphabetic characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text


# Create a Flask app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Sentiment Analysis API."

@app.route('/sentiment', methods=['GET'])
def sentiment_info():
    return (
        "This endpoint accepts POST " + 
        "requests with JSON payload {'text': 'your text'}."
        )

# Define the sentiment prediction route
@app.route('/sentiment', methods=['POST'])
def predict_sentiment():
    try:
        data = request.get_json()
        text = data['text']

        # Validate input
        if not text:
            return jsonify({'error': 'No text provided.'}), 400

        # Clean the review
        cleaned_review = clean_text(text)

        # Convert to sequence
        review_sequence = tokenizer.texts_to_sequences([cleaned_review])

        # Pad the sequence
        review_padded = pad_sequences(
            review_sequence, 
            maxlen=max_seq_length, 
            padding='post', 
            truncating='post'
            )

        # Predict sentiment
        prediction = model.predict(review_padded)[0][0]

        # Determine sentiment and probability
        sentiment = "Positive" if prediction > 0.5 else "Negative"
        probability = prediction if prediction > 0.5 else 1 - prediction

        return jsonify({
            'sentiment': sentiment, 'probability': float(probability)
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Run the Flask app
# Bind to '0.0.0.0' to make it accessible externally
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
