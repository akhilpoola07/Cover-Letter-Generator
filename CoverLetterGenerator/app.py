# app.py

from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# DATABASE CONFIGURATION
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cover_letters.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# DATABASE MODEL
class CoverLetter(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)

    company_name = db.Column(db.String(100), nullable=False)

    role = db.Column(db.String(100), nullable=False)

    skills = db.Column(db.Text, nullable=False)

    experience = db.Column(db.Text, nullable=False)

    generated_letter = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# HOME PAGE
@app.route("/")
def home():
    return render_template("index.html")


# CREATE COVER LETTER
@app.route("/create", methods=["GET", "POST"])
def create_cover_letter():

    if request.method == "POST":

        full_name = request.form["full_name"]
        company_name = request.form["company_name"]
        role = request.form["role"]
        skills = request.form["skills"]
        experience = request.form["experience"]

        generated_letter = f"""
Dear Hiring Manager,

My name is {full_name} and I am applying for the position of {role} at {company_name}.

I possess strong skills in {skills} and have experience in {experience}.

I am excited about the opportunity to contribute to your organization.

Thank you for your consideration.

Sincerely,
{full_name}
"""

        new_letter = CoverLetter(
            full_name=full_name,
            company_name=company_name,
            role=role,
            skills=skills,
            experience=experience,
            generated_letter=generated_letter
        )

        db.session.add(new_letter)
        db.session.commit()

        return redirect(url_for("list_letters"))

    return render_template("create.html")


# READ ALL LETTERS
@app.route("/letters")
def list_letters():

    letters = CoverLetter.query.all()

    return render_template("list.html", letters=letters)


# VIEW SINGLE LETTER
@app.route("/view/<int:id>")
def view_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    return render_template("view.html", letter=letter)


# UPDATE LETTER
@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    if request.method == "POST":

        letter.full_name = request.form["full_name"]
        letter.company_name = request.form["company_name"]
        letter.role = request.form["role"]
        letter.skills = request.form["skills"]
        letter.experience = request.form["experience"]

        db.session.commit()

        return redirect(url_for("list_letters"))

    return render_template("edit.html", letter=letter)


# DELETE LETTER
@app.route("/delete/<int:id>")
def delete_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    db.session.delete(letter)
    db.session.commit()

    return redirect(url_for("list_letters"))


# CREATE DATABASE TABLES
with app.app_context():
    db.create_all()


# RUN APPLICATION
if __name__ == "__main__":
    app.run(debug=True)