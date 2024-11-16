from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from google.cloud import firestore
from tensorflow.keras.preprocessing.sequence import pad_sequences
import logging

from load_files import model, tokenizer, max_seq_length
from clean_text import clean_text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a Flask app instance
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["5 per minute", "100 per day", "15 per hour"],
)

db = firestore.Client()

# Constant - global request limit
REQUEST_LIMIT = 1000
COUNTER_DOC = 'request_coutner/global'


# Function to get and update the request counter
def increment_request_counter():
    counter_ref = db.document(COUNTER_DOC)

    # Use a transaction to prevent race conditions
    transaction = db.transaction()

    @firestore.transactional
    def update_counter(transaction, counter_ref):
        snapshot = counter_ref.get(transaction=transaction)
        if snapshot.exists:
            coutner_data = snapshot.to_dict()
            current_count = coutner_data.get('count', 0)
            if current_count >= REQUEST_LIMIT:
                # Limit reached, return False
                return False
            else:
                transaction.update(counter_ref, {'count': current_count + 1})
                return True
        else:
            # Counter document doesn't exist, create it
            transaction.set(counter_ref, {'count': 1})
            return True
    return update_counter(transaction, counter_ref)


@app.route("/", methods=["GET"])
def home():
    return "Welcome to the Sentiment Analysis API."


@app.route("/sentiment", methods=["GET"])
def sentiment_info():
    return (
        "This endpoint accepts POST "
        + "requests with JSON payload {'text': 'your text'}."
    )


# Define the sentiment prediction route
@app.route("/sentiment", methods=["POST"])
@limiter.limit("5 per minute")  # Limit the number of requests per minute per IP
def predict_sentiment():
    logger.info("Received sentiment prediction request")
    try:
        # Global request limit check
        counter_incremented = increment_request_counter()
        if not counter_incremented:
            return jsonify({"error": "Request limit exceeded."}), 429

        # Get the request data
        data = request.get_json()
        text = data["text"]

        # Validate input
        if not text:
            return jsonify({"error": "No text provided."}), 400

        # Clean the review
        cleaned_review = clean_text(text)

        # Convert to sequence
        review_sequence = tokenizer.texts_to_sequences([cleaned_review])

        # Pad the sequence
        review_padded = pad_sequences(
            review_sequence,
            maxlen=max_seq_length,
            padding="post",
            truncating="post"
        )

        # Predict sentiment
        prediction = model.predict(review_padded)[0][0]

        # Determine sentiment and probability
        sentiment = "Positive" if prediction > 0.5 else "Negative"
        probability = prediction if prediction > 0.5 else 1 - prediction

        return jsonify({
            "sentiment": sentiment,
            "probability": float(probability)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
