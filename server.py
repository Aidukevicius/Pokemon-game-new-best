#!/usr/bin/env python3
import os
import random
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET") or "pokebrowse-secret-key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") or "sqlite:///pokebrowse.db"
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

NATURES = [
    'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
    'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
    'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
    'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
    'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'
]

NATURE_MODIFIERS = {
    'Hardy': {'increase': None, 'decrease': None},
    'Lonely': {'increase': 'attack', 'decrease': 'defense'},
    'Brave': {'increase': 'attack', 'decrease': 'speed'},
    'Adamant': {'increase': 'attack', 'decrease': 'spAttack'},
    'Naughty': {'increase': 'attack', 'decrease': 'spDefense'},
    'Bold': {'increase': 'defense', 'decrease': 'attack'},
    'Docile': {'increase': None, 'decrease': None},
    'Relaxed': {'increase': 'defense', 'decrease': 'speed'},
    'Impish': {'increase': 'defense', 'decrease': 'spAttack'},
    'Lax': {'increase': 'defense', 'decrease': 'spDefense'},
    'Timid': {'increase': 'speed', 'decrease': 'attack'},
    'Hasty': {'increase': 'speed', 'decrease': 'defense'},
    'Serious': {'increase': None, 'decrease': None},
    'Jolly': {'increase': 'speed', 'decrease': 'spAttack'},
    'Naive': {'increase': 'speed', 'decrease': 'spDefense'},
    'Modest': {'increase': 'spAttack', 'decrease': 'attack'},
    'Mild': {'increase': 'spAttack', 'decrease': 'defense'},
    'Quiet': {'increase': 'spAttack', 'decrease': 'speed'},
    'Bashful': {'increase': None, 'decrease': None},
    'Rash': {'increase': 'spAttack', 'decrease': 'spDefense'},
    'Calm': {'increase': 'spDefense', 'decrease': 'attack'},
    'Gentle': {'increase': 'spDefense', 'decrease': 'defense'},
    'Sassy': {'increase': 'spDefense', 'decrease': 'speed'},
    'Careful': {'increase': 'spDefense', 'decrease': 'spAttack'},
    'Quirky': {'increase': None, 'decrease': None}
}

MAX_TOTAL_EVS = 510
MAX_SINGLE_EV = 252

def validate_and_clamp_evs(evs):
    """Validate EVs: max 252 per stat, max 510 total"""
    if not evs:
        return {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}
    
    stat_keys = ['hp', 'attack', 'defense', 'spAttack', 'spDefense', 'speed']
    clamped = {}
    total_used = 0
    
    for key in stat_keys:
        value = evs.get(key, 0)
        value = max(0, min(MAX_SINGLE_EV, value))
        
        if total_used + value > MAX_TOTAL_EVS:
            value = MAX_TOTAL_EVS - total_used
        
        clamped[key] = value
        total_used += value
    
    return clamped


class Pokemon(db.Model):
    __tablename__ = 'pokemon'

    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, default=1)
    caught_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False)
    nature = db.Column(db.String(20), default='Hardy')
    item = db.Column(db.String(100), nullable=True)
    hp_ev = db.Column(db.Integer, default=0)
    attack_ev = db.Column(db.Integer, default=0)
    defense_ev = db.Column(db.Integer, default=0)
    sp_attack_ev = db.Column(db.Integer, default=0)
    sp_defense_ev = db.Column(db.Integer, default=0)
    speed_ev = db.Column(db.Integer, default=0)
    hp_iv = db.Column(db.Integer, default=15)
    attack_iv = db.Column(db.Integer, default=15)
    defense_iv = db.Column(db.Integer, default=15)
    sp_attack_iv = db.Column(db.Integer, default=15)
    sp_defense_iv = db.Column(db.Integer, default=15)
    speed_iv = db.Column(db.Integer, default=15)

    def to_dict(self):
        return {
            'id': self.pokemon_id,
            'name': self.name,
            'level': self.level,
            'caught_at': self.caught_at.isoformat() if self.caught_at else None,
            'caughtAt': int(self.caught_at.timestamp() * 1000) if self.caught_at else None,
            'is_favorite': self.is_favorite,
            'db_id': self.id,
            'catchId': self.id,
            'nature': self.nature,
            'item': self.item,
            'evs': {
                'hp': self.hp_ev,
                'attack': self.attack_ev,
                'defense': self.defense_ev,
                'spAttack': self.sp_attack_ev,
                'spDefense': self.sp_defense_ev,
                'speed': self.speed_ev
            },
            'ivs': {
                'hp': self.hp_iv,
                'attack': self.attack_iv,
                'defense': self.defense_iv,
                'spAttack': self.sp_attack_iv,
                'spDefense': self.sp_defense_iv,
                'speed': self.speed_iv
            }
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
    nature = db.Column(db.String(20), default='Hardy')
    item = db.Column(db.String(100), nullable=True)
    hp_ev = db.Column(db.Integer, default=0)
    attack_ev = db.Column(db.Integer, default=0)
    defense_ev = db.Column(db.Integer, default=0)
    sp_attack_ev = db.Column(db.Integer, default=0)
    sp_defense_ev = db.Column(db.Integer, default=0)
    speed_ev = db.Column(db.Integer, default=0)
    hp_iv = db.Column(db.Integer, default=15)
    attack_iv = db.Column(db.Integer, default=15)
    defense_iv = db.Column(db.Integer, default=15)
    sp_attack_iv = db.Column(db.Integer, default=15)
    sp_defense_iv = db.Column(db.Integer, default=15)
    speed_iv = db.Column(db.Integer, default=15)

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
            'lastInteraction': int(self.last_interaction.timestamp() * 1000) if self.last_interaction else None,
            'nature': self.nature,
            'item': self.item,
            'evs': {
                'hp': self.hp_ev,
                'attack': self.attack_ev,
                'defense': self.defense_ev,
                'spAttack': self.sp_attack_ev,
                'spDefense': self.sp_defense_ev,
                'speed': self.speed_ev
            },
            'ivs': {
                'hp': self.hp_iv,
                'attack': self.attack_iv,
                'defense': self.defense_iv,
                'spAttack': self.sp_attack_iv,
                'spDefense': self.sp_defense_iv,
                'speed': self.speed_iv
            }
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


@app.route('/api/pokemon/<int:db_id>', methods=['GET'])
def get_pokemon_detail(db_id):
    pokemon = Pokemon.query.get_or_404(db_id)
    return jsonify(pokemon.to_dict())


@app.route('/api/pokemon', methods=['POST'])
def add_pokemon():
    current_count = Pokemon.query.count()
    if current_count >= 100:
        return jsonify({'error': 'Storage limit reached. Maximum 100 Pokemon allowed.'}), 400

    data = request.json
    nature = data.get('nature', random.choice(NATURES))
    
    raw_evs = data.get('evs', {})
    validated_evs = validate_and_clamp_evs(raw_evs)
    
    ivs = data.get('ivs', {})
    
    new_pokemon = Pokemon(
        pokemon_id=data['id'],
        name=data['name'],
        level=data.get('level', 1),
        caught_at=datetime.fromisoformat(data['caughtAt'].replace('Z', '+00:00')) if 'caughtAt' in data else datetime.now(),
        nature=nature,
        item=data.get('item'),
        hp_ev=validated_evs.get('hp', 0),
        attack_ev=validated_evs.get('attack', 0),
        defense_ev=validated_evs.get('defense', 0),
        sp_attack_ev=validated_evs.get('spAttack', 0),
        sp_defense_ev=validated_evs.get('spDefense', 0),
        speed_ev=validated_evs.get('speed', 0),
        hp_iv=ivs.get('hp', random.randint(0, 31)),
        attack_iv=ivs.get('attack', random.randint(0, 31)),
        defense_iv=ivs.get('defense', random.randint(0, 31)),
        sp_attack_iv=ivs.get('spAttack', random.randint(0, 31)),
        sp_defense_iv=ivs.get('spDefense', random.randint(0, 31)),
        speed_iv=ivs.get('speed', random.randint(0, 31))
    )
    db.session.add(new_pokemon)
    db.session.commit()
    return jsonify(new_pokemon.to_dict()), 201


@app.route('/api/pokemon/<int:db_id>', methods=['PUT'])
def update_pokemon(db_id):
    pokemon = Pokemon.query.get_or_404(db_id)
    data = request.json
    
    if 'item' in data:
        pokemon.item = data['item']
    if 'is_favorite' in data:
        pokemon.is_favorite = data['is_favorite']
    if 'evs' in data:
        current_evs = {
            'hp': pokemon.hp_ev,
            'attack': pokemon.attack_ev,
            'defense': pokemon.defense_ev,
            'spAttack': pokemon.sp_attack_ev,
            'spDefense': pokemon.sp_defense_ev,
            'speed': pokemon.speed_ev
        }
        current_evs.update(data['evs'])
        validated_evs = validate_and_clamp_evs(current_evs)
        
        pokemon.hp_ev = validated_evs['hp']
        pokemon.attack_ev = validated_evs['attack']
        pokemon.defense_ev = validated_evs['defense']
        pokemon.sp_attack_ev = validated_evs['spAttack']
        pokemon.sp_defense_ev = validated_evs['spDefense']
        pokemon.speed_ev = validated_evs['speed']
    
    db.session.commit()
    return jsonify(pokemon.to_dict())


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
            happiness=100,
            nature=random.choice(NATURES)
        )
        db.session.add(companion)
        db.session.commit()
    return jsonify(companion.to_dict())


@app.route('/api/companion', methods=['PUT'])
def update_companion():
    data = request.json
    companion = Companion.query.first()
    if not companion:
        companion = Companion(pokemon_id=25, name='Pikachu', nature=random.choice(NATURES))
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
    if 'item' in data:
        companion.item = data['item']
    if 'evs' in data:
        evs = data['evs']
        if 'hp' in evs:
            companion.hp_ev = evs['hp']
        if 'attack' in evs:
            companion.attack_ev = evs['attack']
        if 'defense' in evs:
            companion.defense_ev = evs['defense']
        if 'spAttack' in evs:
            companion.sp_attack_ev = evs['spAttack']
        if 'spDefense' in evs:
            companion.sp_defense_ev = evs['spDefense']
        if 'speed' in evs:
            companion.speed_ev = evs['speed']

    db.session.commit()
    return jsonify(companion.to_dict())


def generate_random_ivs():
    return {
        'hp': random.randint(0, 31),
        'attack': random.randint(0, 31),
        'defense': random.randint(0, 31),
        'spAttack': random.randint(0, 31),
        'spDefense': random.randint(0, 31),
        'speed': random.randint(0, 31)
    }

@app.route('/api/seed', methods=['POST'])
def seed_pokemon():
    test_pokemon = [
        {'id': 1, 'name': 'Bulbasaur', 'level': 15, 'nature': 'Modest', 'item': 'Miracle Seed', 'evs': {'hp': 20, 'spAttack': 45, 'spDefense': 30}},
        {'id': 4, 'name': 'Charmander', 'level': 18, 'nature': 'Adamant', 'item': 'Charcoal', 'evs': {'attack': 50, 'speed': 35}},
        {'id': 7, 'name': 'Squirtle', 'level': 16, 'nature': 'Bold', 'item': 'Mystic Water', 'evs': {'defense': 40, 'hp': 25}},
        {'id': 25, 'name': 'Pikachu', 'level': 22, 'nature': 'Jolly', 'item': 'Light Ball', 'evs': {'speed': 60, 'attack': 30}},
        {'id': 39, 'name': 'Jigglypuff', 'level': 14, 'nature': 'Calm', 'item': None, 'evs': {'hp': 55, 'spDefense': 20}},
        {'id': 133, 'name': 'Eevee', 'level': 20, 'nature': 'Timid', 'item': 'Everstone', 'evs': {'speed': 40, 'spAttack': 25}},
        {'id': 6, 'name': 'Charizard', 'level': 45, 'nature': 'Naive', 'item': 'Dragon Fang', 'evs': {'spAttack': 80, 'speed': 70, 'attack': 40}},
        {'id': 94, 'name': 'Gengar', 'level': 42, 'nature': 'Timid', 'item': 'Spell Tag', 'evs': {'spAttack': 90, 'speed': 65}},
        {'id': 149, 'name': 'Dragonite', 'level': 55, 'nature': 'Adamant', 'item': 'Dragon Scale', 'evs': {'attack': 100, 'hp': 50, 'speed': 30}},
        {'id': 150, 'name': 'Mewtwo', 'level': 70, 'nature': 'Modest', 'item': 'Twisted Spoon', 'evs': {'spAttack': 120, 'speed': 80, 'hp': 40}},
    ]

    Pokemon.query.delete()
    
    for p in test_pokemon:
        evs = p.get('evs', {})
        ivs = generate_random_ivs()
        pokemon = Pokemon(
            pokemon_id=p['id'],
            name=p['name'],
            level=p['level'],
            nature=p.get('nature', random.choice(NATURES)),
            item=p.get('item'),
            hp_ev=evs.get('hp', 0),
            attack_ev=evs.get('attack', 0),
            defense_ev=evs.get('defense', 0),
            sp_attack_ev=evs.get('spAttack', 0),
            sp_defense_ev=evs.get('spDefense', 0),
            speed_ev=evs.get('speed', 0),
            hp_iv=ivs['hp'],
            attack_iv=ivs['attack'],
            defense_iv=ivs['defense'],
            sp_attack_iv=ivs['spAttack'],
            sp_defense_iv=ivs['spDefense'],
            speed_iv=ivs['speed']
        )
        db.session.add(pokemon)

    db.session.commit()
    return jsonify({'message': 'Test Pokemon added with random IVs', 'count': len(test_pokemon)})


@app.route('/api/natures', methods=['GET'])
def get_natures():
    return jsonify({
        'natures': NATURES,
        'modifiers': NATURE_MODIFIERS
    })


if __name__ == '__main__':
    print("Starting PokeBrowse server on port 5000...")
    print("Open http://0.0.0.0:5000/preview.html to view the extension")
    app.run(host='0.0.0.0', port=5000, debug=True)
