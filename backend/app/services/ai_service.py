import os
import json
import openai

def generate_cover_letter(data: dict) -> dict:
    prompt = f"""
You are an expert career coach and professional resume writer. Your task is to generate a highly personalized, ATS-optimized cover letter using the TealHQ methodology.

APPLICANT INFO:
- Name: {data.get('full_name')}
- Email: {data.get('email')}
- Phone: {data.get('phone')}
- LinkedIn: {data.get('linkedin_url')}
- Current Role: {data.get('current_job_title')}
- Years of Experience: {data.get('years_experience')}
- Key Skills: {', '.join(data.get('key_skills', []))}
- Top Achievements: {data.get('achievements')}
- Education: {data.get('education', {}).get('degree')} in {data.get('education', {}).get('field')} from {data.get('education', {}).get('university')} ({data.get('education', {}).get('year')})

TARGET JOB:
- Job Title: {data.get('job_title')}
- Company: {data.get('company_name')}
- Job Description:
{data.get('job_description')}

STYLE PREFERENCES:
- Tone: {data.get('tone')}
- Length: {data.get('length')}
- Highlight Focus: {data.get('highlight')}
- Template Style: {data.get('template_type', 'professional')}

STRUCTURE TO FOLLOW (Crucial):
You MUST generate a full, formally structured cover letter including:
1. HEADER: Applicant's Name and Contact info (Email, Phone, LinkedIn).
2. DATE: Current date or a placeholder like [Date].
3. RECIPIENT: Hiring Manager, {data.get('company_name')}.
4. SALUTATION: Dear Hiring Manager (or similar professional greeting).
5. OPENING PARAGRAPH: Hook the reader, state the role, and show enthusiasm.
6. BODY PARAGRAPHS: Connect experience to job needs (STAR method).
7. CLOSING PARAGRAPH: Call to action, reiterate interest.
8. SIGN-OFF: Sincerely, [Applicant Name].

Adapt the content style based on the 'Template Style' requested (e.g., 'creative' should be more storytelling, 'minimal' more direct).

YOUR OUTPUT FORMAT:
You MUST return ONLY a valid JSON object with exactly two keys:
1. "cover_letter": The full text of the cover letter with all structure requested above (string)
2. "ats_score": An integer from 1 to 100 representing how well the Applicant's skills and experience match the Target Job description based on strict ATS keyword tracking algorithms. Be highly critical and realistic with this score.

Do NOT include markdown formatting like ```json. Just raw JSON.
"""

    api_key = os.environ.get("OPENAI_API_KEY")
    
    # Fallback if no real API key
    if not api_key or api_key == "sk-placeholder" or api_key.startswith("your_"):
        skills_str = ', '.join(data.get('key_skills', []))
        template_type = data.get('template_type', 'professional')
        
        # Calculate a mock ATS score based on keyword presence
        desc = data.get('job_description', '').lower()
        skills = [s.lower().strip() for s in data.get('key_skills', [])]
        matched = sum(1 for s in skills if s in desc)
        ats_score = min(98, 40 + (matched * 15)) if skills else 75
        
        # Generate varied text based on template
        if template_type == 'creative':
            body = f"I am excited to bring my creative vision and passion to the {data.get('job_title')} position at {data.get('company_name')}. My journey as a {data.get('current_job_title')} has been driven by innovation and out-of-the-box thinking. My core competencies include: {skills_str}."
        elif template_type == 'minimal':
            body = f"I am writing to apply for the {data.get('job_title')} position at {data.get('company_name')}. With {data.get('years_experience')} years as a {data.get('current_job_title')}, I bring a streamlined, results-driven approach. My skills include: {skills_str}."
        else:
            body = f"I am writing to express my strong interest in the {data.get('job_title')} position. With {data.get('years_experience')} years of experience as a {data.get('current_job_title')}, I am confident in my ability to make an immediate impact on your team at {data.get('company_name')}. My core competencies include: {skills_str}."
            
        cover_letter_text = f"{body}\n\nIn my previous experience, I have demonstrated success in several key areas. Notably, {data.get('achievements')}.\n\nThank you for your time and consideration.\n\nSincerely,\n{data.get('full_name')}"
        
        return {
            "cover_letter": cover_letter_text,
            "ats_score": ats_score
        }

    try:
        openai.api_key = api_key
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional resume writer. You output strict JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        content = response.choices[0].message.content.strip()
        # Clean up potential markdown from response
        if content.startswith('```json'):
            content = content[7:-3]
        elif content.startswith('```'):
            content = content[3:-3]
            
        result = json.loads(content)
        return {
            "cover_letter": result.get("cover_letter", "Error extracting letter"),
            "ats_score": int(result.get("ats_score", 70))
        }
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return {
            "cover_letter": f"[Fallback Cover Letter]\n\nError generating letter via API: {e}\n\nDear Hiring Manager...",
            "ats_score": 50
        }
