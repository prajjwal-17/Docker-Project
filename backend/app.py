import time
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from models import db, Task, User
import jwt

app = Flask(__name__)
CORS(app)

# ------------------ Database Config ------------------
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:your_password@localhost:5432/cloud_task"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "supersecretkey"
app.config["JWT_EXP_DELTA_SECONDS"] = 3600  # token valid for 1 hour

db.init_app(app)

# ------------------ Metrics ------------------
REQ_COUNTER = Counter("task_api_requests_total", "Total requests", ["method", "endpoint", "status"])
REQ_LATENCY = Histogram("task_api_latency_seconds", "Request latency", ["method", "endpoint"])

@app.before_request
def start_timer():
    g.start_time = time.time()

@app.after_request
def record_metrics(response):
    method = request.method
    endpoint = request.path
    status = response.status_code
    duration = time.time() - getattr(g, "start_time", time.time())
    REQ_COUNTER.labels(method=method, endpoint=endpoint, status=str(status)).inc()
    REQ_LATENCY.labels(method=method, endpoint=endpoint).observe(duration)
    return response

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {"Content-Type": CONTENT_TYPE_LATEST}

# ------------------ Auth Routes ------------------

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "User already exists"}), 400

    u = User(username=data["username"])
    u.set_password(data["password"])
    db.session.add(u)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    u = User.query.filter_by(username=data["username"]).first()
    if not u or not u.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "user_id": u.id,
        "username": u.username,
        "exp": datetime.utcnow() + timedelta(seconds=app.config["JWT_EXP_DELTA_SECONDS"])
    }
    token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
    return jsonify({"token": token})

def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.split(" ")[-1]  # Bearer <token>
    try:
        payload = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
        return User.query.get(payload["user_id"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# ------------------ Task CRUD ------------------

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    tasks = Task.query.filter_by(user_id=user.id).order_by(Task.created_at.desc()).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "status": t.status,
        "is_finished": t.is_finished,
        "is_expired": t.is_expired,
        "created_at": t.created_at.isoformat(),
        "finished_at": t.finished_at.isoformat() if t.finished_at else None,
        "deadline": t.deadline.isoformat() if t.deadline else None
    } for t in tasks])

@app.route("/api/tasks", methods=["POST"])
def create_task():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    deadline = datetime.fromisoformat(data["deadline"]) if data.get("deadline") else None
    t = Task(
        title=data["title"],
        description=data.get("description", ""),
        status="todo",
        is_finished=False,
        deadline=deadline,
        user_id=user.id
    )
    db.session.add(t)
    db.session.commit()
    return jsonify({"id": t.id}), 201

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    t = Task.query.filter_by(id=task_id, user_id=user.id).first_or_404()

    t.title = data.get("title", t.title)
    t.description = data.get("description", t.description)
    t.status = data.get("status", t.status)
    if "deadline" in data:
        t.deadline = datetime.fromisoformat(data["deadline"]) if data["deadline"] else None

    if t.status == "done" and not t.is_finished:
        t.is_finished = True
        t.finished_at = datetime.utcnow()
    elif t.status != "done":
        t.is_finished = False
        t.finished_at = None

    db.session.commit()
    return jsonify({"ok": True})

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    t = Task.query.filter_by(id=task_id, user_id=user.id).first_or_404()
    db.session.delete(t)
    db.session.commit()
    return jsonify({"ok": True})

# ------------------ Main ------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
