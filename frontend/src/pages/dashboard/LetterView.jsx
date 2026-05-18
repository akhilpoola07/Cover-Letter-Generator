import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Save, ArrowLeft, Check, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const LetterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const res = await api.get(`/cover-letters/${id}`);
        setLetter(res.data);
        setContent(res.data.generated_content);
      } catch (error) {
        toast.error('Failed to load cover letter');
        navigate('/dashboard/letters');
      } finally {
        setLoading(false);
      }
    };
    fetchLetter();
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/cover-letters/${id}`, { generated_content: content, status: 'final' });
      setLetter(prev => ({ ...prev, generated_content: content, status: 'final' }));
      setIsEditing(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (format = 'pdf') => {
    try {
      const res = await api.get(`/cover-letters/${id}/${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${letter.job_title || 'Cover_Letter'}.${format}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      toast.error(`Download failed for ${format.toUpperCase()}`);
    }
  };

  const renderDocumentPreview = () => {
    const templateColor = letter.template_color || '#7F5DF4';

    const firstName = letter.full_name ? letter.full_name.split(' ')[0].toUpperCase() : '';
    const lastName = letter.full_name ? letter.full_name.split(' ').slice(1).join(' ').toUpperCase() : '';

    if (letter.template_type === 'creative') {
      return (
        <div className="bg-white rounded-lg shadow-2xl flex min-h-[800px] overflow-hidden border border-gray-100 text-gray-800 animate-fade-in-up">
          {/* Left Sidebar */}
          <div className="w-1/4 text-white p-6 md:p-8 flex flex-col justify-between" style={{ backgroundColor: templateColor }}>
            <div>
              <div className="text-lg md:text-xl font-bold tracking-wider mb-1">{firstName}</div>
              <div className="text-lg md:text-xl font-bold tracking-wider">{lastName}</div>
              <div className="h-0.5 w-8 bg-white/40 mt-4"></div>
            </div>
            <div className="text-[10px] md:text-xs font-semibold tracking-wide uppercase opacity-90 leading-tight">
              {letter.current_job_title || letter.job_title}
            </div>
          </div>
          {/* Right Content */}
          <div className="w-3/4 p-8 md:p-12 overflow-y-auto bg-white">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[700px] resize-none focus:outline-none text-gray-900 bg-transparent font-sans"
                style={{ fontSize: '11pt', lineHeight: '1.6' }}
              />
            ) : (
              <div 
                className="whitespace-pre-wrap text-gray-900 font-sans"
                style={{ fontSize: '11pt', lineHeight: '1.6' }}
              >
                {content}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (letter.template_type === 'minimal') {
      return (
        <div 
          className="bg-white rounded-lg shadow-2xl p-8 md:p-12 text-gray-900 font-sans min-h-[800px] border-t-[8px] border-solid animate-fade-in-up" 
          style={{ borderTopColor: templateColor }}
        >
          <div className="mb-8 border-b border-gray-100 pb-6">
            <div className="text-xl md:text-2xl font-bold tracking-tight mb-1" style={{ color: templateColor }}>
              {letter.full_name?.toUpperCase()}
            </div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-semibold">
              {letter.current_job_title || letter.job_title}
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[600px] resize-none focus:outline-none text-gray-900 bg-transparent font-sans"
              style={{ fontSize: '11pt', lineHeight: '1.6' }}
            />
          ) : (
            <div 
              className="whitespace-pre-wrap text-gray-900 font-sans"
              style={{ fontSize: '11pt', lineHeight: '1.6' }}
            >
              {content}
            </div>
          )}
        </div>
      );
    }

    // Default 'professional' layout
    return (
      <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 text-gray-900 font-sans min-h-[800px] border border-gray-100 animate-fade-in-up">
        <div className="mb-8 border-b border-gray-100 pb-6">
          <div className="text-2xl md:text-3xl font-bold tracking-wide mb-1" style={{ color: templateColor }}>
            {letter.full_name}
          </div>
          <div className="text-xs md:text-sm text-gray-500 font-medium flex items-center space-x-2">
            <span>{letter.email}</span>
            {letter.phone && (
              <>
                <span className="text-gray-300">•</span>
                <span>{letter.phone}</span>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[650px] resize-none focus:outline-none text-gray-900 bg-transparent font-sans"
            style={{ fontSize: '11pt', lineHeight: '1.6' }}
          />
        ) : (
          <div 
            className="whitespace-pre-wrap text-gray-900 font-sans"
            style={{ fontSize: '11pt', lineHeight: '1.6' }}
          >
            {content}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto"></div></div>;
  if (!letter) return null;

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-fade-in-up">
      <div className="flex items-center text-textMuted hover:text-accent cursor-pointer mb-6 transition-colors w-fit" onClick={() => navigate('/dashboard/letters')}>
        <ArrowLeft size={18} className="mr-2" />
        Back to Letters
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif mb-2">{letter.job_title}</h1>
          <div className="text-lg text-accent flex items-center">
            {letter.company_name}
            <span className="mx-3 text-gray-600">•</span>
            <span className="text-sm text-textMuted">{new Date(letter.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center">
              <Save size={18} className="mr-2" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center bg-surface">
              <Edit size={18} className="mr-2" /> Edit Letter
            </button>
          )}
          <button onClick={() => handleDownload('pdf')} className="btn-primary flex items-center bg-gray-100 text-gray-900 hover:bg-white border-none shadow-md shadow-white/10">
            <Download size={18} className="mr-2" /> PDF
          </button>
          <button onClick={() => handleDownload('docx')} className="btn-primary flex items-center bg-[#7F5DF4]/10 text-[#7F5DF4] hover:bg-[#7F5DF4]/20 border-none shadow-md shadow-white/10">
            <Download size={18} className="mr-2" /> DOCX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Document Preview */}
        <div className="lg:col-span-3">
          {renderDocumentPreview()}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4 flex items-center"><FileText size={18} className="mr-2 text-accent" /> Document Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-textMuted">Word Count</span>
                <span className="font-medium">{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMuted">Reading Time</span>
                <span className="font-medium">{Math.ceil(content.split(/\s+/).length / 200)} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMuted">Tone</span>
                <span className="font-medium capitalize">{letter.tone}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4 flex items-center"><Check size={18} className="mr-2 text-green-500" /> ATS Analysis</h3>
            <div className="mb-4">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm text-textMuted">Match Score</span>
                <span className="text-2xl font-bold text-green-500">{letter.ats_score}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${letter.ats_score}%` }}></div>
              </div>
            </div>
            <p className="text-xs text-textMuted leading-relaxed">
              This letter has been optimized with keywords from the job description. Review carefully before downloading.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Edit icon for non-editing mode
const Edit = ({size, className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export default LetterView;
