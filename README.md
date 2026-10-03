# Cover Letter Generator

A professional and automated cover letter generator that helps you craft tailored cover letters for your job applications.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Screenshots](#screenshots)

## Features
- **Smart Generation**: Automatically creates persuasive, professional cover letters tailored to your profile and the job description.
- **ATS Optimization**: Helps your cover letter pass through Applicant Tracking Systems.
- **Multi-Format Export**: Download your cover letter as PDF or DOCX.
- **Multiple Templates**: Choose from professional, minimal, or creative styles.
- **Theme Support**: Comfortable viewing with dark and light themes.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide React.
- **Backend**: Python, Flask, SQLite.
- **Libraries**: ReportLab (PDF), Python-docx (DOCX).

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhilpoola07/Cover-Letter-Generator-.git
   cd Cover-Letter-Generator
   ```

2. Setup Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the Backend Server:
   ```bash
   cd backend
   python run.py
   ```
   The backend will run on `http://127.0.0.1:5000`.

2. Start the Frontend Server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Screenshots

### Landing Page
![Hero Section](frontend/public/screenshots/landing_hero.png)
*Hero Section*

![Features Section](frontend/public/screenshots/landing_features.png)
*Features Section*

![Templates Section](frontend/public/screenshots/landing_templates.png)
*Templates Section*

### Signup Page
![Signup Page](frontend/public/screenshots/signup.png)
*Create an Account*

### Dashboard
![Dashboard](frontend/public/screenshots/dashboard.png)
*User Dashboard*

### Generate Letter
![Generate Form](frontend/public/screenshots/generate.png)
*Letter Generation Form*

---
Made with ❤️ by Akhil
