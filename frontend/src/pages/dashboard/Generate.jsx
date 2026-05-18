import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle, ChevronRight, Loader2, Star } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Generate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Personal
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    portfolio_url: '',
    // Step 2: Job
    job_title: '',
    company_name: '',
    job_description: '',
    job_location: '',
    employment_type: 'Full-time',
    // Step 3: Background
    years_experience: '',
    current_job_title: '',
    key_skills: '',
    achievements: '',
    education: { degree: '', field: '', university: '', year: '' },
    // Step 4: Preferences
    tone: 'professional',
    length: 'medium',
    highlight: 'Skills Match',
    template_type: localStorage.getItem('preferred_template') || 'professional',
    template_color: localStorage.getItem('preferred_template_color') || '#7F5DF4'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || '',
        email: user.email || '',
        tone: user.default_tone || 'professional'
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('ed_')) {
      const field = name.replace('ed_', '');
      setFormData(prev => ({ ...prev, education: { ...prev.education, [field]: value } }));
    } else if (name === 'template_type') {
      const defaultColor = 
        value === 'minimal' ? '#00B4D8' : 
        value === 'creative' ? '#EF476F' : 
        '#7F5DF4';
      
      // Save their new preference permanently for future letters
      localStorage.setItem('preferred_template', value);
      localStorage.setItem('preferred_template_color', defaultColor);
      
      setFormData(prev => ({ ...prev, template_type: value, template_color: defaultColor }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    // Find all required fields in the active card step
    const cardEl = document.querySelector('.card');
    if (cardEl) {
      const requiredInputs = Array.from(cardEl.querySelectorAll('input[required], textarea[required], select[required]'));
      const firstInvalid = requiredInputs.find(input => !input.value || !input.value.trim());
      
      if (firstInvalid) {
        setShowErrors(true);
        firstInvalid.reportValidity(); // Auto-focuses and spawns native browser validation popup
        return;
      }
    }

    // Step-specific custom structural validations
    if (step === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setShowErrors(true);
        return toast.error('Please enter a valid email address');
      }

      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(cleanPhone)) {
        setShowErrors(true);
        return toast.error('Please enter a valid phone number (must contain between 10 and 15 digits)');
      }
      
      const isValidUrl = (string) => {
        try { new URL(string); return true; } catch (_) { return false; }
      };

      if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
        setShowErrors(true);
        return toast.error('Please enter a valid URL for LinkedIn (include http:// or https://)');
      }
      
      if (formData.portfolio_url && !isValidUrl(formData.portfolio_url)) {
        setShowErrors(true);
        return toast.error('Please enter a valid URL for Portfolio (include http:// or https://)');
      }
    } else if (step === 2) {
      const vowelRegex = /[aeiouyAEIOUY]/;
      if (formData.job_title.trim().length > 3 && !vowelRegex.test(formData.job_title)) {
        setShowErrors(true);
        return toast.error('Job Title appears to be random text. Please enter a valid title.');
      }
    }

    setShowErrors(false);
    window.scrollTo(0, 0);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    try {
      // Parse skills string to array
      const skillsArray = formData.key_skills.split(',').map(s => s.trim()).filter(s => s);
      const payload = { ...formData, key_skills: skillsArray };
      
      // Step 1: Generate letter
      const genRes = await api.post('/cover-letters/generate', payload);
      
      // Step 2: Save to DB
      const savePayload = {
        ...payload,
        generated_content: genRes.data.generated_content,
        ats_score: genRes.data.ats_score,
        word_count: genRes.data.word_count,
        status: 'draft'
      };
      
      const saveRes = await api.post('/cover-letters', savePayload);
      toast.success('Cover letter generated successfully!');
      navigate(`/dashboard/letters/${saveRes.data.id}`);
      
    } catch (error) {
      toast.error('Failed to generate cover letter');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Progress Bar
  const steps = ['Personal Info', 'Job Details', 'Background', 'Preferences'];

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center animate-pulse-slow">
        <Loader2 size={64} className="text-accent animate-spin mb-8" />
        <h2 className="text-3xl font-serif font-bold mb-4">Crafting Your Masterpiece</h2>
        <p className="text-textMuted text-lg max-w-md text-center">
          Our system is analyzing the job description and your profile to write an ATS-optimized cover letter...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Progress */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-2">
          {steps.map((s, i) => (
            <div key={i} className={`text-sm font-medium ${step >= i + 1 ? 'text-accent' : 'text-textMuted'}`}>
              {i + 1}. {s}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-800 rounded-full flex">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-full ${i === 0 ? 'rounded-l-full' : ''} ${i === steps.length - 1 ? 'rounded-r-full' : ''} ${step >= i + 1 ? 'bg-accent border-r border-base' : ''}`}></div>
          ))}
        </div>
      </div>

      <div className="card animate-fade-in-up">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-1">Personal Information</h2>
              <p className="text-textMuted text-sm">How should the employer contact you?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className={`input-field ${showErrors && !formData.full_name.trim() ? 'border-red-500 bg-red-500/5' : ''}`} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field ${showErrors && !formData.email.trim() ? 'border-red-500 bg-red-500/5' : ''}`} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`input-field ${showErrors && !formData.phone.trim() ? 'border-red-500 bg-red-500/5' : ''}`} placeholder="+91 00000 00000" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="input-field" placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Portfolio / Website</label>
                <input type="url" name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-1">Target Job Details</h2>
              <p className="text-textMuted text-sm">What role are you applying for? Paste the description for ATS keyword matching.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Job Title *</label>
                <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} className={`input-field ${showErrors && !formData.job_title.trim() ? 'border-red-500 bg-red-500/5' : ''}`} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={`input-field ${showErrors && !formData.company_name.trim() ? 'border-red-500 bg-red-500/5' : ''}`} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Job Location</label>
                <input type="text" name="job_location" value={formData.job_location} onChange={handleChange} className="input-field" placeholder="e.g., Remote, New York" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Employment Type</label>
                <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="input-field">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 flex justify-between">
                  <span>Job Description *</span>
                  <span className="text-accent text-xs">Crucial for ATS matching</span>
                </label>
                <textarea 
                  name="job_description" 
                  value={formData.job_description} 
                  onChange={handleChange} 
                  className={`input-field h-40 resize-y ${showErrors && !formData.job_description.trim() ? 'border-red-500 bg-red-500/5' : ''}`} 
                  placeholder="Paste the full job description here..."
                  required
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-1">Your Background</h2>
              <p className="text-textMuted text-sm">Highlight your skills and achievements.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current/Last Job Title *</label>
                <input type="text" name="current_job_title" value={formData.current_job_title} onChange={handleChange} className={`input-field ${showErrors && !formData.current_job_title.trim() ? 'border-red-500 bg-red-500/5' : ''}`} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <input 
                  type="number" 
                  name="years_experience" 
                  value={formData.years_experience} 
                  onChange={handleChange} 
                  className="input-field" 
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Key Skills (comma separated) *</label>
                <input type="text" name="key_skills" value={formData.key_skills} onChange={handleChange} className={`input-field ${showErrors && !formData.key_skills.trim() ? 'border-red-500 bg-red-500/5' : ''}`} placeholder="React, Python, Project Management, Agile" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Top Achievements</label>
                <textarea 
                  name="achievements" 
                  value={formData.achievements} 
                  onChange={handleChange} 
                  className="input-field h-24" 
                  placeholder="e.g. Increased sales by 20%, Led team of 5 engineers..."
                ></textarea>
              </div>
              
              <div className="md:col-span-2 border-t border-gray-800 pt-4 mt-2">
                <h3 className="font-bold mb-4">Highest Education</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-textMuted mb-1">Degree</label>
                    <input type="text" name="ed_degree" value={formData.education.degree} onChange={handleChange} className="input-field py-2" placeholder="e.g. B.S." />
                  </div>
                  <div>
                    <label className="block text-xs text-textMuted mb-1">Field of Study</label>
                    <input type="text" name="ed_field" value={formData.education.field} onChange={handleChange} className="input-field py-2" placeholder="e.g. Computer Science" />
                  </div>
                  <div>
                    <label className="block text-xs text-textMuted mb-1">University</label>
                    <input type="text" name="ed_university" value={formData.education.university} onChange={handleChange} className="input-field py-2" />
                  </div>
                  <div>
                    <label className="block text-xs text-textMuted mb-1">Graduation Year</label>
                    <input type="text" name="ed_year" value={formData.education.year} onChange={handleChange} className="input-field py-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold mb-1">Tone & Preferences</h2>
              <p className="text-textMuted text-sm">Fine-tune how your letter sounds.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Writing Tone</label>
                <select name="tone" value={formData.tone} onChange={handleChange} className="input-field">
                  <option value="professional">Professional & Formal</option>
                  <option value="enthusiastic">Enthusiastic & Eager</option>
                  <option value="concise">Concise & Direct</option>
                  <option value="creative">Creative & Storytelling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Length</label>
                <select name="length" value={formData.length} onChange={handleChange} className="input-field">
                  <option value="short">Short (~250 words)</option>
                  <option value="medium">Medium (~400 words)</option>
                  <option value="long">Detailed (~600 words)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Highlight Focus</label>
                <select name="highlight" value={formData.highlight} onChange={handleChange} className="input-field">
                  <option value="Skills Match">Skills Match</option>
                  <option value="Culture Fit">Culture Fit</option>
                  <option value="Leadership">Leadership Experience</option>
                  <option value="Technical Depth">Technical Depth</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Template Style</label>
                <select name="template_type" value={formData.template_type} onChange={handleChange} className="input-field">
                  <option value="professional">The Professional</option>
                  <option value="minimal">Modern Minimal</option>
                  <option value="creative">The Creative</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-accent/10 border border-accent/20 rounded-lg flex items-start space-x-4">
              <CheckCircle className="text-accent shrink-0 mt-1" />
              <div>
                <h4 className="font-bold mb-1">Ready to Generate</h4>
                <p className="text-sm text-textMuted">
                  Our system will now analyze the job description and your background to draft a customized, ATS-optimized cover letter. This usually takes about 10-15 seconds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between pt-6 border-t border-gray-800">
          <button 
            type="button" 
            onClick={prevStep} 
            className={`btn-secondary ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            Back
          </button>
          
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary flex items-center">
              Next Step <ChevronRight size={18} className="ml-1" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-primary flex items-center px-8 shadow-xl shadow-accent/20">
              <Star size={18} className="mr-2" /> Generate Letter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
