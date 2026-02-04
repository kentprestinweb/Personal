import { Phone, MapPin, Clock, Facebook, Mail } from "lucide-react";
import { useContent } from "../context/ContentContext";

const Footer = () => {
  const { content, loading } = useContent();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
    { name: "About Us", href: "#about" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !content) {
    return <footer className="bg-deep-char text-cream-paper pt-20" />;
  }

  return (
    <footer
      className="bg-deep-char text-cream-paper footer-wave pt-20"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-serif text-cream-paper mb-4">
              Taco's <span className="text-saffron-blaze">&</span> Things
            </h3>
            <p className="font-sans text-cream-paper/70 mb-6 leading-relaxed">
              {content.footer_description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={content.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-cream-paper/10 rounded-full flex items-center justify-center hover:bg-saffron-blaze transition-colors"
                data-testid="footer-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${content.contact_email}`}
                className="w-10 h-10 bg-cream-paper/10 rounded-full flex items-center justify-center hover:bg-saffron-blaze transition-colors"
                data-testid="footer-email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xl text-maize-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="font-sans text-cream-paper/70 hover:text-saffron-blaze transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-xl text-maize-gold mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-saffron-blaze flex-shrink-0 mt-1" />
                <span className="font-sans text-cream-paper/70">
                  {content.contact_address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-saffron-blaze flex-shrink-0" />
                <a
                  href={`tel:${content.contact_phone.replace(/\s/g, '')}`}
                  className="font-sans text-cream-paper/70 hover:text-saffron-blaze transition-colors"
                  data-testid="footer-phone"
                >
                  {content.contact_phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-saffron-blaze flex-shrink-0 mt-1" />
                <span className="font-sans text-cream-paper/70">
                  {content.contact_hours}
                </span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-serif text-xl text-maize-gold mb-4">
              Our Services
            </h4>
            <ul className="space-y-3">
              <li className="font-sans text-cream-paper/70 flex items-center gap-2">
                <span className="w-2 h-2 bg-guacamole-green rounded-full"></span>
                Dine-in
              </li>
              <li className="font-sans text-cream-paper/70 flex items-center gap-2">
                <span className="w-2 h-2 bg-guacamole-green rounded-full"></span>
                Takeaway
              </li>
              <li className="font-sans text-cream-paper/70 flex items-center gap-2">
                <span className="w-2 h-2 bg-guacamole-green rounded-full"></span>
                Delivery
              </li>
              <li className="font-sans text-cream-paper/70 flex items-center gap-2">
                <span className="w-2 h-2 bg-guacamole-green rounded-full"></span>
                Online Ordering
              </li>
              <li className="font-sans text-cream-paper/70 flex items-center gap-2">
                <span className="w-2 h-2 bg-maize-gold rounded-full"></span>
                Catering Available
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream-paper/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-sm text-cream-paper/50">
              © {currentYear} Taco's & Things. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="font-sans text-sm text-cream-paper/50 hover:text-saffron-blaze transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-sans text-sm text-cream-paper/50 hover:text-saffron-blaze transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
