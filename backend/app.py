from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, bcrypt, jwt
from models import User, DefaultWardrobe, PersonalWardrobe
from routes.auth import auth_bp
from routes.wardrobe import wardrobe_bp
from routes.recommendation import recommendation_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)
jwt.init_app(app)

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(wardrobe_bp, url_prefix='/api/wardrobe')
app.register_blueprint(
    recommendation_bp,
    url_prefix='/api/recommendation'
)

@app.route('/')
def index():
    return {'message': 'Outfit Recommender API is running!'}

if __name__ == '__main__':
    app.run(debug=True)