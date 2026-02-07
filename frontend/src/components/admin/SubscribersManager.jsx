import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Mail,
  Trash2,
  Download,
  Users,
  Calendar,
  Search,
  Copy,
  Check,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SubscribersManager = ({ onClose }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [copied, setCopied] = useState(false);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get(`${API}/admin/subscribers`, getAuthHeaders());
      setSubscribers(res.data);
    } catch (err) {
      showMessage("error", "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Remove ${email} from the mailing list?`)) return;
    try {
      await axios.delete(`${API}/admin/subscribers/${encodeURIComponent(email)}`, getAuthHeaders());
      setSubscribers(subscribers.filter((s) => s.email !== email));
      showMessage("success", "Subscriber removed");
    } catch (err) {
      showMessage("error", "Failed to remove subscriber");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get(`${API}/admin/subscribers/export`, getAuthHeaders());
      const blob = new Blob([res.data.csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showMessage("success", `Exported ${res.data.count} subscribers`);
    } catch (err) {
      showMessage("error", "Failed to export");
    }
  };

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showMessage("success", "All emails copied to clipboard!");
  };

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50">
        <div className="bg-cream-paper p-8 rounded-2xl">
          <p className="font-sans text-deep-char">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-deep-char/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-paper rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-maize-gold/20 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-saffron-blaze/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-saffron-blaze" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-deep-char">Email Subscribers</h2>
              <p className="text-sm font-sans text-deep-char/60">{subscribers.length} total subscribers</p>
            </div>
          </div>
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

        {/* Actions Bar */}
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-maize-gold/10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-deep-char/40" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-maize-gold/30 bg-white focus:outline-none focus:border-saffron-blaze font-sans text-sm"
            />
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyAll}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-maize-gold/30 rounded-lg font-sans text-sm hover:bg-maize-gold/10 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy All"}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={subscribers.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-saffron-blaze text-white rounded-lg font-sans text-sm hover:bg-chili-red transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Subscribers List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-deep-char/20 mx-auto mb-4" />
              <p className="font-sans text-deep-char/60">
                {searchQuery ? "No subscribers match your search" : "No subscribers yet"}
              </p>
              <p className="font-sans text-sm text-deep-char/40 mt-1">
                Subscribers will appear here when customers sign up
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubscribers.map((subscriber, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-maize-gold/10 hover:border-maize-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-saffron-blaze/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-saffron-blaze" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-deep-char truncate">{subscriber.email}</p>
                      <p className="font-sans text-xs text-deep-char/50 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(subscriber.subscribed_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(subscriber.email)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Remove subscriber"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Tip */}
        <div className="p-4 border-t border-maize-gold/10 bg-maize-gold/5">
          <p className="font-sans text-xs text-deep-char/60 text-center">
            💡 Tip: Export emails to CSV and import into Mailchimp, Brevo, or any email marketing service
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribersManager;
