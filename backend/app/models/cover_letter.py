import uuid
from datetime import datetime
import json
from app import db

class CoverLetter(db.Model):
    __tablename__ = 'cover_letters'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False) # "Software Engineer @ Google"
    job_title = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255), nullable=False)
    job_description = db.Column(db.Text, nullable=True)
    job_location = db.Column(db.String(255), nullable=True)
    employment_type = db.Column(db.String(100), nullable=True)
    
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    linkedin_url = db.Column(db.String(255), nullable=True)
    portfolio_url = db.Column(db.String(255), nullable=True)
    
    years_experience = db.Column(db.Integer, nullable=True)
    current_job_title = db.Column(db.String(255), nullable=True)
    key_skills = db.Column(db.Text, nullable=True) # Stored as JSON string
    achievements = db.Column(db.Text, nullable=True)
    education = db.Column(db.Text, nullable=True) # Stored as JSON string
    
    tone = db.Column(db.String(50), default='professional')
    length = db.Column(db.String(50), default='medium')
    highlight = db.Column(db.String(100), nullable=True)
    template_type = db.Column(db.String(50), default='professional')
    template_color = db.Column(db.String(50), default='#7F5DF4')
    
    generated_content = db.Column(db.Text, nullable=True)
    ats_score = db.Column(db.Integer, nullable=True)
    word_count = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(50), default='draft') # 'draft' | 'final'
    rating = db.Column(db.Integer, nullable=True) # 1-5 stars
    feedback = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_key_skills(self, skills_list):
        self.key_skills = json.dumps(skills_list)
        
    def get_key_skills(self):
        return json.loads(self.key_skills) if self.key_skills else []
        
    def set_education(self, ed_dict):
        self.education = json.dumps(ed_dict)
        
    def get_education(self):
        return json.loads(self.education) if self.education else {}

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'job_title': self.job_title,
            'company_name': self.company_name,
            'job_description': self.job_description,
            'job_location': self.job_location,
            'employment_type': self.employment_type,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'linkedin_url': self.linkedin_url,
            'portfolio_url': self.portfolio_url,
            'years_experience': self.years_experience,
            'current_job_title': self.current_job_title,
            'key_skills': self.get_key_skills(),
            'achievements': self.achievements,
            'education': self.get_education(),
            'tone': self.tone,
            'length': self.length,
            'highlight': self.highlight,
            'template_type': self.template_type,
            'template_color': self.template_color,
            'generated_content': self.generated_content,
            'ats_score': self.ats_score,
            'word_count': self.word_count,
            'status': self.status,
            'rating': self.rating,
            'feedback': self.feedback,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
