#!/usr/bin/env python3
import os
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "pokebrowse-secret-key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)


class Pokemon(db.Model):
    __tablename__ = 'pokemon'
    
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, default=1)
    caught_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False)
    
    def to_dict(self):
        return {
            'id': self.pokemon_id,
            'name': self.name,
            'level': self.level,
            'caught_at': self.caught_at.isoformat() if self.caught_at else None,
            'is_favorite': self.is_favorite,
            'db_id': self.id
        }


class Companion(db.Model):
    __tablename__ = 'companion'
    
    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, default=1)
    health = db.Column(db.Integer, default=100)
    max_health = db.Column(db.Integer, default=100)
    experience = db.Column(db.Integer, default=0)
    experience_to_next = db.Column(db.Integer, default=100)
    happiness = db.Column(db.Integer, default=100)
    last_fed = db.Column(db.DateTime, default=datetime.utcnow)
    last_interaction = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.pokemon_id,
            'name': self.name,
            'level': self.level,
            'health': self.health,
            'maxHealth': self.max_health,
            'experience': self.experience,
            'experienceToNext': self.experience_to_next,
            'happiness': self.happiness,
            'lastFed': int(self.last_fed.timestamp() * 1000) if self.last_fed else None,
            'lastInteraction': int(self.last_interaction.timestamp() * 1000) if self.last_interaction else None
        }


with app.app_context():
    db.create_all()


@app.after_request
def add_no_cache_headers(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


@app.route('/')
def index():
    return send_from_directory('.', 'preview.html')


@app.route('/api/pokemon', methods=['GET'])
def get_pokemon_collection():
    pokemon_list = Pokemon.query.order_by(Pokemon.caught_at.desc()).all()
    return jsonify([p.to_dict() for p in pokemon_list])


@app.route('/api/pokemon', methods=['POST'])
def add_pokemon():
    data = request.json
    pokemon = Pokemon(
        pokemon_id=data.get('id'),
        name=data.get('name'),
        level=data.get('level', 1),
        is_favorite=data.get('is_favorite', False)
    )
    db.session.add(pokemon)
    db.session.commit()
    return jsonify(pokemon.to_dict()), 201


@app.route('/api/pokemon/<int:db_id>', methods=['DELETE'])
def delete_pokemon(db_id):
    pokemon = Pokemon.query.get_or_404(db_id)
    db.session.delete(pokemon)
    db.session.commit()
    return jsonify({'message': 'Pokemon released'}), 200


@app.route('/api/companion', methods=['GET'])
def get_companion():
    companion = Companion.query.first()
    if not companion:
        companion = Companion(
            pokemon_id=25,
            name='Pikachu',
            level=1,
            health=100,
            max_health=100,
            experience=0,
            experience_to_next=100,
            happiness=100
        )
        db.session.add(companion)
        db.session.commit()
    return jsonify(companion.to_dict())


@app.route('/api/companion', methods=['PUT'])
def update_companion():
    data = request.json
    companion = Companion.query.first()
    if not companion:
        companion = Companion(pokemon_id=25, name='Pikachu')
        db.session.add(companion)
    
    if 'level' in data:
        companion.level = data['level']
    if 'health' in data:
        companion.health = data['health']
    if 'maxHealth' in data:
        companion.max_health = data['maxHealth']
    if 'experience' in data:
        companion.experience = data['experience']
    if 'experienceToNext' in data:
        companion.experience_to_next = data['experienceToNext']
    if 'happiness' in data:
        companion.happiness = data['happiness']
    if 'lastFed' in data:
        companion.last_fed = datetime.fromtimestamp(data['lastFed'] / 1000)
    if 'lastInteraction' in data:
        companion.last_interaction = datetime.fromtimestamp(data['lastInteraction'] / 1000)
    
    db.session.commit()
    return jsonify(companion.to_dict())


@app.route('/api/seed', methods=['POST'])
def seed_pokemon():
    test_pokemon = [
        {'id': 1, 'name': 'Bulbasaur', 'level': 5},
        {'id': 4, 'name': 'Charmander', 'level': 7},
        {'id': 7, 'name': 'Squirtle', 'level': 6},
        {'id': 25, 'name': 'Pikachu', 'level': 10},
        {'id': 39, 'name': 'Jigglypuff', 'level': 8},
        {'id': 133, 'name': 'Eevee', 'level': 12},
    ]
    
    for p in test_pokemon:
        existing = Pokemon.query.filter_by(pokemon_id=p['id']).first()
        if not existing:
            pokemon = Pokemon(
                pokemon_id=p['id'],
                name=p['name'],
                level=p['level']
            )
            db.session.add(pokemon)
    
    db.session.commit()
    return jsonify({'message': 'Test Pokemon added', 'count': len(test_pokemon)})


if __name__ == '__main__':
    print("Starting PokeBrowse server on port 5000...")
    print("Open http://0.0.0.0:5000/preview.html to view the extension")
    app.run(host='0.0.0.0', port=5000, debug=True)
