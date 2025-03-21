from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from pymongo.errors import PyMongoError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        
        if not data or "username" not in data or "password" not in data:
            return jsonify({"error": "Username and password required"}), 400

        username = data["username"]
        password = generate_password_hash(data["password"])

        # Access MongoDB using current_app
        mongo = current_app.extensions["pymongo"].db

        # Check if user already exists
        if mongo.users.find_one({"username": username}):
            return jsonify({"error": "User already exists"}), 400

        # Insert user into MongoDB
        mongo.users.insert_one({"username": username, "password": password})
        
        return jsonify({"message": "User registered successfully"}), 201

    except PyMongoError as e:
        return jsonify({"error": f"MongoDB error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
