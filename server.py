#!/usr/bin/env python3
import os
import random
import requests
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

BATTLE_CALC_URL = os.environ.get('BATTLE_CALC_URL', 'http://localhost:3001')

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET")
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
    in_party = db.Column(db.Boolean, default=False)
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
            'in_party': self.in_party,
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


POKEMON_ITEMS = {
    'poke-ball': {
        'name': 'Poke Ball',
        'description': 'A basic ball for catching Pokemon. 1x catch rate.',
        'category': 'pokeball',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
    },
    'great-ball': {
        'name': 'Great Ball',
        'description': 'A better ball with higher catch rate. 1.5x catch rate.',
        'category': 'pokeball',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png'
    },
    'ultra-ball': {
        'name': 'Ultra Ball',
        'description': 'A high-performance ball. 2x catch rate.',
        'category': 'pokeball',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png'
    },
    'master-ball': {
        'name': 'Master Ball',
        'description': 'The ultimate ball. Never fails to catch.',
        'category': 'pokeball',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
    },
    'leftovers': {
        'name': 'Leftovers',
        'description': 'Restores HP gradually during battle.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leftovers.png'
    },
    'choice-band': {
        'name': 'Choice Band',
        'description': 'Boosts Attack but locks into one move.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-band.png'
    },
    'choice-specs': {
        'name': 'Choice Specs',
        'description': 'Boosts Sp. Atk but locks into one move.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-specs.png'
    },
    'choice-scarf': {
        'name': 'Choice Scarf',
        'description': 'Boosts Speed but locks into one move.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/choice-scarf.png'
    },
    'life-orb': {
        'name': 'Life Orb',
        'description': 'Boosts damage by 30% but costs HP.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/life-orb.png'
    },
    'focus-sash': {
        'name': 'Focus Sash',
        'description': 'Survives one-hit KO with 1 HP.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/focus-sash.png'
    },
    'rocky-helmet': {
        'name': 'Rocky Helmet',
        'description': 'Damages attacker on contact.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rocky-helmet.png'
    },
    'assault-vest': {
        'name': 'Assault Vest',
        'description': 'Boosts Sp. Def but prevents status moves.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/assault-vest.png'
    },
    'eviolite': {
        'name': 'Eviolite',
        'description': 'Boosts Def and Sp. Def of unevolved Pokemon.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/eviolite.png'
    },
    'black-sludge': {
        'name': 'Black Sludge',
        'description': 'Restores HP for Poison types.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/black-sludge.png'
    },
    'sitrus-berry': {
        'name': 'Sitrus Berry',
        'description': 'Restores 25% HP when below 50%.',
        'category': 'berry',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sitrus-berry.png'
    },
    'lum-berry': {
        'name': 'Lum Berry',
        'description': 'Cures any status condition.',
        'category': 'berry',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lum-berry.png'
    },
    'oran-berry': {
        'name': 'Oran Berry',
        'description': 'Restores 10 HP when below 50%.',
        'category': 'berry',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png'
    },
    'exp-share': {
        'name': 'Exp. Share',
        'description': 'Shares experience with holder.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png'
    },
    'lucky-egg': {
        'name': 'Lucky Egg',
        'description': 'Boosts experience gained.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/lucky-egg.png'
    },
    'soothe-bell': {
        'name': 'Soothe Bell',
        'description': 'Increases happiness gained.',
        'category': 'hold',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/soothe-bell.png'
    },
    'macho-brace': {
        'name': 'Macho Brace',
        'description': 'Doubles EVs gained but halves Speed.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/macho-brace.png'
    },
    'power-bracer': {
        'name': 'Power Bracer',
        'description': '+8 Attack EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-bracer.png'
    },
    'power-belt': {
        'name': 'Power Belt',
        'description': '+8 Defense EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-belt.png'
    },
    'power-lens': {
        'name': 'Power Lens',
        'description': '+8 Sp. Atk EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-lens.png'
    },
    'power-band': {
        'name': 'Power Band',
        'description': '+8 Sp. Def EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-band.png'
    },
    'power-anklet': {
        'name': 'Power Anklet',
        'description': '+8 Speed EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-anklet.png'
    },
    'power-weight': {
        'name': 'Power Weight',
        'description': '+8 HP EVs per battle.',
        'category': 'training',
        'sprite': 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/power-weight.png'
    }
}


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    def to_dict(self):
        item_data = POKEMON_ITEMS.get(self.item_id, {})
        return {
            'id': self.id,
            'itemId': self.item_id,
            'name': item_data.get('name', self.item_id),
            'description': item_data.get('description', ''),
            'category': item_data.get('category', 'hold'),
            'sprite': item_data.get('sprite', ''),
            'quantity': self.quantity
        }


class PokedexEntry(db.Model):
    __tablename__ = 'pokedex_entries'

    id = db.Column(db.Integer, primary_key=True)
    pokemon_id = db.Column(db.Integer, nullable=False, unique=True)
    encountered = db.Column(db.Boolean, default=False)
    caught = db.Column(db.Boolean, default=False)
    times_encountered = db.Column(db.Integer, default=0)
    times_caught = db.Column(db.Integer, default=0)
    first_encountered_at = db.Column(db.DateTime, nullable=True)
    first_caught_at = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'pokemonId': self.pokemon_id,
            'encountered': self.encountered,
            'caught': self.caught,
            'timesEncountered': self.times_encountered,
            'timesCaught': self.times_caught,
            'firstEncounteredAt': self.first_encountered_at.isoformat() if self.first_encountered_at else None,
            'firstCaughtAt': self.first_caught_at.isoformat() if self.first_caught_at else None
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


@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    favorite_pokemon = Pokemon.query.filter_by(is_favorite=True).order_by(Pokemon.level.desc()).limit(6).all()
    
    if len(favorite_pokemon) == 0:
        top_pokemon = Pokemon.query.order_by(Pokemon.level.desc()).limit(6).all()
        return jsonify([p.to_dict() for p in top_pokemon])
    
    return jsonify([p.to_dict() for p in favorite_pokemon])


@app.route('/api/party', methods=['GET'])
def get_party():
    party_pokemon = Pokemon.query.filter_by(in_party=True).order_by(Pokemon.level.desc()).limit(6).all()
    
    if len(party_pokemon) == 0:
        top_level = Pokemon.query.order_by(Pokemon.level.desc()).limit(6).all()
        return jsonify({
            'party': [p.to_dict() for p in top_level],
            'auto_selected': True,
            'party_db_ids': [p.id for p in top_level]
        })
    
    return jsonify({
        'party': [p.to_dict() for p in party_pokemon],
        'auto_selected': False,
        'party_db_ids': [p.id for p in party_pokemon]
    })


@app.route('/api/pokemon/<int:db_id>/party', methods=['POST'])
def toggle_party(db_id):
    pokemon = Pokemon.query.get_or_404(db_id)
    
    if pokemon.in_party:
        pokemon.in_party = False
        db.session.commit()
        return jsonify({'in_party': False, 'message': 'Removed from party', 'pokemon': pokemon.to_dict()})
    
    current_party_count = Pokemon.query.filter_by(in_party=True).count()
    if current_party_count >= 6:
        return jsonify({'error': 'Party is full. Remove a Pokemon first.'}), 400
    
    pokemon.in_party = True
    db.session.commit()
    return jsonify({'in_party': True, 'message': 'Added to party', 'pokemon': pokemon.to_dict()})


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
    companion = Companion.query.first()
    data = request.json

    # If pokemon_id is provided, replace the entire companion
    if 'pokemon_id' in data:
        if companion:
            db.session.delete(companion)

        evs = data.get('evs', {})
        ivs = data.get('ivs', {})

        companion = Companion(
            pokemon_id=data['pokemon_id'],
            name=data.get('name', 'Unknown'),
            level=data.get('level', 1),
            health=data.get('health', 100),
            max_health=data.get('max_health', 100),
            experience=data.get('experience', 0),
            experience_to_next=data.get('experience_to_next', 100),
            happiness=data.get('happiness', 100),
            nature=data.get('nature', 'Hardy'),
            item=data.get('item'),
            hp_ev=evs.get('hp', 0),
            attack_ev=evs.get('attack', 0),
            defense_ev=evs.get('defense', 0),
            sp_attack_ev=evs.get('spAttack', 0),
            sp_defense_ev=evs.get('spDefense', 0),
            speed_ev=evs.get('speed', 0),
            hp_iv=ivs.get('hp', 15),
            attack_iv=ivs.get('attack', 15),
            defense_iv=ivs.get('defense', 15),
            sp_attack_iv=ivs.get('spAttack', 15),
            sp_defense_iv=ivs.get('spDefense', 15),
            speed_iv=ivs.get('speed', 15)
        )
        db.session.add(companion)
    else:
        # Update existing companion fields
        if not companion:
            return jsonify({'error': 'No companion found'}), 404

        if 'health' in data:
            companion.health = data['health']
        if 'max_health' in data:
            companion.max_health = data['max_health']
        if 'experience' in data:
            companion.experience = data['experience']
        if 'level' in data:
            companion.level = data['level']
        if 'happiness' in data:
            companion.happiness = data['happiness']
        if 'last_fed' in data:
            companion.last_fed = datetime.fromisoformat(data['last_fed'].replace('Z', '+00:00'))
        if 'last_interaction' in data:
            companion.last_interaction = datetime.fromisoformat(data['last_interaction'].replace('Z', '+00:00'))
        
        # Handle EV updates
        if 'evs' in data:
            evs = data['evs']
            if 'hp' in evs:
                companion.hp_ev = min(252, max(0, evs['hp']))
            if 'attack' in evs:
                companion.attack_ev = min(252, max(0, evs['attack']))
            if 'defense' in evs:
                companion.defense_ev = min(252, max(0, evs['defense']))
            if 'spAttack' in evs:
                companion.sp_attack_ev = min(252, max(0, evs['spAttack']))
            if 'spDefense' in evs:
                companion.sp_defense_ev = min(252, max(0, evs['spDefense']))
            if 'speed' in evs:
                companion.speed_ev = min(252, max(0, evs['speed']))
            
            # Validate total EVs don't exceed 510
            total_evs = (companion.hp_ev + companion.attack_ev + companion.defense_ev + 
                        companion.sp_attack_ev + companion.sp_defense_ev + companion.speed_ev)
            if total_evs > 510:
                # Scale down proportionally
                scale = 510 / total_evs
                companion.hp_ev = int(companion.hp_ev * scale)
                companion.attack_ev = int(companion.attack_ev * scale)
                companion.defense_ev = int(companion.defense_ev * scale)
                companion.sp_attack_ev = int(companion.sp_attack_ev * scale)
                companion.sp_defense_ev = int(companion.sp_defense_ev * scale)
                companion.speed_ev = int(companion.speed_ev * scale)

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


@app.route('/api/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items])


@app.route('/api/items/catalog', methods=['GET'])
def get_item_catalog():
    catalog = []
    for item_id, item_data in POKEMON_ITEMS.items():
        catalog.append({
            'itemId': item_id,
            'name': item_data['name'],
            'description': item_data['description'],
            'category': item_data['category'],
            'sprite': item_data['sprite']
        })
    return jsonify(catalog)


@app.route('/api/items', methods=['POST'])
def add_item():
    data = request.json
    item_id = data.get('itemId')
    quantity = data.get('quantity', 1)

    if item_id not in POKEMON_ITEMS:
        return jsonify({'error': 'Invalid item'}), 400

    existing = Item.query.filter_by(item_id=item_id).first()
    if existing:
        existing.quantity += quantity
    else:
        new_item = Item(item_id=item_id, quantity=quantity)
        db.session.add(new_item)

    db.session.commit()
    return jsonify({'message': f'Added {quantity}x {POKEMON_ITEMS[item_id]["name"]}'})


@app.route('/api/items/<item_id>', methods=['PUT'])
def update_item_quantity(item_id):
    data = request.json
    item = Item.query.filter_by(item_id=item_id).first()

    if not item:
        return jsonify({'error': 'Item not found'}), 404

    if 'quantity' in data:
        item.quantity = max(0, data['quantity'])
        if item.quantity == 0:
            db.session.delete(item)

    db.session.commit()
    return jsonify(item.to_dict() if item.quantity > 0 else {'deleted': True})


@app.route('/api/pokemon/<int:db_id>/equip', methods=['POST'])
def equip_item_to_pokemon(db_id):
    pokemon = Pokemon.query.get_or_404(db_id)
    data = request.json
    item_id = data.get('itemId')

    if item_id:
        if item_id not in POKEMON_ITEMS:
            return jsonify({'error': 'Invalid item'}), 400

        inventory_item = Item.query.filter_by(item_id=item_id).first()
        if not inventory_item or inventory_item.quantity < 1:
            return jsonify({'error': 'Item not in inventory'}), 400

        if pokemon.item:
            old_item_id = None
            for key, val in POKEMON_ITEMS.items():
                if val['name'] == pokemon.item:
                    old_item_id = key
                    break
            if old_item_id:
                old_inventory = Item.query.filter_by(item_id=old_item_id).first()
                if old_inventory:
                    old_inventory.quantity += 1
                else:
                    db.session.add(Item(item_id=old_item_id, quantity=1))

        inventory_item.quantity -= 1
        if inventory_item.quantity <= 0:
            db.session.delete(inventory_item)

        pokemon.item = POKEMON_ITEMS[item_id]['name']
    else:
        if pokemon.item:
            old_item_id = None
            for key, val in POKEMON_ITEMS.items():
                if val['name'] == pokemon.item:
                    old_item_id = key
                    break
            if old_item_id:
                old_inventory = Item.query.filter_by(item_id=old_item_id).first()
                if old_inventory:
                    old_inventory.quantity += 1
                else:
                    db.session.add(Item(item_id=old_item_id, quantity=1))
        pokemon.item = None

    db.session.commit()
    return jsonify(pokemon.to_dict())


@app.route('/api/items/seed', methods=['POST'])
def seed_items():
    Item.query.delete()

    starter_items = [
        ('poke-ball', 50),
        ('great-ball', 30),
        ('ultra-ball', 15),
        ('master-ball', 5),
        ('leftovers', 2),
        ('choice-band', 1),
        ('choice-specs', 1),
        ('choice-scarf', 1),
        ('life-orb', 2),
        ('focus-sash', 3),
        ('sitrus-berry', 5),
        ('lum-berry', 3),
        ('oran-berry', 8),
        ('lucky-egg', 1),
        ('soothe-bell', 1),
        ('exp-share', 1),
        ('power-bracer', 1),
        ('power-lens', 1),
    ]

    for item_id, qty in starter_items:
        db.session.add(Item(item_id=item_id, quantity=qty))

    db.session.commit()
    return jsonify({'message': 'Items seeded', 'count': len(starter_items)})


@app.route('/api/pokedex', methods=['GET'])
def get_pokedex():
    entries = PokedexEntry.query.all()
    entries_dict = {e.pokemon_id: e.to_dict() for e in entries}
    return jsonify(entries_dict)


@app.route('/api/pokedex/encounter', methods=['POST'])
def record_encounter():
    data = request.json
    pokemon_id = data.get('pokemonId')
    
    if not pokemon_id or pokemon_id < 1 or pokemon_id > 151:
        return jsonify({'error': 'Invalid Pokemon ID'}), 400
    
    entry = PokedexEntry.query.filter_by(pokemon_id=pokemon_id).first()
    
    if not entry:
        entry = PokedexEntry(
            pokemon_id=pokemon_id,
            encountered=True,
            times_encountered=1,
            first_encountered_at=datetime.utcnow()
        )
        db.session.add(entry)
    else:
        entry.encountered = True
        entry.times_encountered += 1
        if not entry.first_encountered_at:
            entry.first_encountered_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(entry.to_dict())


@app.route('/api/pokedex/catch', methods=['POST'])
def record_catch():
    data = request.json
    pokemon_id = data.get('pokemonId')
    
    if not pokemon_id or pokemon_id < 1 or pokemon_id > 151:
        return jsonify({'error': 'Invalid Pokemon ID'}), 400
    
    entry = PokedexEntry.query.filter_by(pokemon_id=pokemon_id).first()
    
    if not entry:
        entry = PokedexEntry(
            pokemon_id=pokemon_id,
            encountered=True,
            caught=True,
            times_encountered=1,
            times_caught=1,
            first_encountered_at=datetime.utcnow(),
            first_caught_at=datetime.utcnow()
        )
        db.session.add(entry)
    else:
        entry.caught = True
        entry.times_caught += 1
        if not entry.first_caught_at:
            entry.first_caught_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(entry.to_dict())


@app.route('/api/pokedex/stats', methods=['GET'])
def get_pokedex_stats():
    total = 151
    encountered = PokedexEntry.query.filter_by(encountered=True).count()
    caught = PokedexEntry.query.filter_by(caught=True).count()
    
    return jsonify({
        'total': total,
        'encountered': encountered,
        'caught': caught,
        'encounterPercent': round((encountered / total) * 100, 1),
        'catchPercent': round((caught / total) * 100, 1)
    })


@app.route('/api/battle/calculate-damage', methods=['POST'])
def calculate_damage():
    try:
        response = requests.post(f'{BATTLE_CALC_URL}/api/calculate-damage', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': f'Battle calculator unavailable: {str(e)}'}), 503


@app.route('/api/battle/calculate-stats', methods=['POST'])
def calculate_stats():
    try:
        response = requests.post(f'{BATTLE_CALC_URL}/api/calculate-stats', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': f'Battle calculator unavailable: {str(e)}'}), 503


@app.route('/api/battle/move-info', methods=['POST'])
def get_move_info():
    try:
        response = requests.post(f'{BATTLE_CALC_URL}/api/get-move-info', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': f'Battle calculator unavailable: {str(e)}'}), 503


@app.route('/api/battle/type-effectiveness', methods=['POST'])
def get_type_effectiveness():
    try:
        response = requests.post(f'{BATTLE_CALC_URL}/api/type-effectiveness', json=request.json, timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': f'Battle calculator unavailable: {str(e)}'}), 503


@app.route('/api/battle/health', methods=['GET'])
def battle_health():
    try:
        response = requests.get(f'{BATTLE_CALC_URL}/api/health', timeout=5)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'success': False, 'error': f'Battle calculator unavailable: {str(e)}'}), 503


POKEMON_BASE_STATS = {
    25: {'name': 'Pikachu', 'types': ['Electric'], 'hp': 35, 'attack': 55, 'defense': 40, 'spAttack': 50, 'spDefense': 50, 'speed': 90, 'catchRate': 190},
    7: {'name': 'Squirtle', 'types': ['Water'], 'hp': 44, 'attack': 48, 'defense': 65, 'spAttack': 50, 'spDefense': 64, 'speed': 43, 'catchRate': 45},
    1: {'name': 'Bulbasaur', 'types': ['Grass', 'Poison'], 'hp': 45, 'attack': 49, 'defense': 49, 'spAttack': 65, 'spDefense': 65, 'speed': 45, 'catchRate': 45},
    27: {'name': 'Sandshrew', 'types': ['Ground'], 'hp': 50, 'attack': 75, 'defense': 85, 'spAttack': 20, 'spDefense': 30, 'speed': 40, 'catchRate': 255},
    135: {'name': 'Jolteon', 'types': ['Electric'], 'hp': 65, 'attack': 65, 'defense': 60, 'spAttack': 110, 'spDefense': 95, 'speed': 130, 'catchRate': 45},
    143: {'name': 'Snorlax', 'types': ['Normal'], 'hp': 160, 'attack': 110, 'defense': 65, 'spAttack': 65, 'spDefense': 110, 'speed': 30, 'catchRate': 25},
}

def calculate_stat(base, iv, ev, level, nature_mod=1.0):
    return int(((2 * base + iv + ev // 4) * level // 100 + 5) * nature_mod)

def calculate_hp(base, iv, ev, level):
    return int((2 * base + iv + ev // 4) * level // 100 + level + 10)

def get_nature_mod(nature, stat):
    mods = NATURE_MODIFIERS.get(nature, {'increase': None, 'decrease': None})
    if mods['increase'] == stat:
        return 1.1
    elif mods['decrease'] == stat:
        return 0.9
    return 1.0

def create_pokemon_for_test(pokemon_id, level, evs, ivs, nature):
    base = POKEMON_BASE_STATS.get(pokemon_id, POKEMON_BASE_STATS[25])
    stats = {
        'hp': calculate_hp(base['hp'], ivs['hp'], evs['hp'], level),
        'attack': calculate_stat(base['attack'], ivs['attack'], evs['attack'], level, get_nature_mod(nature, 'attack')),
        'defense': calculate_stat(base['defense'], ivs['defense'], evs['defense'], level, get_nature_mod(nature, 'defense')),
        'spAttack': calculate_stat(base['spAttack'], ivs['spAttack'], evs['spAttack'], level, get_nature_mod(nature, 'spAttack')),
        'spDefense': calculate_stat(base['spDefense'], ivs['spDefense'], evs['spDefense'], level, get_nature_mod(nature, 'spDefense')),
        'speed': calculate_stat(base['speed'], ivs['speed'], evs['speed'], level, get_nature_mod(nature, 'speed'))
    }
    return {
        'id': pokemon_id,
        'name': base['name'],
        'types': base['types'],
        'level': level,
        'evs': evs,
        'ivs': ivs,
        'nature': nature,
        'stats': stats,
        'baseStats': {'hp': base['hp'], 'attack': base['attack'], 'defense': base['defense'], 
                      'spAttack': base['spAttack'], 'spDefense': base['spDefense'], 'speed': base['speed']},
        'catchRate': base['catchRate']
    }

TEST_BATTLE_CONFIGS = {
    'ev_comparison': {
        'description': 'EV Comparison - Pikachu with 252 Atk/Spe EVs vs No EVs',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 252, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 252}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'ev_hp_defense': {
        'description': 'Defensive EVs - Pikachu with 252 HP/Def EVs vs No EVs',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 252, 'attack': 0, 'defense': 252, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'ev_special': {
        'description': 'Special Attack EVs - Pikachu with 252 SpAtk EVs vs No EVs',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 252, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'iv_comparison': {
        'description': 'IV Comparison - Pikachu with Perfect 31 IVs vs 0 IVs',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 'nature': 'Hardy'}
    },
    'iv_speed': {
        'description': 'Speed IV Test - Pikachu with 31 Speed IV vs 0 Speed IV',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 15, 'attack': 15, 'defense': 15, 'spAttack': 15, 'spDefense': 15, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 15, 'attack': 15, 'defense': 15, 'spAttack': 15, 'spDefense': 15, 'speed': 0}, 'nature': 'Hardy'}
    },
    'nature_attack': {
        'description': 'Adamant vs Modest - Physical vs Special nature',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Adamant'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Modest'}
    },
    'nature_speed': {
        'description': 'Jolly vs Brave - Speed nature difference',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Jolly'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Brave'}
    },
    'level_difference': {
        'description': 'Level Gap - Lv100 vs Lv50 Pikachu',
        'companion': {'pokemon_id': 25, 'level': 100, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'level_low': {
        'description': 'Low Level Battle - Two Lv5 Pikachu',
        'companion': {'pokemon_id': 25, 'level': 5, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 15, 'attack': 15, 'defense': 15, 'spAttack': 15, 'spDefense': 15, 'speed': 15}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 5, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 15, 'attack': 15, 'defense': 15, 'spAttack': 15, 'spDefense': 15, 'speed': 15}, 'nature': 'Hardy'}
    },
    'type_super_effective': {
        'description': 'Super Effective - Pikachu vs Squirtle',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 7, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'type_not_effective': {
        'description': 'Not Very Effective - Pikachu vs Bulbasaur',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 1, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'type_immune': {
        'description': 'Immune Type - Pikachu vs Sandshrew',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 27, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'speed_equal': {
        'description': 'Equal Speed - Two identical Pikachu',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'speed_faster': {
        'description': 'Faster Pokemon - Jolteon vs Pikachu',
        'companion': {'pokemon_id': 135, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'speed_slower': {
        'description': 'Slower Pokemon - Snorlax vs Pikachu',
        'companion': {'pokemon_id': 143, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Hardy'}
    },
    'fully_trained': {
        'description': 'Fully Trained - Lv100 max EVs vs untrained',
        'companion': {'pokemon_id': 25, 'level': 100, 'evs': {'hp': 0, 'attack': 252, 'defense': 0, 'spAttack': 4, 'spDefense': 0, 'speed': 252}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Jolly'},
        'enemy': {'pokemon_id': 25, 'level': 100, 'evs': {'hp': 0, 'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0}, 
                  'ivs': {'hp': 15, 'attack': 15, 'defense': 15, 'spAttack': 15, 'spDefense': 15, 'speed': 15}, 'nature': 'Hardy'}
    },
    'tank_vs_sweeper': {
        'description': 'Tank vs Sweeper - Defensive vs Offensive build',
        'companion': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 252, 'attack': 0, 'defense': 128, 'spAttack': 0, 'spDefense': 128, 'speed': 0}, 
                      'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Bold'},
        'enemy': {'pokemon_id': 25, 'level': 50, 'evs': {'hp': 0, 'attack': 252, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 252}, 
                  'ivs': {'hp': 31, 'attack': 31, 'defense': 31, 'spAttack': 31, 'spDefense': 31, 'speed': 31}, 'nature': 'Jolly'}
    }
}

@app.route('/api/test-battle', methods=['POST'])
def start_test_battle():
    try:
        data = request.get_json()
        test_type = data.get('testType')
        
        if test_type not in TEST_BATTLE_CONFIGS:
            return jsonify({'success': False, 'error': f'Unknown test type: {test_type}'}), 400
        
        config = TEST_BATTLE_CONFIGS[test_type]
        
        companion_cfg = config['companion']
        companion = create_pokemon_for_test(
            companion_cfg['pokemon_id'], 
            companion_cfg['level'], 
            companion_cfg['evs'], 
            companion_cfg['ivs'], 
            companion_cfg['nature']
        )
        companion['health'] = companion['stats']['hp']
        
        enemy_cfg = config['enemy']
        enemy = create_pokemon_for_test(
            enemy_cfg['pokemon_id'], 
            enemy_cfg['level'], 
            enemy_cfg['evs'], 
            enemy_cfg['ivs'], 
            enemy_cfg['nature']
        )
        
        encounter = {
            'pokemon': {
                'id': enemy['id'],
                'name': enemy['name'],
                'types': enemy['types'],
                'baseStats': enemy['baseStats'],
                'catchRate': enemy['catchRate'],
                'rarity': 'test'
            },
            'level': enemy['level'],
            'ivs': enemy['ivs'],
            'evs': enemy['evs'],
            'nature': enemy['nature'],
            'stats': enemy['stats'],
            'currentHp': enemy['stats']['hp'],
            'maxHp': enemy['stats']['hp'],
            'status': None,
            'isTest': True,
            'testDescription': config['description'],
            'timestamp': int(datetime.utcnow().timestamp() * 1000)
        }
        
        companion['health'] = companion['stats']['hp']
        companion['maxHealth'] = companion['stats']['hp']
        companion['experience'] = 0
        companion['experienceToNext'] = 100
        
        return jsonify({
            'success': True,
            'companion': companion,
            'encounter': encounter,
            'description': config['description']
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


DEFAULT_ABILITY = 'Static'

def simulate_battle(companion, enemy):
    """Simulate a full battle between companion and enemy, return winner info."""
    companion_hp = companion['stats']['hp']
    enemy_hp = enemy['stats']['hp']
    
    companion_speed = companion['stats']['speed']
    enemy_speed = enemy['stats']['speed']
    
    companion_atk = max(companion['stats']['attack'], companion['stats']['spAttack'])
    enemy_atk = max(enemy['stats']['attack'], enemy['stats']['spAttack'])
    companion_def = (companion['stats']['defense'] + companion['stats']['spDefense']) // 2
    enemy_def = (enemy['stats']['defense'] + enemy['stats']['spDefense']) // 2
    
    turn = 0
    max_turns = 100
    
    while companion_hp > 0 and enemy_hp > 0 and turn < max_turns:
        turn += 1
        
        if companion_speed >= enemy_speed:
            first_attacker = 'companion'
        else:
            first_attacker = 'enemy'
        
        if first_attacker == 'companion':
            damage = max(1, (companion_atk * companion['level'] // 50) - (enemy_def // 4) + random.randint(1, 10))
            enemy_hp -= damage
            if enemy_hp <= 0:
                break
            damage = max(1, (enemy_atk * enemy['level'] // 50) - (companion_def // 4) + random.randint(1, 10))
            companion_hp -= damage
        else:
            damage = max(1, (enemy_atk * enemy['level'] // 50) - (companion_def // 4) + random.randint(1, 10))
            companion_hp -= damage
            if companion_hp <= 0:
                break
            damage = max(1, (companion_atk * companion['level'] // 50) - (enemy_def // 4) + random.randint(1, 10))
            enemy_hp -= damage
    
    if companion_hp > 0 and enemy_hp <= 0:
        winner = 'companion'
        winner_name = companion['name']
    elif enemy_hp > 0 and companion_hp <= 0:
        winner = 'enemy'
        winner_name = enemy['name']
    elif companion_hp > enemy_hp:
        winner = 'companion'
        winner_name = companion['name']
    elif enemy_hp > companion_hp:
        winner = 'enemy'
        winner_name = enemy['name']
    else:
        winner = 'tie'
        winner_name = 'Tie'
    
    return {
        'winner': winner,
        'winnerName': winner_name,
        'turns': turn,
        'companionHpRemaining': max(0, companion_hp),
        'enemyHpRemaining': max(0, enemy_hp)
    }

def run_single_battle_simulation(test_type, ability):
    config = TEST_BATTLE_CONFIGS[test_type]
    
    companion_cfg = config['companion']
    companion = create_pokemon_for_test(
        companion_cfg['pokemon_id'], 
        companion_cfg['level'], 
        companion_cfg['evs'], 
        companion_cfg['ivs'], 
        companion_cfg['nature']
    )
    companion['ability'] = ability
    
    enemy_cfg = config['enemy']
    enemy = create_pokemon_for_test(
        enemy_cfg['pokemon_id'], 
        enemy_cfg['level'], 
        enemy_cfg['evs'], 
        enemy_cfg['ivs'], 
        enemy_cfg['nature']
    )
    enemy['ability'] = ability
    
    battle_result = simulate_battle(companion, enemy)
    
    return {
        'testType': test_type,
        'description': config['description'],
        'winner': battle_result['winner'],
        'winnerName': battle_result['winnerName'],
        'turns': battle_result['turns'],
        'companion': f"{companion['name']} (Lv{companion['level']}, {companion['nature']})",
        'enemy': f"{enemy['name']} (Lv{enemy['level']}, {enemy['nature']})"
    }


@app.route('/api/run-all-tests', methods=['POST'])
def run_all_tests():
    try:
        data = request.get_json() or {}
        iterations = min(data.get('iterations', 1), 100)
        ability = data.get('ability', DEFAULT_ABILITY)
        
        all_results = []
        companion_wins = 0
        enemy_wins = 0
        ties = 0
        
        for iteration in range(iterations):
            for test_type in TEST_BATTLE_CONFIGS.keys():
                result = run_single_battle_simulation(test_type, ability)
                all_results.append(result)
                
                if result['winner'] == 'companion':
                    companion_wins += 1
                elif result['winner'] == 'enemy':
                    enemy_wins += 1
                else:
                    ties += 1
        
        results_filename = f'test_results_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}.json'
        results_path = os.path.join(os.path.dirname(__file__), 'static', 'test_results')
        os.makedirs(results_path, exist_ok=True)
        
        full_path = os.path.join(results_path, results_filename)
        with open(full_path, 'w') as f:
            import json
            json.dump({
                'generatedAt': datetime.utcnow().isoformat(),
                'iterations': iterations,
                'summary': {
                    'companionWins': companion_wins,
                    'enemyWins': enemy_wins,
                    'ties': ties,
                    'totalBattles': len(all_results)
                },
                'battles': all_results
            }, f, indent=2)
        
        return jsonify({
            'success': True,
            'message': f'Completed {iterations} iteration(s) of all tests',
            'resultsFile': f'/static/test_results/{results_filename}',
            'summary': {
                'companionWins': companion_wins,
                'enemyWins': enemy_wins,
                'ties': ties,
                'totalBattles': len(all_results)
            }
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/test-results', methods=['GET'])
def list_test_results():
    try:
        results_path = os.path.join(os.path.dirname(__file__), 'static', 'test_results')
        if not os.path.exists(results_path):
            return jsonify({'success': True, 'files': []})
        
        files = []
        for filename in os.listdir(results_path):
            if filename.endswith('.json'):
                file_path = os.path.join(results_path, filename)
                files.append({
                    'filename': filename,
                    'url': f'/static/test_results/{filename}',
                    'size': os.path.getsize(file_path),
                    'modified': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
                })
        
        files.sort(key=lambda x: x['modified'], reverse=True)
        return jsonify({'success': True, 'files': files})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================
# BATTLE MECHANICS API ENDPOINTS
# ============================================

STAT_STAGE_MOVES = {
    'swords-dance': {'target': 'self', 'stat': 'attack', 'change': 2},
    'dragon-dance': {'target': 'self', 'stats': [{'stat': 'attack', 'change': 1}, {'stat': 'speed', 'change': 1}]},
    'calm-mind': {'target': 'self', 'stats': [{'stat': 'spAttack', 'change': 1}, {'stat': 'spDefense', 'change': 1}]},
    'nasty-plot': {'target': 'self', 'stat': 'spAttack', 'change': 2},
    'agility': {'target': 'self', 'stat': 'speed', 'change': 2},
    'iron-defense': {'target': 'self', 'stat': 'defense', 'change': 2},
    'amnesia': {'target': 'self', 'stat': 'spDefense', 'change': 2},
    'bulk-up': {'target': 'self', 'stats': [{'stat': 'attack', 'change': 1}, {'stat': 'defense', 'change': 1}]},
    'growl': {'target': 'enemy', 'stat': 'attack', 'change': -1},
    'leer': {'target': 'enemy', 'stat': 'defense', 'change': -1},
    'tail-whip': {'target': 'enemy', 'stat': 'defense', 'change': -1},
    'screech': {'target': 'enemy', 'stat': 'defense', 'change': -2},
    'sand-attack': {'target': 'enemy', 'stat': 'accuracy', 'change': -1},
    'flash': {'target': 'enemy', 'stat': 'accuracy', 'change': -1},
    'smokescreen': {'target': 'enemy', 'stat': 'accuracy', 'change': -1},
    'double-team': {'target': 'self', 'stat': 'evasion', 'change': 1},
    'minimize': {'target': 'self', 'stat': 'evasion', 'change': 2},
    'charm': {'target': 'enemy', 'stat': 'attack', 'change': -2},
    'fake-tears': {'target': 'enemy', 'stat': 'spDefense', 'change': -2},
    'metal-sound': {'target': 'enemy', 'stat': 'spDefense', 'change': -2},
    'shell-smash': {'target': 'self', 'stats': [
        {'stat': 'attack', 'change': 2}, {'stat': 'spAttack', 'change': 2}, {'stat': 'speed', 'change': 2},
        {'stat': 'defense', 'change': -1}, {'stat': 'spDefense', 'change': -1}
    ]}
}

STATUS_MOVES = {
    'thunder-wave': {'status': 'paralysis', 'accuracy': 90},
    'stun-spore': {'status': 'paralysis', 'accuracy': 75},
    'glare': {'status': 'paralysis', 'accuracy': 100},
    'will-o-wisp': {'status': 'burn', 'accuracy': 85},
    'poison-powder': {'status': 'poison', 'accuracy': 75},
    'toxic': {'status': 'badly-poisoned', 'accuracy': 90},
    'sleep-powder': {'status': 'sleep', 'accuracy': 75},
    'hypnosis': {'status': 'sleep', 'accuracy': 60},
    'sing': {'status': 'sleep', 'accuracy': 55},
    'spore': {'status': 'sleep', 'accuracy': 100},
    'lovely-kiss': {'status': 'sleep', 'accuracy': 75},
    'confuse-ray': {'status': 'confusion', 'accuracy': 100},
    'supersonic': {'status': 'confusion', 'accuracy': 55},
    'sweet-kiss': {'status': 'confusion', 'accuracy': 75}
}

STATUS_EFFECTS = {
    'paralysis': {
        'name': 'paralysis',
        'speedMultiplier': 0.5,
        'skipTurnChance': 0.25,
        'message': 'is paralyzed! It may not be able to move!'
    },
    'burn': {
        'name': 'burn',
        'attackMultiplier': 0.5,
        'endTurnDamagePercent': 0.0625,
        'message': 'was burned!'
    },
    'poison': {
        'name': 'poison',
        'endTurnDamagePercent': 0.125,
        'message': 'was poisoned!'
    },
    'badly-poisoned': {
        'name': 'badly-poisoned',
        'endTurnDamageMultiplier': True,
        'baseDamagePercent': 0.0625,
        'message': 'was badly poisoned!'
    },
    'sleep': {
        'name': 'sleep',
        'skipTurn': True,
        'turnsRemaining': 2,
        'message': 'fell asleep!'
    },
    'freeze': {
        'name': 'freeze',
        'skipTurn': True,
        'thawChance': 0.2,
        'message': 'was frozen solid!'
    },
    'confusion': {
        'name': 'confusion',
        'hitSelfChance': 0.33,
        'turnsRemaining': 3,
        'message': 'became confused!'
    }
}

def get_stat_stage_multiplier(stage):
    """Pokemon formula for stat stage multipliers"""
    clamped = max(-6, min(6, stage))
    if clamped >= 0:
        return (2 + clamped) / 2
    return 2 / (2 - clamped)

def get_accuracy_evasion_multiplier(stage):
    """Pokemon formula for accuracy/evasion multipliers"""
    clamped = max(-6, min(6, stage))
    if clamped >= 0:
        return (3 + clamped) / 3
    return 3 / (3 - clamped)

@app.route('/api/battle/stat-stage-multiplier', methods=['POST'])
def api_stat_stage_multiplier():
    try:
        data = request.get_json()
        stage = data.get('stage', 0)
        multiplier = get_stat_stage_multiplier(stage)
        return jsonify({'success': True, 'multiplier': multiplier})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/accuracy-evasion-multiplier', methods=['POST'])
def api_accuracy_evasion_multiplier():
    try:
        data = request.get_json()
        stage = data.get('stage', 0)
        multiplier = get_accuracy_evasion_multiplier(stage)
        return jsonify({'success': True, 'multiplier': multiplier})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/apply-stat-change', methods=['POST'])
def api_apply_stat_change():
    try:
        data = request.get_json()
        current_stages = data.get('currentStages', {'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0, 'accuracy': 0, 'evasion': 0})
        stat = data.get('stat', 'attack')
        change = data.get('change', 0)
        
        old_stage = current_stages.get(stat, 0)
        new_stage = max(-6, min(6, old_stage + change))
        current_stages[stat] = new_stage
        actual_change = new_stage - old_stage
        
        if actual_change == 0:
            message = f"{stat.capitalize()} won't go any {'higher' if change > 0 else 'lower'}!"
        elif abs(actual_change) >= 3:
            message = f"{stat.capitalize()} {'rose drastically' if actual_change > 0 else 'severely fell'}!"
        elif abs(actual_change) >= 2:
            message = f"{stat.capitalize()} {'sharply rose' if actual_change > 0 else 'harshly fell'}!"
        else:
            message = f"{stat.capitalize()} {'rose' if actual_change > 0 else 'fell'}!"
        
        return jsonify({
            'success': True,
            'stages': current_stages,
            'message': message,
            'changed': actual_change != 0
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/get-stat-move-effects', methods=['POST'])
def api_get_stat_move_effects():
    try:
        data = request.get_json()
        move_name = data.get('moveName', '')
        normalized = move_name.lower().replace(' ', '-')
        
        effects = STAT_STAGE_MOVES.get(normalized)
        return jsonify({'success': True, 'effects': effects})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/get-status-effect', methods=['POST'])
def api_get_status_effect():
    try:
        data = request.get_json()
        status = data.get('status', '')
        
        effect = STATUS_EFFECTS.get(status)
        if effect and status == 'sleep':
            effect = dict(effect)
            effect['turnsRemaining'] = random.randint(1, 3)
        elif effect and status == 'confusion':
            effect = dict(effect)
            effect['turnsRemaining'] = random.randint(1, 4)
            
        return jsonify({'success': True, 'effect': effect})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/get-status-move-effects', methods=['POST'])
def api_get_status_move_effects():
    try:
        data = request.get_json()
        move_name = data.get('moveName', '')
        normalized = move_name.lower().replace(' ', '-')
        
        effects = STATUS_MOVES.get(normalized)
        return jsonify({'success': True, 'effects': effects})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/process-status-on-turn', methods=['POST'])
def api_process_status_on_turn():
    try:
        data = request.get_json()
        status = data.get('status')
        max_hp = data.get('maxHp', 100)
        turn_count = data.get('turnCount', 1)
        
        result = {'canMove': True, 'damage': 0, 'message': '', 'cured': False}
        
        if not status:
            return jsonify({'success': True, 'result': result})
        
        status_name = status.get('name', '')
        
        if status_name == 'paralysis':
            if random.random() < status.get('skipTurnChance', 0.25):
                result['canMove'] = False
                result['message'] = "is paralyzed! It can't move!"
                
        elif status_name == 'burn':
            result['damage'] = int(max_hp * status.get('endTurnDamagePercent', 0.0625))
            result['message'] = 'is hurt by its burn!'
            
        elif status_name == 'poison':
            result['damage'] = int(max_hp * status.get('endTurnDamagePercent', 0.125))
            result['message'] = 'is hurt by poison!'
            
        elif status_name == 'badly-poisoned':
            result['damage'] = int(max_hp * status.get('baseDamagePercent', 0.0625) * turn_count)
            result['message'] = 'is hurt by poison!'
            
        elif status_name == 'sleep':
            turns_remaining = status.get('turnsRemaining', 1)
            if turns_remaining <= 0:
                result['cured'] = True
                result['message'] = 'woke up!'
            else:
                result['canMove'] = False
                result['message'] = 'is fast asleep.'
                
        elif status_name == 'freeze':
            if random.random() < status.get('thawChance', 0.2):
                result['cured'] = True
                result['message'] = 'thawed out!'
            else:
                result['canMove'] = False
                result['message'] = 'is frozen solid!'
                
        elif status_name == 'confusion':
            turns_remaining = status.get('turnsRemaining', 1)
            if turns_remaining <= 0:
                result['cured'] = True
                result['message'] = 'snapped out of confusion!'
            elif random.random() < status.get('hitSelfChance', 0.33):
                result['canMove'] = False
                result['damage'] = int(max_hp * 0.1)
                result['message'] = 'hurt itself in its confusion!'
        
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/calculate-accuracy-with-stages', methods=['POST'])
def api_calculate_accuracy_with_stages():
    try:
        data = request.get_json()
        base_accuracy = data.get('baseAccuracy', 100)
        attacker_accuracy_stage = data.get('attackerAccuracyStage', 0)
        defender_evasion_stage = data.get('defenderEvasionStage', 0)
        
        accuracy_multiplier = get_accuracy_evasion_multiplier(attacker_accuracy_stage)
        evasion_multiplier = get_accuracy_evasion_multiplier(defender_evasion_stage)
        
        final_accuracy = base_accuracy * (accuracy_multiplier / evasion_multiplier)
        final_accuracy = min(100, max(0, final_accuracy))
        
        return jsonify({'success': True, 'accuracy': final_accuracy})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/battle/init-stat-stages', methods=['GET'])
def api_init_stat_stages():
    return jsonify({
        'success': True,
        'stages': {'attack': 0, 'defense': 0, 'spAttack': 0, 'spDefense': 0, 'speed': 0, 'accuracy': 0, 'evasion': 0}
    })


if __name__ == '__main__':
    print("Starting PokeBrowse server on port 5000...")
    print("Open http://0.0.0.0:5000/preview.html to view the extension")
    app.run(host='0.0.0.0', port=5000, debug=True)