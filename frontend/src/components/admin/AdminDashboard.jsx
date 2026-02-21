import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Save,
  Mail,
  Code,
  Users,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { LogoIcon } from '../Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [content, setContent] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sectionVisibility, setSectionVisibility] = useState({
    about: true,
    services: true,
    portfolio: true,
    testimonials: true,
    contact: true
  });

  const token = localStorage.getItem('admin_token');

  const verifyAuth = useCallback(async () => {
    if (!token) {
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        localStorage.removeItem('admin_token');
        navigate('/admin');
      }
    } catch (err) {
      navigate('/admin');
    }
  }, [token, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [statsRes, contentRes, portfolioRes, servicesRes, testimonialsRes, skillsRes, messagesRes, visibilityRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/content`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/portfolio`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/services`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/testimonials`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/skills`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/messages`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/section-visibility`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (contentRes.ok) setContent(await contentRes.json());
      if (portfolioRes.ok) setPortfolio(await portfolioRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
      if (skillsRes.ok) setSkills(await skillsRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (visibilityRes.ok) setSectionVisibility(await visibilityRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifyAuth();
    fetchData();
  }, [verifyAuth, fetchData]);

  const handleLogout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      navigate('/admin');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'visibility', label: 'Section Visibility', icon: Eye },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Code },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'skills', label: 'Skills', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-dark-800 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-dark-800">
            <div className="flex items-center gap-3">
              <LogoIcon className="w-10 h-10" />
              <div>
                <div className="text-sm font-bold bg-gradient-to-r from-teal-400 via-electric-blue-400 to-coral-400 bg-clip-text text-transparent">
                  KAP Admin
                </div>
                <div className="text-xs text-dark-500">Portfolio Manager</div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-teal-500/20 text-teal-400'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-dark-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-dark-900 border-b border-dark-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-dark-400 hover:text-white"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-semibold text-white capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Overview' : activeTab}
            </h1>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab stats={stats} messages={messages} />}
              {activeTab === 'visibility' && <VisibilityTab visibility={sectionVisibility} token={token} onUpdate={fetchData} />}
              {activeTab === 'content' && <ContentTab content={content} token={token} onUpdate={fetchData} />}
              {activeTab === 'portfolio' && <PortfolioTab portfolio={portfolio} token={token} onUpdate={fetchData} />}
              {activeTab === 'services' && <ServicesTab services={services} token={token} onUpdate={fetchData} />}
              {activeTab === 'testimonials' && <TestimonialsTab testimonials={testimonials} token={token} onUpdate={fetchData} />}
              {activeTab === 'skills' && <SkillsTab skills={skills} token={token} onUpdate={fetchData} />}
              {activeTab === 'messages' && <MessagesTab messages={messages} token={token} onUpdate={fetchData} />}
              {activeTab === 'settings' && <SettingsTab token={token} />}
            </>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Dashboard Tab
function DashboardTab({ stats, messages }) {
  const statCards = [
    { label: 'Portfolio Projects', value: stats?.portfolio || 0, icon: Briefcase, color: 'teal' },
    { label: 'Services', value: stats?.services || 0, icon: Code, color: 'electric-blue' },
    { label: 'Testimonials', value: stats?.testimonials || 0, icon: Star, color: 'coral' },
    { label: 'Messages', value: stats?.messages || 0, icon: Mail, color: 'teal' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-400`} size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-dark-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
        {messages?.length > 0 ? (
          <div className="space-y-4">
            {messages.slice(0, 5).map((msg) => (
              <div key={msg.id} className="flex items-start gap-4 p-4 bg-dark-800/50 rounded-xl">
                <div className="w-10 h-10 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-400 font-semibold">{msg.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{msg.name}</p>
                  <p className="text-dark-400 text-sm truncate">{msg.email}</p>
                  <p className="text-dark-300 text-sm mt-1 line-clamp-2">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark-400 text-center py-8">No messages yet</p>
        )}
      </div>
    </div>
  );
}

// Section Visibility Tab
function VisibilityTab({ visibility, token, onUpdate }) {
  const [formData, setFormData] = useState(visibility || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (visibility) setFormData(visibility);
  }, [visibility]);

  const sections = [
    { key: 'about', label: 'About Me', description: 'Your bio, skills, and experience section' },
    { key: 'services', label: 'Services', description: 'The services you offer to clients' },
    { key: 'portfolio', label: 'Portfolio', description: 'Your work samples and projects' },
    { key: 'testimonials', label: 'Testimonials', description: 'Client reviews and feedback' },
    { key: 'contact', label: 'Contact', description: 'Contact form for enquiries' },
  ];

  const handleToggle = (key) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/section-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMessage('Visibility settings saved!');
        onUpdate();
      } else {
        setMessage('Failed to save settings');
      }
    } catch (err) {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye className="text-teal-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Section Visibility</h2>
            <p className="text-dark-400">
              Hide sections that are still in progress. Hidden sections will appear blurred with a "Coming Soon" message to visitors.
            </p>
          </div>
        </div>
      </div>

      {/* Section Toggles */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <div className="space-y-4">
          {sections.map((section) => (
            <div 
              key={section.key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                formData[section.key] 
                  ? 'bg-teal-500/10 border-teal-500/30' 
                  : 'bg-dark-800/50 border-dark-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  formData[section.key] ? 'bg-teal-500/20' : 'bg-dark-700'
                }`}>
                  {formData[section.key] ? (
                    <Eye className="text-teal-400" size={20} />
                  ) : (
                    <EyeOff className="text-dark-500" size={20} />
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${formData[section.key] ? 'text-white' : 'text-dark-400'}`}>
                    {section.label}
                  </h3>
                  <p className="text-dark-500 text-sm">{section.description}</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                onClick={() => handleToggle(section.key)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  formData[section.key] ? 'bg-teal-500' : 'bg-dark-700'
                }`}
              >
                <span 
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    formData[section.key] ? 'translate-x-8' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-dark-800">
          {message && (
            <p className={`text-sm ${message.includes('success') ? 'text-teal-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-electric-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-coral-500/10 border border-coral-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-coral-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <EyeOff className="text-coral-400" size={16} />
          </div>
          <div>
            <h4 className="text-coral-400 font-semibold mb-1">How it works</h4>
            <p className="text-dark-400 text-sm">
              When you hide a section, visitors will see a blurred version with a "Coming Soon" message. 
              This lets you show your site to clients while still working on certain areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Tab
function ContentTab({ content, token, onUpdate }) {
  const [formData, setFormData] = useState(content || {});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMessage('Content saved successfully!');
        onUpdate();
      } else {
        setMessage('Failed to save content');
      }
    } catch (err) {
      setMessage('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: 'Hero Section',
      fields: [
        { name: 'hero_name', label: 'Name', type: 'text' },
        { name: 'hero_title', label: 'Title', type: 'text' },
        { name: 'hero_subtitle', label: 'Subtitle', type: 'text' },
        { name: 'hero_tagline', label: 'Tagline', type: 'textarea' },
        { name: 'hero_cta_text', label: 'CTA Button Text', type: 'text' },
        { name: 'hero_cta_url', label: 'CTA Button URL', type: 'text' },
      ]
    },
    {
      title: 'About Section',
      fields: [
        { name: 'about_label', label: 'Section Label', type: 'text' },
        { name: 'about_headline', label: 'Headline', type: 'text' },
        { name: 'about_bio', label: 'Bio Paragraph 1', type: 'textarea' },
        { name: 'about_bio_2', label: 'Bio Paragraph 2', type: 'textarea' },
        { name: 'about_years_experience', label: 'Years Experience', type: 'text' },
        { name: 'about_projects_completed', label: 'Projects Completed', type: 'text' },
        { name: 'about_clients_satisfied', label: 'Happy Clients', type: 'text' },
      ]
    },
    {
      title: 'Contact Section',
      fields: [
        { name: 'contact_label', label: 'Section Label', type: 'text' },
        { name: 'contact_headline', label: 'Headline', type: 'text' },
        { name: 'contact_description', label: 'Description', type: 'textarea' },
        { name: 'contact_email', label: 'Email', type: 'email' },
        { name: 'contact_phone', label: 'Phone', type: 'text' },
        { name: 'contact_location', label: 'Location', type: 'text' },
      ]
    },
    {
      title: 'Social Links',
      fields: [
        { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
        { name: 'github_url', label: 'GitHub URL', type: 'url' },
        { name: 'twitter_url', label: 'Twitter/X URL', type: 'url' },
        { name: 'facebook_url', label: 'Facebook URL', type: 'url' },
        { name: 'instagram_url', label: 'Instagram URL', type: 'url' },
      ]
    },
    {
      title: 'Footer',
      fields: [
        { name: 'footer_tagline', label: 'Tagline', type: 'text' },
        { name: 'footer_copyright', label: 'Copyright Text', type: 'text' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-xl ${
          message.includes('success') ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {message}
        </div>
      )}

      {sections.map((section, idx) => (
        <div key={idx} className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">{section.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {section.fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-teal-500"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-teal-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-electric-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
      >
        <Save size={18} />
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}

// Portfolio Tab
function PortfolioTab({ portfolio, token, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    live_url: '',
    technologies: '',
    featured: false,
    order: 0
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });
      const data = await response.json();
      if (response.ok) {
        setFormData(prev => ({ ...prev, thumbnail_url: `${BACKEND_URL}${data.url}` }));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      order: parseInt(formData.order) || 0
    };

    try {
      const url = editingId 
        ? `${BACKEND_URL}/api/admin/portfolio/${editingId}`
        : `${BACKEND_URL}/api/admin/portfolio`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        resetForm();
        onUpdate();
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      thumbnail_url: project.thumbnail_url || '',
      live_url: project.live_url || '',
      technologies: project.technologies?.join(', ') || '',
      featured: project.featured || false,
      order: project.order || 0
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetch(`${BACKEND_URL}/api/admin/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      onUpdate();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail_url: '',
      live_url: '',
      technologies: '',
      featured: false,
      order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Portfolio Projects</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-teal-500 text-white rounded-xl flex items-center gap-2 hover:bg-teal-600 transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-6">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Thumbnail</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    placeholder="Image URL or upload"
                    className="flex-1 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                  <label className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-300 hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                {formData.thumbnail_url && (
                  <img src={formData.thumbnail_url} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Live URL</label>
                <input
                  type="url"
                  name="live_url"
                  value={formData.live_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Technologies (comma separated)</label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, FastAPI, MongoDB"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-24 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 text-dark-300 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-dark-700 bg-dark-800 text-teal-500 focus:ring-teal-500"
                    />
                    Featured Project
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                >
                  {saving ? 'Saving...' : (editingId ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-dark-800 text-white rounded-xl hover:bg-dark-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((project) => (
          <div key={project.id} className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden">
            <div className="h-40 bg-dark-800">
              {project.thumbnail_url ? (
                <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-500">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-semibold text-white">{project.title}</h4>
                {project.featured && (
                  <span className="px-2 py-1 bg-coral-500/20 text-coral-400 text-xs rounded-full">Featured</span>
                )}
              </div>
              <p className="text-dark-400 text-sm line-clamp-2 mb-4">{project.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-dark-400 hover:text-teal-400 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {portfolio.length === 0 && (
        <p className="text-center text-dark-400 py-12">No portfolio projects yet. Add your first project!</p>
      )}
    </div>
  );
}

// Services Tab - Similar structure to Portfolio
function ServicesTab({ services, token, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'code', order: 0 });
  const [saving, setSaving] = useState(false);

  const iconOptions = ['globe', 'smartphone', 'shopping-cart', 'settings', 'code', 'paintbrush', 'database', 'rocket'];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${BACKEND_URL}/api/admin/services/${editingId}` : `${BACKEND_URL}/api/admin/services`;
      await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, order: parseInt(formData.order) || 0 })
      });
      resetForm();
      onUpdate();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setFormData({ title: service.title, description: service.description, icon: service.icon, order: service.order });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await fetch(`${BACKEND_URL}/api/admin/services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    onUpdate();
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', icon: 'code', order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Services</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-teal-500 text-white rounded-xl flex items-center gap-2">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-6">{editingId ? 'Edit' : 'Add'} Service</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-dark-300 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Icon</label>
                <select name="icon" value={formData.icon} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white">
                  {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-dark-300 mb-2">Order</label>
                <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-24 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-teal-500 text-white rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-dark-800 text-white rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.id} className="bg-dark-900 border border-dark-800 rounded-xl p-4 flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-white">{service.title}</h4>
              <p className="text-dark-400 text-sm mt-1">{service.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(service)} className="p-2 text-dark-400 hover:text-teal-400"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(service.id)} className="p-2 text-dark-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Testimonials Tab
function TestimonialsTab({ testimonials, token, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ author: '', role: '', company: '', text: '', rating: 5, order: 0 });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${BACKEND_URL}/api/admin/testimonials/${editingId}` : `${BACKEND_URL}/api/admin/testimonials`;
      await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, rating: parseInt(formData.rating), order: parseInt(formData.order) || 0 })
      });
      resetForm();
      onUpdate();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t) => {
    setFormData({ author: t.author, role: t.role, company: t.company || '', text: t.text, rating: t.rating, order: t.order });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await fetch(`${BACKEND_URL}/api/admin/testimonials/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    onUpdate();
  };

  const resetForm = () => {
    setFormData({ author: '', role: '', company: '', text: '', rating: 5, order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Testimonials</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-teal-500 text-white rounded-xl flex items-center gap-2">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-white mb-6">{editingId ? 'Edit' : 'Add'} Testimonial</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-dark-300 mb-2">Author</label><input type="text" name="author" value={formData.author} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm text-dark-300 mb-2">Role</label><input type="text" name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" placeholder="Business Owner" /></div>
              <div><label className="block text-sm text-dark-300 mb-2">Company (optional)</label><input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm text-dark-300 mb-2">Testimonial Text</label><textarea name="text" value={formData.text} onChange={handleChange} required rows={4} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm text-dark-300 mb-2">Rating (1-5)</label><input type="number" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-24 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" /></div>
              <div className="flex gap-4">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-teal-500 text-white rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-dark-800 text-white rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-dark-900 border border-dark-800 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-dark-300 italic mb-2">"{t.text}"</p>
                <p className="text-white font-semibold">{t.author}</p>
                <p className="text-dark-400 text-sm">{t.role}{t.company && ` at ${t.company}`}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="p-2 text-dark-400 hover:text-teal-400"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-dark-400 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-center text-dark-400 py-8">No testimonials yet</p>}
      </div>
    </div>
  );
}

// Skills Tab
function SkillsTab({ skills, token, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'frontend', order: 0 });
  const [saving, setSaving] = useState(false);

  const categories = ['frontend', 'backend', 'tools', 'other'];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `${BACKEND_URL}/api/admin/skills/${editingId}` : `${BACKEND_URL}/api/admin/skills`;
      await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, order: parseInt(formData.order) || 0 })
      });
      resetForm();
      onUpdate();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setFormData({ name: skill.name, category: skill.category, order: skill.order });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await fetch(`${BACKEND_URL}/api/admin/skills/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    onUpdate();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'frontend', order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Skills</h2>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-teal-500 text-white rounded-xl flex items-center gap-2">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-6">{editingId ? 'Edit' : 'Add'} Skill</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-dark-300 mb-2">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" placeholder="React" /></div>
              <div><label className="block text-sm text-dark-300 mb-2">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white">
                {categories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
              </select></div>
              <div><label className="block text-sm text-dark-300 mb-2">Order</label><input type="number" name="order" value={formData.order} onChange={handleChange} className="w-24 px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" /></div>
              <div className="flex gap-4">
                <button type="submit" disabled={saving} className="px-6 py-3 bg-teal-500 text-white rounded-xl">{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={resetForm} className="px-6 py-3 bg-dark-800 text-white rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category} className="bg-dark-900 border border-dark-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4 capitalize">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map(skill => (
              <div key={skill.id} className="group flex items-center gap-2 px-3 py-2 bg-dark-800 rounded-lg">
                <span className="text-dark-300">{skill.name}</span>
                <button onClick={() => handleEdit(skill)} className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-teal-400 transition-opacity"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(skill.id)} className="opacity-0 group-hover:opacity-100 text-dark-400 hover:text-red-400 transition-opacity"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Messages Tab
function MessagesTab({ messages, token, onUpdate }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await fetch(`${BACKEND_URL}/api/admin/messages/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Contact Messages ({messages.length})</h2>
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-white font-semibold">{msg.name}</h4>
                <p className="text-teal-400 text-sm">{msg.email}</p>
                {msg.subject && <p className="text-dark-400 text-sm mt-1">Subject: {msg.subject}</p>}
              </div>
              <button onClick={() => handleDelete(msg.id)} className="p-2 text-dark-400 hover:text-red-400"><Trash2 size={18} /></button>
            </div>
            <p className="text-dark-300">{msg.message}</p>
            <p className="text-dark-500 text-xs mt-4">{new Date(msg.created_at).toLocaleString()}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-dark-400 py-12">No messages yet</p>}
      </div>
    </div>
  );
}

// Settings Tab
function SettingsTab({ token }) {
  const [formData, setFormData] = useState({ current_password: '', new_username: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Credentials updated successfully!');
        setFormData({ current_password: '', new_username: '', new_password: '' });
      } else {
        setMessage(data.detail || 'Failed to update credentials');
      }
    } catch (err) {
      setMessage('Error updating credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Change Admin Credentials</h3>
        {message && (
          <div className={`p-4 rounded-xl mb-6 ${message.includes('success') ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-300 mb-2">Current Password *</label>
            <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} required className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-2">New Username (optional)</label>
            <input type="text" name="new_username" value={formData.new_username} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-2">New Password (optional)</label>
            <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white" />
          </div>
          <button type="submit" disabled={saving} className="w-full px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl">
            {saving ? 'Updating...' : 'Update Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
}
