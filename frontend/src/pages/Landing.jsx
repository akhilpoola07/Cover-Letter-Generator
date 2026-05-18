import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Zap, Shield, Download, X, ZoomIn, Sparkles, Mail, MessageSquare, Feather } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  console.log("Landing component rendering");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // 12 templates
  const templates = [
    { id: 1, title: 'The Professional', desc: 'Clean, structured, and perfect for corporate roles.', color: '#7F5DF4', type: 'professional', name: 'Alex Morgan', role: 'Senior Developer' },
    { id: 2, title: 'Modern Minimal', desc: 'Sleek and contemporary, great for tech and startups.', color: '#00B4D8', type: 'minimal', name: 'Sarah Jenkins', role: 'Product Designer' },
    { id: 3, title: 'The Creative', desc: 'Bold accents for design, marketing, and media roles.', color: '#EF476F', type: 'creative', name: 'Riley Taylor', role: 'Content Strategist' },
    
    { id: 4, title: 'Corporate Sleek', desc: 'A variation with a dark navy theme for executive roles.', color: '#1A1F3A', type: 'professional', name: 'James Wilson', role: 'Operations Manager' },
    { id: 5, title: 'Tech Startup', desc: 'Vibrant green accents for tech and software roles.', color: '#10B981', type: 'minimal', name: 'Emily Chen', role: 'Software Engineer' },
    { id: 6, title: 'Design Bold', desc: 'High contrast amber for creative minds and artists.', color: '#F59E0B', type: 'creative', name: 'David Smith', role: 'Art Director' },
    
    { id: 7, title: 'Classic Elegant', desc: 'Traditional layout with a touch of royal blue.', color: '#1E3A8A', type: 'professional', name: 'Michael Brown', role: 'Accountant' },
    { id: 8, title: 'Ultra Minimal', desc: 'Almost no color, focusing purely on content and spacing.', color: '#6B7280', type: 'minimal', name: 'Jessica Taylor', role: 'Data Analyst' },
    { id: 9, title: 'Vibrant Media', desc: 'Purple sidebar for media and communication roles.', color: '#8B5CF6', type: 'creative', name: 'Robert Johnson', role: 'PR Specialist' },
    
    { id: 10, title: 'Executive Choice', desc: 'Emerald green for top management and leadership.', color: '#047857', type: 'professional', name: 'William Davis', role: 'Chief Executive' },
    { id: 11, title: 'Clean Slate', desc: 'A variation of minimal with a soft indigo touch.', color: '#6366F1', type: 'minimal', name: 'Linda Martinez', role: 'HR Manager' },
    { id: 12, title: 'Artistic Edge', desc: 'Deep rose sidebar for fashion and arts.', color: '#E11D48', type: 'creative', name: 'Thomas Anderson', role: 'Fashion Designer' },
  ];

  // Helper to render template content
  const renderTemplateContent = (template, isModal = false) => {
    const scaleClass = isModal ? 'scale-100' : 'scale-95 group-hover:scale-100';
    const paddingClass = isModal ? 'p-8' : 'p-5';
    const textBaseClass = isModal ? 'text-[10px]' : 'text-[6px]';
    const textLargeClass = isModal ? 'text-[16px]' : 'text-[10px]';
    const textSmallClass = isModal ? 'text-[8px]' : 'text-[5px]';

    if (template.type === 'professional') {
      return (
        <div className={`w-full h-full bg-white shadow-sm ${paddingClass} ${textBaseClass} ${scaleClass} transition-transform origin-top text-gray-700 leading-relaxed`}>
          <div className={`${textLargeClass} font-bold mb-0.5`} style={{ color: template.color }}>{template.name.toUpperCase()}</div>
          <div className="text-gray-500 mb-3 border-b border-gray-100 pb-0.5">{template.name.toLowerCase()}@email.com | San Francisco, CA</div>
          <div className="font-bold mb-0.5">Dear Hiring Manager,</div>
          <p className="mb-1">I am writing to express my enthusiastic interest in the {template.role} role. With over 6 years of experience in building modern web applications, I am confident in my ability to make an immediate impact.</p>
          <p className="mb-1">In my previous role, I successfully migrated a legacy system to a modern stack, resulting in a 50% improvement in load times and a 30% reduction in maintenance costs.</p>
          <p className="mb-2">I am drawn to your company because of your focus on innovation and user-centric design. My technical skills and leadership experience align well with your goals.</p>
          <div>Sincerely,</div>
          <div className="font-bold mt-0.5">{template.name}</div>
        </div>
      );
    } else if (template.type === 'minimal') {
      return (
        <div className={`w-full h-full bg-white shadow-sm ${paddingClass} ${textBaseClass} ${scaleClass} transition-transform origin-top text-gray-700 leading-relaxed border-t-4`} style={{ borderTopColor: template.color }}>
          <div className={`${textLargeClass} font-bold mb-0.5`} style={{ color: template.color }}>{template.name.toUpperCase()}</div>
          <div className="text-gray-400 mb-3">{template.role}</div>
          <div className="font-bold mb-0.5">Hi there,</div>
          <p className="mb-1">I'm excited to apply for the position. I love creating products that are both beautiful and highly functional.</p>
          <p className="mb-1">My process is heavily research-based. At my last job, I redesigned the main flow, which increased conversion rates by 25% and reduced user drop-off significantly.</p>
          <p className="mb-2">I'm a big fan of your work and would love to bring my skills in problem solving and user research to your team.</p>
          <div>Best regards,</div>
          <div className="font-bold mt-0.5">{template.name}</div>
        </div>
      );
    } else {
      return (
        <div className={`w-full h-full bg-white shadow-sm p-0 ${textBaseClass} ${scaleClass} transition-transform origin-top text-gray-700 leading-relaxed flex`}>
          <div className="w-1/4 text-white p-3 flex flex-col justify-between" style={{ backgroundColor: template.color }}>
            <div>
              <div className={`${isModal ? 'text-[12px]' : 'text-[8px]'} font-bold mb-0.5`}>{template.name.split(' ')[0].toUpperCase()}</div>
              <div className={`${isModal ? 'text-[12px]' : 'text-[8px]'} font-bold`}>{template.name.split(' ')[1].toUpperCase()}</div>
            </div>
            <div className={textSmallClass} style={{ opacity: 0.8 }}>{template.role}</div>
          </div>
          <div className={paddingClass + " w-3/4"}>
            <div className="font-bold mb-0.5">Dear Creative Team,</div>
            <p className="mb-1">I am thrilled to apply for the role. I have a passion for storytelling and creating engaging content that converts.</p>
            <p className="mb-1">I have managed campaigns that grew audience size by 200% and drove significant revenue growth.</p>
            <p className="mb-2">I'm excited about the possibility of bringing my creative ideas to your upcoming projects.</p>
            <div>Cheers,</div>
            <div className="font-bold mt-0.5">{template.name}</div>
          </div>
        </div>
      );
    }
  };

  console.log("Landing component returning JSX");
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#1A1F3A] relative overflow-hidden font-sans scroll-smooth">
      <style>{`
        @keyframes float-email {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .animate-float-email {
          animation: float-email 5s ease-in-out infinite;
        }
        .animate-float-email-delayed {
          animation: float-email 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* Background Purple Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#7F5DF4]/15 to-[#00B4D8]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Mail Emojis */}
      <div className="absolute top-20 left-10 text-3xl opacity-20 animate-float-email pointer-events-none">✉️</div>
      <div className="absolute top-40 right-20 text-4xl opacity-15 animate-float-email-delayed pointer-events-none">📩</div>
      <div className="absolute bottom-1/4 left-1/4 text-2xl opacity-10 animate-float-email pointer-events-none">📄</div>
      <div className="absolute top-1/2 right-1/3 text-3xl opacity-15 animate-float-email-delayed pointer-events-none">✉️</div>

      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 flex justify-between items-center py-4 px-10 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        {/* Custom Logo: Document + Feather (Inspired by 4th logo in sample) */}
        <div className="flex items-center space-x-2">
          <img src="/favicon.png" alt="Logo" className="w-10 h-10 flex-shrink-0" />
          <div className="text-xl font-bold text-[#1A1F3A]">Cover Letter</div>
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-[#7F5DF4] transition-colors">HOME</a>
          <a href="#about" className="hover:text-[#7F5DF4] transition-colors">ABOUT</a>
          <a href="#features" className="hover:text-[#7F5DF4] transition-colors">FEATURES</a>
          <a href="#templates" className="hover:text-[#7F5DF4] transition-colors">TEMPLATES</a>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-[#1A1F3A] hover:text-[#7F5DF4] font-medium transition-colors text-sm">Login</Link>
          <Link to="/signup" className="bg-[#7F5DF4] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#6A4CE0] transition-colors shadow-lg shadow-[#7F5DF4]/20">Sign In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-10 pt-32 mt-10 relative z-10 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl lg:max-w-xl">
          <span className="text-xs font-bold tracking-widest text-[#7F5DF4] uppercase">CAREER TOOL</span>
          <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-4 font-sans leading-tight text-[#1A1F3A]">
            Land Your<br />Dream Job
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-md">
            Craft professional cover letters tailored to bypass Applicant Tracking Systems and impress hiring managers.
          </p>
          <Link to="/signup" className="inline-flex items-center bg-[#7F5DF4] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#6A4CE0] hover:shadow-lg transition-all group shadow-xl shadow-[#7F5DF4]/20">
            GET STARTED
            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative w-full max-w-md hidden lg:block">
          <div className="w-[380px] h-[520px] bg-white backdrop-blur-md rounded-xl shadow-2xl border border-white/80 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10 text-[7px] text-gray-700 leading-relaxed">
            <div className="text-[12px] font-bold text-[#7F5DF4] mb-0.5">JOHN DOE</div>
            <div className="text-gray-500 mb-4 pb-1 border-b border-gray-100">john.doe@email.com | New York, NY</div>
            <div className="font-bold mb-0.5">Hiring Manager</div>
            <div className="text-gray-600 mb-4">Google Inc.</div>
            <div className="font-bold mb-1">Dear Hiring Manager,</div>
            <p className="mb-2">I am writing to express my strong interest in the Software Engineer position at Google. With a solid foundation in computer science and a passion for building scalable systems, I am excited about the opportunity to contribute to your team.</p>
            <p className="mb-4">Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences can benefit Google.</p>
            <div>Sincerely,</div>
            <div className="font-bold mt-1">John Doe</div>
            <div className="absolute -right-4 top-20 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              95% ATS Score
            </div>
          </div>
          <div className="w-[380px] h-[520px] bg-white/60 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 p-8 absolute top-4 -left-10 transform -rotate-3 -z-10">
            <div className="w-16 h-4 bg-gray-300 mb-3 rounded-sm"></div>
            <div className="w-28 h-3 bg-gray-100 mb-8 rounded-sm"></div>
            <div className="w-full h-2.5 bg-gray-50 mb-2.5 rounded-sm"></div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="relative z-10 bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#F4F5F7] rounded-2xl p-10 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#7F5DF4]/5 rounded-full blur-2xl"></div>
              
              <span className="text-xs font-bold tracking-widest text-[#7F5DF4] uppercase">About The Project</span>
              <h2 className="text-4xl font-bold font-serif mt-2 mb-6 text-[#1A1F3A]">Smart Cover Letters, Faster.</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    The Cover Letter Generator is an intelligent tool designed to help professionals and students craft highly tailored cover letters. It analyzes your skills and the job description to generate a compelling narrative that passes ATS checks and catches the recruiter's eye.
                  </p>
                  <p className="text-base text-gray-500 leading-relaxed">
                    Our mission is to bridge the gap between talented individuals and their dream careers by removing the stress of application writing. We provide the tools to showcase your true potential in a language that recruiters and automated systems understand.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 flex flex-col justify-between h-full min-h-[200px]">
                  <div>
                    <div className="w-10 h-10 bg-[#7F5DF4]/10 text-[#7F5DF4] rounded-lg flex items-center justify-center mb-4">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-[#1A1F3A]">Tailored For You</h3>
                    <p className="text-sm text-gray-500">Every letter is unique and generated specifically for the job you want.</p>
                  </div>
                  <Link to="/signup" className="text-[#7F5DF4] font-medium text-sm inline-flex items-center mt-4 hover:text-[#6A4CE0]">
                    Try it now <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-[#F4F5F7] py-24 border-t border-gray-100">
        <div className="container mx-auto px-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#7F5DF4] uppercase">Why Choose Us</span>
            <h2 className="text-4xl font-bold font-serif mt-2 mb-4 text-[#1A1F3A]">Powerful Features</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Everything you need to create a winning application and land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
              <div className="w-12 h-12 bg-[#7F5DF4]/10 text-[#7F5DF4] rounded-lg flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#1A1F3A]">Smart Generation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Advanced automation writes persuasive, natural-sounding professional letters tailored to you.</p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
              <div className="w-12 h-12 bg-[#00B4D8]/10 text-[#00B4D8] rounded-lg flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#1A1F3A]">ATS Optimization</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Keyword matching ensures your letter gets past automated filters and seen by humans.</p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-50">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center mb-6">
                <Download size={24} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#1A1F3A]">Multi-Format Export</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Download your finished letter as a high-quality PDF or a raw text file instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="relative z-10 bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-[#7F5DF4] uppercase">Pick Your Style</span>
            <h2 className="text-4xl font-bold font-serif mt-2 mb-4 text-[#1A1F3A]">Professional Templates</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Choose from our library of 12+ expertly designed templates to match your industry and personality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 max-w-6xl mx-auto">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer flex flex-col h-full">
                <div 
                  className="bg-[#F4F5F7] p-6 rounded-xl border border-gray-100 group-hover:border-[#7F5DF4] transition-colors overflow-hidden mb-4 h-72 flex-shrink-0 relative"
                  onClick={() => setSelectedTemplate(template)}
                >
                  {renderTemplateContent(template)}
                  <div className="absolute inset-0 bg-[#1A1F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white text-[#1A1F3A] px-4 py-2 rounded-full flex items-center text-sm font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <ZoomIn size={16} className="mr-2" />
                      View Details
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[#1A1F3A] mb-1">{template.title}</h3>
                <p className="text-sm text-gray-500 flex-grow">{template.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 bg-gradient-to-br from-[#1A1F3A] via-[#2A1B54] to-[#1A1F3A] text-white py-24">
        <div className="container mx-auto px-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-[#7F5DF4] uppercase">Get Started Today</span>
            <h2 className="text-4xl md:text-5xl font-bold font-serif mt-2 mb-6">
              Land Your Dream Job — ATS-Ready in 60 Seconds
            </h2>
            <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Craft professional cover letters tailored to bypass Applicant Tracking Systems and impress hiring managers.
            </p>
            <Link to="/signup" className="inline-flex items-center bg-[#7F5DF4] text-white px-10 py-4 rounded-full font-bold hover:bg-[#6A4CE0] hover:shadow-lg transition-all group shadow-xl shadow-[#7F5DF4]/30 text-lg">
              Generate My Cover Letter
              <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-1/4 w-60 h-60 bg-[#7F5DF4]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#00B4D8]/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Detailed View Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-[#1A1F3A]/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#F4F5F7]">
              <div>
                <h3 className="text-xl font-bold text-[#1A1F3A]">{selectedTemplate.title}</h3>
                <p className="text-sm text-gray-500">{selectedTemplate.desc}</p>
              </div>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-[#F4F5F7] flex-grow flex items-center justify-center min-h-[400px]">
              <div className="w-[400px] h-[550px] bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200">
                {renderTemplateContent(selectedTemplate, true)}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white">
              <div className="text-sm text-gray-600">
                This is a preview of the <span className="font-bold">{selectedTemplate.title}</span> template.
              </div>
              <button 
                onClick={() => {
                  if (selectedTemplate) {
                    const templateType = selectedTemplate.type; // 'professional', 'minimal', or 'creative'
                    const templateColor = selectedTemplate.color; // hex color string
                    localStorage.setItem('preferred_template', templateType);
                    localStorage.setItem('preferred_template_color', templateColor);
                    if (user) {
                      navigate('/dashboard/generate');
                    } else {
                      navigate('/login');
                    }
                  }
                }}
                className="bg-[#7F5DF4] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#6A4CE0] transition-colors shadow-lg shadow-[#7F5DF4]/20 flex items-center"
              >
                Use This Template
                <ArrowRight size={14} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1A1F3A] text-white py-16 relative z-10 w-full mt-auto border-t border-gray-800">
        <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-2">
            {/* Custom Logo in Footer too */}
            <div className="flex items-center space-x-2 mb-4">
              <img src="/favicon.png" alt="Logo" className="w-8 h-8 flex-shrink-0" />
              <div className="text-lg font-bold">Cover Letter Generator</div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              We are passionate developers building tools to empower job seekers worldwide. Our mission is to make your job application journey smoother, more enjoyable, and ultimately more successful.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="text-gray-300 font-medium">Tell your friends about us</div>
              <div className="flex space-x-4 text-gray-400">
                <a href="#" className="hover:text-white transition-colors"><Mail size={18} /></a>
                <a href="#" className="hover:text-white transition-colors"><FileText size={18} /></a>
                <a href="#" className="hover:text-white transition-colors"><Zap size={18} /></a>
                <a href="#" className="hover:text-white transition-colors"><MessageSquare size={18} /></a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Product</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#templates" className="hover:text-white transition-colors">Cover Letter Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Smart Writer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ATS Checker</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-wider">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto px-10 mt-12 pt-6 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <div>© 2026 Cover Letter Generator. All rights reserved.</div>
          <div className="mt-4 md:mt-0 text-xs">
            Made with ❤️ for job seekers.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
