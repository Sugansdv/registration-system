from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# Database configuration
DB_HOST = "dpg-d1u5q6er433s73ed5t00-a"
DB_NAME = "todoappdb_asqa"
DB_USER = "todoappdb_asqa_user"
DB_PASSWORD = "SeAqkvBn99TeEbkRzpm6HNKg1OGqOZ8r"
DB_PORT = 5432

# Connect to the PostgreSQL database
def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT
    )
    return conn

@app.route("/healthz", methods=["GET"])
def health_check():
    return "OK", 200

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, title, completed FROM tasks ORDER BY id;")
    tasks = cur.fetchall()
    cur.close()
    conn.close()
    task_list = [{"id": t[0], "title": t[1], "completed": t[2]} for t in tasks]
    return jsonify(task_list)

@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO tasks (title, completed) VALUES (%s, %s) RETURNING id;",
                (title, False))
    task_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": task_id, "title": title, "completed": False}), 201

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    completed = data.get("completed")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE tasks SET completed = %s WHERE id = %s;",
                (completed, task_id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"id": task_id, "completed": completed}), 200

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM tasks WHERE id = %s;", (task_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Task deleted"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
