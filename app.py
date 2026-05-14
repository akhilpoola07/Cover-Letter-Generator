from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# ==========================================
# DATABASE CONFIGURATION
# ==========================================

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cover_letters.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# INITIALIZE DATABASE

db = SQLAlchemy(app)

# ==========================================
# TEMPORARY USER STORAGE
# ==========================================

users = []

# ==========================================
# DATABASE MODEL
# ==========================================

class CoverLetter(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)

    company_name = db.Column(db.String(100), nullable=False)

    role = db.Column(db.String(100), nullable=False)

    skills = db.Column(db.Text, nullable=False)

    experience = db.Column(db.Text, nullable=False)

    generated_letter = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ==========================================
# HOME PAGE
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# REGISTER PAGE
# ==========================================

@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]

        email = request.form["email"]

        password = request.form["password"]

        user = {
            "username": username,
            "email": email,
            "password": password
        }

        users.append(user)

        return redirect(url_for("login"))

    return render_template("register.html")


# ==========================================
# LOGIN PAGE
# ==========================================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]

        password = request.form["password"]

        for user in users:

            if user["email"] == email and user["password"] == password:

                return redirect(url_for("create_cover_letter"))

        return "Invalid Email or Password"

    return render_template("login.html")


# ==========================================
# CREATE COVER LETTER
# ==========================================

@app.route("/create", methods=["GET", "POST"])
def create_cover_letter():

    if request.method == "POST":

        # JSON SUPPORT FOR THUNDER CLIENT

        if request.is_json:

            data = request.get_json()

            full_name = data["full_name"]

            company_name = data["company_name"]

            role = data["role"]

            skills = data["skills"]

            experience = data["experience"]

        # HTML FORM SUPPORT

        else:

            full_name = request.form["full_name"]

            company_name = request.form["company_name"]

            role = request.form["role"]

            skills = request.form["skills"]

            experience = request.form["experience"]

        # GENERATED COVER LETTER

        generated_letter = f"""
Dear Hiring Manager,

My name is {full_name} and I am applying
for the position of {role} at {company_name}.

I possess strong skills in {skills}
and experience in {experience}.

I am excited about the opportunity
to contribute to your organization.

Thank you for your consideration.

Sincerely,
{full_name}
"""

        # SAVE TO DATABASE

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

        # JSON RESPONSE

        if request.is_json:

            return jsonify({
                "message": "Cover Letter Created Successfully",
                "id": new_letter.id
            })

        return redirect(url_for("list_letters"))

    return render_template("create.html")


# ==========================================
# READ ALL COVER LETTERS (HTML)
# ==========================================

@app.route("/letters")
def list_letters():

    letters = CoverLetter.query.all()

    return render_template(
        "list.html",
        letters=letters
    )


# ==========================================
# READ ALL COVER LETTERS (API)
# ==========================================

@app.route("/api/letters", methods=["GET"])
def api_letters():

    letters = CoverLetter.query.all()

    all_letters = []

    for letter in letters:

        all_letters.append({
            "id": letter.id,
            "full_name": letter.full_name,
            "company_name": letter.company_name,
            "role": letter.role,
            "skills": letter.skills,
            "experience": letter.experience,
            "generated_letter": letter.generated_letter
        })

    return jsonify(all_letters)


# ==========================================
# VIEW SINGLE LETTER
# ==========================================

@app.route("/view/<int:id>")
def view_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    return render_template(
        "view.html",
        letter=letter
    )


# ==========================================
# UPDATE COVER LETTER (HTML)
# ==========================================

@app.route("/edit/<int:id>", methods=["GET", "POST"])
def edit_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    if request.method == "POST":

        letter.full_name = request.form["full_name"]

        letter.company_name = request.form["company_name"]

        letter.role = request.form["role"]

        letter.skills = request.form["skills"]

        letter.experience = request.form["experience"]

        # REGENERATE LETTER

        letter.generated_letter = f"""
Dear Hiring Manager,

My name is {letter.full_name} and I am applying
for the position of {letter.role} at {letter.company_name}.

I possess strong skills in {letter.skills}
and experience in {letter.experience}.

I am excited about the opportunity
to contribute to your organization.

Thank you for your consideration.

Sincerely,
{letter.full_name}
"""

        db.session.commit()

        return redirect(url_for("list_letters"))

    return render_template(
        "edit.html",
        letter=letter
    )


# ==========================================
# UPDATE COVER LETTER (API)
# ==========================================

@app.route("/api/update/<int:id>", methods=["PUT"])
def api_update_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    data = request.get_json()

    letter.full_name = data["full_name"]

    letter.company_name = data["company_name"]

    letter.role = data["role"]

    letter.skills = data["skills"]

    letter.experience = data["experience"]

    # REGENERATE LETTER

    letter.generated_letter = f"""
Dear  HR,

My name is {letter.full_name} and I am applying
for the position of {letter.role} at {letter.company_name}.

I possess strong skills in {letter.skills}
and experience in {letter.experience}.

I am excited about the opportunity
to contribute to your organization.

Thank you for your consideration.

Sincerely,
{letter.full_name}
"""

    db.session.commit()

    return jsonify({
        "message": "Cover Letter Updated Successfully"
    })


# ==========================================
# DELETE COVER LETTER (HTML)
# ==========================================

@app.route("/delete/<int:id>")
def delete_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    db.session.delete(letter)

    db.session.commit()

    return redirect(url_for("list_letters"))


# ==========================================
# DELETE COVER LETTER (API)
# ==========================================

@app.route("/api/delete/<int:id>", methods=["DELETE"])
def api_delete_letter(id):

    letter = CoverLetter.query.get_or_404(id)

    db.session.delete(letter)

    db.session.commit()

    return jsonify({
        "message": "Cover Letter Deleted Successfully"
    })


# =======================================
# CREATE DATABASE TABLEs
# =======================================

with app.app_context():
    db.create_all()


# =========================================
# RUN APPLICATION
# =========================================

if __name__ == "__main__":
    app.run(debug=True)