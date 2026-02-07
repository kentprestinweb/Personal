import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success("Welcome to the family!", {
        description: "You'll receive exclusive offers and updates.",
      });
      setEmail("");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("You're already subscribed!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-20 md:py-32 bg-deep-char relative overflow-hidden"
      data-testid="newsletter-section"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-saffron-blaze rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-maize-gold rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-saffron-blaze/20 rounded-full mb-6">
            <Sparkles className="w-8 h-8 text-maize-gold" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-serif text-cream-paper mb-4">
            Join Our Flavour Family
          </h2>
          <p className="font-sans text-lg text-cream-paper/70 mb-8 max-w-xl mx-auto">
            Subscribe to get exclusive offers, new menu announcements, and
            special event invites delivered straight to your inbox.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="flex-1 relative overflow-hidden">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-deep-char/50 z-10" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-full bg-cream-paper text-deep-char border-0 focus:ring-2 focus:ring-saffron-blaze focus:outline-none"
                style={{ 
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
                data-testid="newsletter-email-input"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-saffron-blaze text-white px-8 py-4 rounded-full font-bold hover:bg-chili-red transition-all disabled:opacity-50 flex-shrink-0 h-14"
              data-testid="newsletter-submit-btn"
            >
              {loading ? (
                <span className="spinner w-5 h-5 border-white"></span>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>

          {/* Privacy Note */}
          <p className="font-sans text-sm text-cream-paper/50 mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
