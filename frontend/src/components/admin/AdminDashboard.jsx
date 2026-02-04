import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  Settings,
  X,
  Check,
  Image,
  Flame,
  Leaf,
  Star,
  Ban,
  ChevronDown,
  Menu,
  Upload,
  Link,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "most-ordered",
    image_url: "",
    is_vegetarian: false,
    is_spicy: false,
    is_popular: false,
  });
  const [settingsData, setSettingsData] = useState({
    current_password: "",
    new_username: "",
    new_password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [imageInputType, setImageInputType] = useState("url"); // "url" or "file"
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  useEffect(() => {
    verifyAndFetch();
  }, []);

  const verifyAndFetch = async () => {
    try {
      await axios.get(`${API}/admin/verify`, getAuthHeaders());
      await fetchData();
    } catch {
      localStorage.removeItem("adminToken");
      navigate("/admin");
    }
  };

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(`${API}/admin/menu`, getAuthHeaders()),
        axios.get(`${API}/admin/categories`, getAuthHeaders()),
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      showMessage("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/admin/logout`, {}, getAuthHeaders());
    } catch {}
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "most-ordered",
      image_url: "",
      is_vegetarian: false,
      is_spicy: false,
      is_popular: false,
    });
    setImageInputType("url");
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image_url: item.image_url || "",
      is_vegetarian: item.is_vegetarian,
      is_spicy: item.is_spicy,
      is_popular: item.is_popular,
    });
    setImageInputType("url");
    setImagePreview(item.image_url || "");
    setShowModal(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showMessage("error", "Invalid file type. Use JPEG, PNG, WebP, or GIF");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage("error", "File too large. Maximum size is 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await axios.post(`${API}/admin/upload`, uploadData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });

      // Construct full URL for the uploaded image
      const baseUrl = process.env.REACT_APP_BACKEND_URL;
      const imageUrl = `${baseUrl}${response.data.url}`;
      setFormData({ ...formData, image_url: imageUrl });
      showMessage("success", "Image uploaded successfully");
    } catch (err) {
      showMessage("error", err.response?.data?.detail || "Failed to upload image");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingItem) {
        await axios.put(`${API}/admin/menu/${editingItem.id}`, data, getAuthHeaders());
        showMessage("success", "Item updated successfully");
      } else {
        await axios.post(`${API}/admin/menu`, data, getAuthHeaders());
        showMessage("success", "Item created successfully");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showMessage("error", err.response?.data?.detail || "Operation failed");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/admin/menu/${item.id}`, getAuthHeaders());
      showMessage("success", "Item deleted");
      fetchData();
    } catch (err) {
      showMessage("error", "Failed to delete item");
    }
  };

  const toggleSoldOut = async (item) => {
    try {
      await axios.put(
        `${API}/admin/menu/${item.id}`,
        { is_sold_out: !item.is_sold_out },
        getAuthHeaders()
      );
      fetchData();
    } catch (err) {
      showMessage("error", "Failed to update item");
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/admin/credentials`, settingsData, getAuthHeaders());
      showMessage("success", "Credentials updated successfully");
      setShowSettings(false);
      setSettingsData({ current_password: "", new_username: "", new_password: "" });
    } catch (err) {
      showMessage("error", err.response?.data?.detail || "Failed to update credentials");
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-paper flex items-center justify-center">
        <div className="text-deep-char font-sans">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-paper">
      {/* Header */}
      <header className="bg-deep-char text-cream-paper sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-cream-paper/10 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-serif">
              Taco's <span className="text-saffron-blaze">&</span> Things
              <span className="text-sm font-sans text-cream-paper/60 ml-2">Admin</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-cream-paper/10 rounded-lg transition-colors"
              title="Settings"
              data-testid="settings-btn"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-saffron-blaze rounded-lg hover:bg-chili-red transition-colors"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-xl shadow-lg font-sans ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-deep-char/60 text-sm font-sans">Total Items</p>
            <p className="text-2xl font-serif text-deep-char">{menuItems.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-deep-char/60 text-sm font-sans">Categories</p>
            <p className="text-2xl font-serif text-deep-char">{categories.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-deep-char/60 text-sm font-sans">Popular Items</p>
            <p className="text-2xl font-serif text-deep-char">
              {menuItems.filter((i) => i.is_popular).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-deep-char/60 text-sm font-sans">Sold Out</p>
            <p className="text-2xl font-serif text-deep-char">
              {menuItems.filter((i) => i.is_sold_out).length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-char/40" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
              data-testid="search-input"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full md:w-48 px-4 py-3 pr-10 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans cursor-pointer"
              data-testid="category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-char/40 pointer-events-none" />
          </div>

          {/* Add Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-saffron-blaze text-white rounded-xl font-sans font-medium hover:bg-chili-red transition-colors"
            data-testid="add-item-btn"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                item.is_sold_out ? "opacity-60" : ""
              }`}
              data-testid={`menu-item-card-${item.id}`}
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-100">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-deep-char/30">
                    <Image className="w-12 h-12" />
                  </div>
                )}
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {item.is_popular && (
                    <span className="bg-maize-gold text-deep-char px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                    </span>
                  )}
                  {item.is_spicy && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                    </span>
                  )}
                  {item.is_vegetarian && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                    </span>
                  )}
                </div>
                {item.is_sold_out && (
                  <div className="absolute inset-0 bg-deep-char/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-lg text-deep-char line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="font-sans font-bold text-saffron-blaze">
                    A${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-deep-char/60 font-sans line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans text-deep-char/40 bg-cream-paper px-2 py-1 rounded">
                    {categories.find((c) => c.id === item.category)?.name || item.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSoldOut(item)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.is_sold_out
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={item.is_sold_out ? "Mark Available" : "Mark Sold Out"}
                    >
                      {item.is_sold_out ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit"
                      data-testid={`edit-btn-${item.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete"
                      data-testid={`delete-btn-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-deep-char/60 font-sans">
            No menu items found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50 p-4">
          <div className="bg-cream-paper rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-cream-paper p-4 border-b border-maize-gold/20 flex justify-between items-center">
              <h2 className="text-xl font-serif text-deep-char">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-maize-gold/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans text-deep-char/70 mb-1">
                    Price (A$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans text-deep-char/70 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-2">
                  Image
                </label>
                
                {/* Toggle between URL and File upload */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputType("url")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-sans transition-colors ${
                      imageInputType === "url"
                        ? "bg-saffron-blaze text-white"
                        : "bg-gray-100 text-deep-char/70 hover:bg-gray-200"
                    }`}
                  >
                    <Link className="w-4 h-4" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType("file")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-sans transition-colors ${
                      imageInputType === "file"
                        ? "bg-saffron-blaze text-white"
                        : "bg-gray-100 text-deep-char/70 hover:bg-gray-200"
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                </div>

                {imageInputType === "url" ? (
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => {
                      setFormData({ ...formData, image_url: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                    placeholder="https://..."
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full px-4 py-3 rounded-xl border-2 border-dashed border-maize-gold/30 bg-white hover:border-saffron-blaze hover:bg-saffron-blaze/5 transition-colors font-sans text-deep-char/60 flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-saffron-blaze border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Click to select image
                        </>
                      )}
                    </button>
                    <p className="text-xs text-deep-char/50 mt-1 font-sans">
                      Max 5MB. Formats: JPEG, PNG, WebP, GIF
                    </p>
                  </div>
                )}

                {/* Image Preview */}
                {(imagePreview || formData.image_url) && (
                  <div className="mt-3 relative">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-xl border border-maize-gold/20"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image_url: "" });
                        setImagePreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Badges */}
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-2">
                  Badges
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                      className="w-4 h-4 rounded border-maize-gold/30 text-saffron-blaze focus:ring-saffron-blaze"
                    />
                    <Star className="w-4 h-4 text-maize-gold" />
                    <span className="font-sans text-sm">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_spicy}
                      onChange={(e) => setFormData({ ...formData, is_spicy: e.target.checked })}
                      className="w-4 h-4 rounded border-maize-gold/30 text-saffron-blaze focus:ring-saffron-blaze"
                    />
                    <Flame className="w-4 h-4 text-red-500" />
                    <span className="font-sans text-sm">Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_vegetarian}
                      onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                      className="w-4 h-4 rounded border-maize-gold/30 text-saffron-blaze focus:ring-saffron-blaze"
                    />
                    <Leaf className="w-4 h-4 text-green-500" />
                    <span className="font-sans text-sm">Vegetarian</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-maize-gold/30 rounded-xl font-sans hover:bg-maize-gold/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-saffron-blaze text-white rounded-xl font-sans font-medium hover:bg-chili-red transition-colors"
                  data-testid="save-item-btn"
                >
                  {editingItem ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50 p-4">
          <div className="bg-cream-paper rounded-2xl w-full max-w-md">
            <div className="p-4 border-b border-maize-gold/20 flex justify-between items-center">
              <h2 className="text-xl font-serif text-deep-char">Change Credentials</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-maize-gold/20 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSettingsSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={settingsData.current_password}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, current_password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-1">
                  New Username (optional)
                </label>
                <input
                  type="text"
                  value={settingsData.new_username}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, new_username: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-deep-char/70 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={settingsData.new_password}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, new_password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-xl border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-4 py-3 border border-maize-gold/30 rounded-xl font-sans hover:bg-maize-gold/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-saffron-blaze text-white rounded-xl font-sans font-medium hover:bg-chili-red transition-colors"
                  data-testid="save-credentials-btn"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
