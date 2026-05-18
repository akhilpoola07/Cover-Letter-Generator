import os
import random
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.cover_letter import CoverLetter
from app.services.ai_service import generate_cover_letter
from app.services.pdf_service import create_pdf, create_docx

cover_letters_bp = Blueprint('cover_letters', __name__)

@cover_letters_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    try:
        ai_response = generate_cover_letter(data)
        generated_text = ai_response.get('cover_letter', '')
        ats_score = ai_response.get('ats_score', 70)
        
        # Calculate approximate word count
        word_count = len(generated_text.split())
        
        return jsonify({
            'generated_content': generated_text,
            'ats_score': ats_score,
            'word_count': word_count
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@cover_letters_bp.route('', methods=['POST'])
@jwt_required()
def create_letter():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    try:
        new_letter = CoverLetter(
            user_id=user_id,
            title=f"{data.get('job_title', 'Role')} @ {data.get('company_name', 'Company')}",
            job_title=data.get('job_title'),
            company_name=data.get('company_name'),
            job_description=data.get('job_description'),
            job_location=data.get('job_location'),
            employment_type=data.get('employment_type'),
            full_name=data.get('full_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            linkedin_url=data.get('linkedin_url'),
            portfolio_url=data.get('portfolio_url'),
            years_experience=data.get('years_experience'),
            current_job_title=data.get('current_job_title'),
            achievements=data.get('achievements'),
            tone=data.get('tone', 'professional'),
            length=data.get('length', 'medium'),
            highlight=data.get('highlight'),
            template_type=data.get('template_type', 'professional'),
            template_color=data.get('template_color', '#7F5DF4'),
            generated_content=data.get('generated_content'),
            ats_score=data.get('ats_score'),
            word_count=data.get('word_count'),
            status=data.get('status', 'final')
        )
        
        new_letter.set_key_skills(data.get('key_skills', []))
        new_letter.set_education(data.get('education', {}))
        
        db.session.add(new_letter)
        db.session.commit()
        
        return jsonify(new_letter.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@cover_letters_bp.route('', methods=['GET'])
@jwt_required()
def list_letters():
    user_id = get_jwt_identity()
    letters = CoverLetter.query.filter_by(user_id=user_id).order_by(CoverLetter.created_at.desc()).all()
    return jsonify([letter.to_dict() for letter in letters]), 200

@cover_letters_bp.route('/<string:id>', methods=['GET'])
@jwt_required()
def get_letter(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    return jsonify(letter.to_dict()), 200

@cover_letters_bp.route('/<string:id>', methods=['PATCH'])
@jwt_required()
def update_letter(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    data = request.get_json()
    
    updatable_fields = ['title', 'generated_content', 'status', 'rating', 'feedback']
    for field in updatable_fields:
        if field in data:
            setattr(letter, field, data[field])
            
    if 'generated_content' in data:
        letter.word_count = len(data['generated_content'].split())
        
    db.session.commit()
    return jsonify(letter.to_dict()), 200

@cover_letters_bp.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_letter(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    db.session.delete(letter)
    db.session.commit()
    return jsonify({'message': 'Cover letter deleted successfully'}), 200

@cover_letters_bp.route('/<string:id>/pdf', methods=['GET'])
@jwt_required()
def download_pdf(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    pdf_path = create_pdf(letter.generated_content, letter.title)
    return send_file(pdf_path, as_attachment=True, download_name=f"{letter.title or 'Cover_Letter'}.pdf")

@cover_letters_bp.route('/<string:id>/docx', methods=['GET'])
@jwt_required()
def download_docx(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    docx_path = create_docx(letter.generated_content, letter.title)
    return send_file(docx_path, as_attachment=True, download_name=f"{letter.title or 'Cover_Letter'}.docx")

@cover_letters_bp.route('/<string:id>/txt', methods=['GET'])
@jwt_required()
def download_txt(id):
    user_id = get_jwt_identity()
    letter = CoverLetter.query.filter_by(id=id, user_id=user_id).first()
    
    if not letter:
        return jsonify({'message': 'Cover letter not found'}), 404
        
    from io import BytesIO
    mem = BytesIO()
    mem.write(letter.generated_content.encode('utf-8'))
    mem.seek(0)
    
    return send_file(
        mem,
        mimetype='text/plain',
        as_attachment=True,
        download_name=f"{letter.title or 'Cover_Letter'}.txt"
    )
