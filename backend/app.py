from flask import Flask
from flask_cors import CORS
from models import create_user_table
from routes.user_routes import user_bp

app = Flask(__name__)
CORS(app, origins=["https://687c74e6b820d0a04cb22ceb--registrationapp25.netlify.app"])

create_user_table()
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run()
