import { useState } from "react";
import { MapPin, Phone, Clock, Mail, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Address",
      value: "Unit 3/47 Rainier Cres, Clyde North VIC 3978",
      link: "https://www.google.com/maps/search/Unit+3+47+Rainier+Cres+Clyde+North+VIC+3978",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      value: "0439 406 042",
      link: "tel:0439406042",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Hours",
      value: "Opens daily at 5:00 PM",
      link: null,
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "hello@tacosandthings.com.au",
      link: "mailto:hello@tacosandthings.com.au",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-gradient-to-br from-cream-paper to-maize-gold/20"
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-4">
            Visit Us or Say Hello
          </h2>
          <p className="font-sans text-lg text-deep-char/70 max-w-2xl mx-auto">
            We'd love to hear from you! Drop by for a meal or send us a message
            for catering inquiries and feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Map & Info */}
          <div>
            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-lg mb-8 h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.0766854867477!2d145.3550!3d-38.0950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDA1JzQyLjAiUyAxNDXCsDIxJzE4LjAiRQ!5e0!3m2!1sen!2sau!4v1600000000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Tacos & Things Location"
                data-testid="google-map"
              ></iframe>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                  data-testid={`contact-info-${index}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-saffron-blaze/10 rounded-full flex items-center justify-center text-saffron-blaze">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-sans text-sm text-deep-char/60 mb-1">
                        {info.title}
                      </p>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith("http") ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          className="font-sans text-deep-char hover:text-saffron-blaze transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-sans text-deep-char">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="font-serif text-2xl text-deep-char mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                    Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-maize-gold/30 focus:border-saffron-blaze"
                    data-testid="contact-name-input"
                  />
                </div>
                <div>
                  <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-maize-gold/30 focus:border-saffron-blaze"
                    data-testid="contact-email-input"
                  />
                </div>
              </div>
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Phone (optional)
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-maize-gold/30 focus:border-saffron-blaze"
                  data-testid="contact-phone-input"
                />
              </div>
              <div>
                <label className="font-sans text-sm text-deep-char/70 mb-2 block">
                  Message *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-maize-gold/30 focus:border-saffron-blaze resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-saffron-blaze text-white py-4 rounded-full font-bold hover:bg-chili-red transition-all flex items-center justify-center gap-2"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  <span className="spinner w-5 h-5 border-white"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
