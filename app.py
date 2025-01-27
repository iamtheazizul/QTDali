# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from dotenv import find_dotenv, load_dotenv
from langchain_dartmouth.llms import ChatDartmouth

# Load environment variables
load_dotenv(find_dotenv())

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all domains to access your API

# Initialize the LLM
llm = ChatDartmouth(model_name="llama-3-1-8b-instruct")

@app.route('/api/generate', methods=['POST'])
def generate_response():
    user_prompt = request.json.get('prompt', '')  # Get the prompt from the request
    response = llm.invoke(user_prompt)  # Call the LLM to generate a response

    # Return the response as JSON
    return jsonify({'response': response.content})

if __name__ == '__main__':
    app.run(debug=True)