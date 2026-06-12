from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db, bcrypt
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nama = data.get('nama')
    username = data.get('username')
    password = data.get('password')

    if not nama or not username or not password:
        return jsonify({'message': 'nama, username, dan password wajib diisi'}), 400

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return jsonify({'message': 'username sudah digunakan'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        nama=nama,
        username=username,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'registrasi berhasil',
        'user': {
            'id_user': new_user.id_user,
            'nama': new_user.nama,
            'username': new_user.username
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'username dan password wajib diisi'}), 400

    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({'message': 'username atau password salah'}), 401

    password_valid = bcrypt.check_password_hash(user.password, password)

    if not password_valid:
        return jsonify({'message': 'username atau password salah'}), 401

    token = create_access_token(identity=str(user.id_user))

    return jsonify({
        'message': 'login berhasil',
        'token': token,
        'user': {
            'id_user': user.id_user,
            'nama': user.nama,
            'username': user.username
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'user tidak ditemukan'}), 404

    return jsonify({
        'id_user': user.id_user,
        'nama': user.nama,
        'username': user.username
    }), 200

@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()

    nama = data.get('nama')
    username = data.get('username')
    password = data.get('password')

    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'user tidak ditemukan'}), 404

    if not nama or not username:
        return jsonify({'message': 'nama dan username wajib diisi'}), 400

    existing_user = User.query.filter(
        User.username == username,
        User.id_user != int(user_id)
    ).first()

    if existing_user:
        return jsonify({'message': 'username sudah digunakan'}), 400

    user.nama = nama
    user.username = username

    if password:
        user.password = bcrypt.generate_password_hash(password).decode('utf-8')

    db.session.commit()

    return jsonify({
        'message': 'profil berhasil diperbarui',
        'user': {
            'id_user': user.id_user,
            'nama': user.nama,
            'username': user.username
        }
    }), 200

@auth_bp.route('/me', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'user tidak ditemukan'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'akun berhasil dihapus'}), 200