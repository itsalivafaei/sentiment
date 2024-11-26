from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.exception import AppwriteException
import os

from tensorflow.keras.preprocessing.sequence import pad_sequences
import logging

from load_files import model, tokenizer, max_seq_length
from clean_text import clean_text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constant - Global request limit
REQUEST_LIMIT = 1000
COUNTER_DOC_ID = "global"

def increment_request_counter(database):
    try:
        counter_doc = database.get_document(
            collection_id="request_counter",
            document_id=COUNTER_DOC_ID
        )
        current_count = counter_doc["count"]

        if current_count >= REQUEST_LIMIT:
            return False
        else:
            database.update_document(
                collection_id="request_counter",
                document_id=COUNTER_DOC_ID,
                data={"count": current_count + 1}
            )
            return True
    except AppwriteException as e:
        if e.code == 404:
            database.create_document(
                collection_id="request_counter",
                data={"count": 1},
                document_id=COUNTER_DOC_ID
            )
            return True
        else:
            raise e

def main(context):
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.request.headers["x-appwrite-key"])
    )
    database = Databases(client)

    try:
        if context.req.path == "/sentiment" and context.req.method == "POST":
            logger.info("Received sentiment prediction POST request")

            counter_incremented = increment_request_counter(database)
            if not counter_incremented:
                return context.res.json({"error": "Request limit reached"}, status_code=429)

            # Get the request data
            data = context.req.json
            text = data.get("text")

            # Validate input
            if not text:
                return context.res.json({"error": "No text provided"}, status_code=400)

            # Clean the review
            cleaned_review = clean_text(text)

            # Convert to seq
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
            sentiment = "positive" if prediction >= 0.5 else "negative"
            probability = float(prediction) if prediction >= 0.5 else float(1 - prediction)

            return context.res.json({
                "sentiment": sentiment,
                "probability": probability
            })

        else:
            return context.res.json(
                {"error": "Invalid endpoint or method."},
                status_code=404
            )

    except AppwriteException as e:
        return context.res.json(
            {"error": "An error occurred: " + str(e)},
            status_code=500
        )