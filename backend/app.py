# from flask import Flask, jsonify, request
# from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
# from flask_cors import CORS
# from pymongo import MongoClient
# from bson import ObjectId
# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# app = Flask(__name__)
# # OR allow specific origins (recommended)
# CORS(app, resources={r"/auth/*": {"origins": "http://localhost:5173"}})

# # MongoDB connection URI
# MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/auth")
# client = MongoClient(MONGO_URI)

# # Set a secret key for signing JWT tokens
# app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "b87d4375f5c0bf6ece3834db4628aa1c0a789b2f786e8ecd542f12083270a3f4")

# # Initialize the JWT manager
# jwt = JWTManager(app)

# # Select database
# db = client['auth']

# # Helper function to serialize MongoDB ObjectId
# def serialize_object(obj):
#     if isinstance(obj, ObjectId):
#         return str(obj)
#     return obj

# # Signup route
# @app.route('/auth/signup', methods=['POST'])
# def signup():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')
#     role = data.get('role', 'faculty')

#     if not username or not password:
#         return jsonify({"status": "error", "message": "Username and password are required"}), 400

#     user_collection = db['users']
    
#     existing_user = user_collection.find_one({"username": username})
#     if existing_user:
#         return jsonify({"status": "error", "message": "Username already exists"}), 400

#     # Store password in plain text (not recommended for production)
#     user_collection.insert_one({
#         "username": username,
#         "password": password,  # Store plain text password
#         "role": role
#     })
    
#     return jsonify({"status": "success", "message": "User registered successfully!"}), 200

# # Login route
# @app.route('/auth/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     username = data.get('username')
#     password = data.get('password')

#     if not username or not password:
#         return jsonify({"status": "error", "message": "Username and password are required"}), 400

#     user_collection = db['users']
#     user = user_collection.find_one({"username": username})

#     if user:
#         stored_password = user['password']
        
#         # Compare plain text passwords (not recommended for production)
#         if password == stored_password:
#             token = create_access_token(identity=username)
            
#             user['id'] = serialize_object(user['_id'])
#             user.pop('_id')
            
#             return jsonify({
#                 "status": "success",
#                 "token": token,
#                 "user": {
#                     "username": user['username'],
#                     "role": user['role']
#                 }
#             })

#     return jsonify({"status": "error", "message": "Invalid username or password"}), 401

# # Protected route example (for testing)
# @app.route('/auth/protected', methods=['GET'])
# @jwt_required()
# def protected():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200

# # New endpoint to handle CO data submission
# @app.route('/auth/submit-co-data', methods=['POST'])
# def submit_co_data():
#     try:
#         data = request.get_json()
#         # Ensure weightedAveragePercentage is present in the data
#         if "weightedAveragePercentage" not in data:
#             return jsonify({"status": "error", "message": "weightedAveragePercentage is missing"}), 400

#         # Insert the data into MongoDB
#         db.co_data.insert_one(data)

#         return jsonify({"status": "success", "message": "CO data submitted successfully!"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# @app.route('/auth/get-all-co-data', methods=['GET'])
# @jwt_required()
# def get_all_co_data():
#     try:
#         # Fetch all CO data from the MongoDB collection
#         co_data_collection = db['co_data']
#         all_co_data = list(co_data_collection.find({})) # Convert cursor to list

#         # Serialize ObjectId fields to strings
#         for data in all_co_data:
#             data['_id'] = str(data['_id'])

#         return jsonify({"status": "success", "data": all_co_data}), 200

#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500
    

# collection = db["tableData"]


# # Initial Data Structure
# initial_data = [
#     { "type": "Theory", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
#     { "type": "Theory Integrated Lab", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
#     { "type": "Lab", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
#     { "type": "Project", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
#     { "type": "EEC", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
#     { "type": "NM", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
# ]

# # Route to fetch data
# @app.route("/getData", methods=["GET"])
# def get_data():
#     data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB ID
#     if not data:
#         collection.insert_many(initial_data)  # Insert default values
#         data = initial_data
#     return jsonify(data)

# # Route to save data
# @app.route("/saveData", methods=["POST"])
# def save_data():
#     new_data = request.json
#     collection.delete_many({})  # Clear old data
#     collection.insert_many(new_data)  # Insert new data
#     return jsonify({"message": "Data saved successfully!"})
    

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Allow all routes to be accessed from http://localhost:5173
CORS(app, origins="http://localhost:5173")

# MongoDB connection URI
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/auth")
client = MongoClient(MONGO_URI)

db = client['auth']
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "b87d4375f5c0bf6ece3834db4628aa1c0a789b2f786e8ecd542f12083270a3f4")
jwt = JWTManager(app)

# Helper function to serialize MongoDB ObjectId
def serialize_object(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj

# Signup route
@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'faculty')

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password are required"}), 400

    user_collection = db['users']
    existing_user = user_collection.find_one({"username": username})
    if existing_user:
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    user_collection.insert_one({
        "username": username,
        "password": password,  # Store plain text password for now
        "role": role
    })
    return jsonify({"status": "success", "message": "User registered successfully!"}), 200

# Login route
@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password are required"}), 400

    user_collection = db['users']
    user = user_collection.find_one({"username": username})

    if user and password == user['password']:  # Plain text password check
        token = create_access_token(identity=username)
        return jsonify({
            "status": "success",
            "token": token,
            "user": {"username": user['username'], "role": user['role']}
        })

    return jsonify({"status": "error", "message": "Invalid username or password"}), 401

# Protected route
@app.route('/auth/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# CO Data Submission
@app.route('/auth/submit-co-data', methods=['POST'])
def submit_co_data():
    try:
        data = request.get_json()
        if "weightedAveragePercentage" not in data:
            return jsonify({"status": "error", "message": "weightedAveragePercentage is missing"}), 400

        db.co_data.insert_one(data)
        return jsonify({"status": "success", "message": "CO data submitted successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/auth/get-all-co-data', methods=['GET'])
@jwt_required()
def get_all_co_data():
    try:
        co_data_collection = db['co_data']
        all_co_data = list(co_data_collection.find({}))
        for data in all_co_data:
            data['_id'] = str(data['_id'])
        return jsonify({"status": "success", "data": all_co_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Table Data Handling
collection = db["tableData"]

initial_data = [
    { "type": "Theory", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
    { "type": "Theory Integrated Lab", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
    { "type": "Lab", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
    { "type": "Project", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
    { "type": "EEC", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
    { "type": "NM", "L": "", "P": "", "C": "", "test1": "", "activity1": "", "test2": "", "activity2": "", "labInternals": "", "internals": "", "labEndsem": "", "theoryEndsem": "" },
]

@app.route("/getData", methods=["GET"])
def get_data():
    data = list(collection.find({}, {"_id": 0}))
    if not data:
        collection.insert_many(initial_data)
        data = initial_data
    return jsonify(data)

@app.route("/saveData", methods=["POST", "OPTIONS"])
def save_data():
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({"status": "success"}), 200
    new_data = request.json
    collection.delete_many({})
    collection.insert_many(new_data)
    return jsonify({"message": "Data saved successfully!"})

if __name__ == '__main__':
    app.run(debug=True)