import time
from datetime import datetime
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from models import db, Task

app = Flask(__name__)
CORS(app)

# Use SQLite database (file-based, no setup needed)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///tasks.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# Prometheus metrics
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

# -------------------- CRUD ENDPOINTS --------------------

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "status": t.status,
        "is_finished": t.is_finished,
        "created_at": t.created_at.isoformat(),
        "finished_at": t.finished_at.isoformat() if t.finished_at else None
    } for t in tasks])

@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json
    t = Task(
        title=data["title"],
        description=data.get("description", ""),
        status="todo",
        is_finished=False,
        finished_at=None
    )
    db.session.add(t)
    db.session.commit()
    return jsonify({"id": t.id}), 201

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    t = Task.query.get_or_404(task_id)

    t.title = data.get("title", t.title)
    t.description = data.get("description", t.description)
    t.status = data.get("status", t.status)

    # Update finished status & finished_at timestamp
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
    t = Task.query.get_or_404(task_id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({"ok": True})

# -------------------- MAIN --------------------
if __name__ == "__main__":
    with app.app_context():
        # Force recreate tables if schema changed
        db.create_all()
    app.run(debug=True, port=5000)