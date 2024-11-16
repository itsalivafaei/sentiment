import os
import pickle
from tensorflow.keras.models import load_model  # type: ignore

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
