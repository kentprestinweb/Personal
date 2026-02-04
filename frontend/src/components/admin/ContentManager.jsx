import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Image,
  Type,
  Link,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContentManager = ({ onClose }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [expandedSection, setExpandedSection] = useState("hero");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API}/admin/content`, getAuthHeaders());
      setContent(res.data);
    } catch (err) {
      showMessage("error", "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/content`, content, getAuthHeaders());
      showMessage("success", "Content saved successfully!");
    } catch (err) {
      showMessage("error", "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API}/admin/upload`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url}`;
      setContent({ ...content, [field]: imageUrl });
      showMessage("success", "Image uploaded!");
    } catch (err) {
      showMessage("error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API}/admin/upload`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = `${process.env.REACT_APP_BACKEND_URL}${res.data.url}`;
      setContent({
        ...content,
        gallery_images: [...(content.gallery_images || []), imageUrl],
      });
      showMessage("success", "Image added to gallery!");
    } catch (err) {
      showMessage("error", "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newImages = content.gallery_images.filter((_, i) => i !== index);
    setContent({ ...content, gallery_images: newImages });
  };

  const updateField = (field, value) => {
    setContent({ ...content, [field]: value });
  };

  const Section = ({ id, title, icon: Icon, children }) => (
    <div className="border border-maize-gold/20 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full px-4 py-3 flex items-center justify-between bg-cream-paper hover:bg-maize-gold/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-saffron-blaze" />
          <span className="font-sans font-medium text-deep-char">{title}</span>
        </div>
        {expandedSection === id ? (
          <ChevronUp className="w-5 h-5 text-deep-char/50" />
        ) : (
          <ChevronDown className="w-5 h-5 text-deep-char/50" />
        )}
      </button>
      {expandedSection === id && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder, multiline = false }) => (
    <div>
      <label className="block text-sm font-sans text-deep-char/70 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans text-sm resize-none"
          rows={3}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50">
        <div className="bg-cream-paper p-8 rounded-2xl">
          <p className="font-sans text-deep-char">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-paper rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-maize-gold/20 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-serif text-deep-char">Edit Website Content</h2>
          <button onClick={onClose} className="p-2 hover:bg-maize-gold/20 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mx-4 mt-4 px-4 py-2 rounded-lg text-sm font-sans ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Hero Section */}
          <Section id="hero" title="Hero Section" icon={Image}>
            <InputField
              label="Main Headline"
              value={content.hero_headline}
              onChange={(v) => updateField("hero_headline", v)}
              placeholder="Where Indian Spices Meet Mexican Soul"
            />
            <InputField
              label="Tagline"
              value={content.hero_tagline}
              onChange={(v) => updateField("hero_tagline", v)}
              multiline
              placeholder="Experience the perfect fusion..."
            />
            <div>
              <label className="block text-sm font-sans text-deep-char/70 mb-1">Hero Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content.hero_image || ""}
                  onChange={(e) => updateField("hero_image", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans text-sm"
                  placeholder="Image URL"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleImageUpload(e, "hero_image")}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-2 bg-saffron-blaze text-white rounded-lg hover:bg-chili-red transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
            <InputField
              label="Uber Eats URL"
              value={content.hero_uber_eats_url}
              onChange={(v) => updateField("hero_uber_eats_url", v)}
              type="url"
              placeholder="https://ubereats.com/..."
            />
            <InputField
              label="DoorDash URL"
              value={content.hero_doordash_url}
              onChange={(v) => updateField("hero_doordash_url", v)}
              type="url"
              placeholder="https://doordash.com/..."
            />
          </Section>

          {/* About Section */}
          <Section id="about" title="About Section" icon={Type}>
            <InputField
              label="Section Label"
              value={content.about_label}
              onChange={(v) => updateField("about_label", v)}
              placeholder="Our Story"
            />
            <InputField
              label="Headline"
              value={content.about_headline}
              onChange={(v) => updateField("about_headline", v)}
              placeholder="A Flavourful Journey..."
            />
            <InputField
              label="Paragraph 1"
              value={content.about_text_1}
              onChange={(v) => updateField("about_text_1", v)}
              multiline
              placeholder="First paragraph of your story..."
            />
            <InputField
              label="Paragraph 2"
              value={content.about_text_2}
              onChange={(v) => updateField("about_text_2", v)}
              multiline
              placeholder="Second paragraph of your story..."
            />
          </Section>

          {/* Gallery Section */}
          <Section id="gallery" title="Gallery Section" icon={Image}>
            <InputField
              label="Section Label"
              value={content.gallery_label}
              onChange={(v) => updateField("gallery_label", v)}
              placeholder="Gallery"
            />
            <InputField
              label="Headline"
              value={content.gallery_headline}
              onChange={(v) => updateField("gallery_headline", v)}
              placeholder="A Feast for the Eyes"
            />
            <InputField
              label="Description"
              value={content.gallery_description}
              onChange={(v) => updateField("gallery_description", v)}
              multiline
              placeholder="Gallery description..."
            />
            <div>
              <label className="block text-sm font-sans text-deep-char/70 mb-2">Gallery Images</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {(content.gallery_images || []).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-lg border-2 border-dashed border-maize-gold/30 flex items-center justify-center hover:border-saffron-blaze hover:bg-saffron-blaze/5 transition-colors"
                >
                  <Plus className="w-6 h-6 text-deep-char/40" />
                </button>
              </div>
            </div>
          </Section>

          {/* Contact Section */}
          <Section id="contact" title="Contact Section" icon={MapPin}>
            <InputField
              label="Section Label"
              value={content.contact_label}
              onChange={(v) => updateField("contact_label", v)}
              placeholder="Visit Us"
            />
            <InputField
              label="Headline"
              value={content.contact_headline}
              onChange={(v) => updateField("contact_headline", v)}
              placeholder="Come Say Hello"
            />
            <InputField
              label="Address"
              value={content.contact_address}
              onChange={(v) => updateField("contact_address", v)}
              placeholder="123 Main St..."
            />
            <InputField
              label="Phone"
              value={content.contact_phone}
              onChange={(v) => updateField("contact_phone", v)}
              placeholder="0400 000 000"
            />
            <InputField
              label="Email"
              value={content.contact_email}
              onChange={(v) => updateField("contact_email", v)}
              type="email"
              placeholder="hello@example.com"
            />
            <InputField
              label="Business Hours"
              value={content.contact_hours}
              onChange={(v) => updateField("contact_hours", v)}
              placeholder="Open daily from 5:00 PM"
            />
            <InputField
              label="Google Maps Embed URL"
              value={content.contact_map_embed}
              onChange={(v) => updateField("contact_map_embed", v)}
              type="url"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </Section>

          {/* Footer & Social */}
          <Section id="footer" title="Footer & Social Links" icon={Link}>
            <InputField
              label="Footer Tagline"
              value={content.footer_tagline}
              onChange={(v) => updateField("footer_tagline", v)}
              placeholder="Where Indian Spices Meet Mexican Soul"
            />
            <InputField
              label="Footer Description"
              value={content.footer_description}
              onChange={(v) => updateField("footer_description", v)}
              multiline
              placeholder="Short description for footer..."
            />
            <InputField
              label="Facebook URL"
              value={content.facebook_url}
              onChange={(v) => updateField("facebook_url", v)}
              type="url"
              placeholder="https://facebook.com/..."
            />
          </Section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-maize-gold/20 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-maize-gold/30 rounded-xl font-sans hover:bg-maize-gold/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-3 bg-saffron-blaze text-white rounded-xl font-sans font-medium hover:bg-chili-red transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
