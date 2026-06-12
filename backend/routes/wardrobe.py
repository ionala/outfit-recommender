from flask import Blueprint, jsonify
from models import DefaultWardrobe

wardrobe_bp = Blueprint('wardrobe', __name__)


@wardrobe_bp.route('/default', methods=['GET'])
def get_default_wardrobe():
    items = DefaultWardrobe.query.all()

    result = []

    for item in items:
        result.append({
            'id_default': item.id_default,
            'nama_pakaian': item.nama_pakaian,
            'kategori': item.kategori,
            'style': item.style,
            'warna_grup': item.warna_grup,
            'image_url': item.image_url
        })

    return jsonify({
        'message': 'data default wardrobe berhasil diambil',
        'data': result
    }), 200