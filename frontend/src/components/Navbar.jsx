import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "./ui/button";

const UBEREATS_URL = "https://www.ubereats.com/au/store/tacos-%26-things/dPoR8c_FQVeNNV1SyGY3Ow?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas";
const DOORDASH_URL = "https://www.doordash.com/store/taco's-&-things-clyde-north-33378679/58290346/?pickup=true&utm_campaign=gpa";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menu" },
  { name: "Reviews", href: "#reviews" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" }];


  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "navbar-scrolled py-3" : "bg-transparent py-5"}`
      }>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="flex items-center gap-2"
            data-testid="navbar-logo">

            <span className="md:text-3xl !font-serif !text-2xl text-deep-char">
              Taco's <span className="text-saffron-blaze">&</span> Things
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="font-sans text-deep-char hover:text-saffron-blaze transition-colors"
              data-testid={`nav-link-${link.name.toLowerCase()}`}>

                {link.name}
              </a>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Phone Button */}
            <a
              href="tel:0439406042"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-maize-gold/20 text-deep-char hover:bg-maize-gold/40 transition-colors"
              data-testid="call-now-btn">

              <Phone className="w-4 h-4" />
              <span className="font-sans text-sm font-medium">Call Now</span>
            </a>

            {/* Order Buttons */}
            <a
              href={UBEREATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-[#06C167] text-white px-4 py-2 rounded-full font-medium hover:bg-[#05a857] transition-all text-sm"
              data-testid="navbar-ubereats-btn"
            >
              Uber Eats
            </a>
            <a
              href={DOORDASH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 bg-[#FF3008] text-white px-4 py-2 rounded-full font-medium hover:bg-[#e62b07] transition-all text-sm"
              data-testid="navbar-doordash-btn"
            >
              DoorDash
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-deep-char hover:text-saffron-blaze transition-colors"
              data-testid="mobile-menu-toggle">

              {isMobileMenuOpen ?
              <X className="w-6 h-6" /> :

              <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen &&
        <div className="lg:hidden mt-4 pb-4 mobile-menu-enter" data-testid="mobile-menu">
            <div className="flex flex-col gap-3 bg-white rounded-2xl p-4 shadow-lg">
              {navLinks.map((link) =>
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="font-sans text-deep-char hover:text-saffron-blaze transition-colors py-2 px-3 rounded-lg hover:bg-maize-gold/10"
              data-testid={`mobile-nav-link-${link.name.toLowerCase()}`}>

                  {link.name}
                </a>
            )}
              <a
              href="tel:0439406042"
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-maize-gold/20 text-deep-char font-medium"
              data-testid="mobile-call-btn">

                <Phone className="w-4 h-4" />
                Call 0439 406 042
              </a>
              <a
                href={UBEREATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#06C167] text-white font-medium"
                data-testid="mobile-ubereats-btn"
              >
                Order on Uber Eats
              </a>
              <a
                href={DOORDASH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FF3008] text-white font-medium"
                data-testid="mobile-doordash-btn"
              >
                Order on DoorDash
              </a>
            </div>
          </div>
        }
      </div>
    </nav>);

};

export default Navbar;