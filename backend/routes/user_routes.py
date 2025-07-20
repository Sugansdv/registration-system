from flask import Blueprint, request, jsonify
from models import insert_user
import psycopg2

user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/api/register", methods=["POST"])
def register_user():
    data = request.json
    full_name = data.get("fullName")
    email = data.get("email")
    password = data.get("password")

    if not all([full_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        insert_user(full_name, email, password)
        return jsonify({"message": "User registered successfully"}), 201
    except psycopg2.errors.UniqueViolation:
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500
