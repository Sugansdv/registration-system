from flask import Flask
from flask_cors import CORS
from models import create_user_table
from routes.user_routes import user_bp

app = Flask(__name__)

# ✅ Update this to your actual Netlify deployed URL
NETLIFY_URL = "https://your-netlify-site.netlify.app"

# Allow only requests from your frontend
CORS(app, origins=[NETLIFY_URL])

# Create DB table if not exists
create_user_table()

# Register API routes
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(debug=True)
