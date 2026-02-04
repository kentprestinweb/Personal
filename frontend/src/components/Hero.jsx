import { ChevronDown, MapPin, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";

const UBEREATS_URL = "https://www.ubereats.com/au/store/tacos-%26-things/dPoR8c_FQVeNNV1SyGY3Ow?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas";
const DOORDASH_URL = "https://www.doordash.com/store/taco's-&-things-clyde-north-33378679/58290346/?pickup=true&utm_campaign=gpa";

const Hero = () => {
  const scrollToMenu = () => {
    const element = document.querySelector("#menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-20 flex items-center hero-pattern"
      data-testid="hero-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="section-fade">
            {/* Rating Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-maize-gold text-maize-gold"
                  />
                ))}
              </div>
              <span className="font-sans text-sm text-deep-char font-medium">
                5.0 • 41 Google Reviews
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-deep-char leading-tight mb-4">
              Clyde North's
              <br />
              <span className="text-saffron-blaze">Best Tacos</span>
            </h1>
            <p className="font-serif text-2xl text-deep-char/80 mb-4">Taco's & Things</p>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-deep-char/70 font-sans leading-relaxed mb-8 max-w-lg">
              Experience the bold fusion of Indian spices and Mexican flavours right here in your neighbourhood. 
              Fresh ingredients, authentic recipes, and a taste adventure your family will love.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href={UBEREATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#06C167] text-white px-6 py-4 rounded-full font-bold hover:bg-[#05a857] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="order-ubereats-btn"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4a9.6 9.6 0 110 19.2 9.6 9.6 0 010-19.2zm0 3.6a6 6 0 100 12 6 6 0 000-12zm0 2.4a3.6 3.6 0 110 7.2 3.6 3.6 0 010-7.2z"/>
                </svg>
                Order on Uber Eats
              </a>
              <a
                href={DOORDASH_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#FF3008] text-white px-6 py-4 rounded-full font-bold hover:bg-[#e62b07] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="order-doordash-btn"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.242.516h12.049a1.554 1.554 0 11.031 3.108H8.91a.589.589 0 00-.415 1.003l3.725 3.747a1.75 1.75 0 001.242.516h3.757c4.887 0 8.584-5.225 5.852-10.41z"/>
                </svg>
                Order on DoorDash
              </a>
            </div>
            
            <Button
              onClick={scrollToMenu}
              variant="outline"
              className="bg-transparent border-2 border-deep-char text-deep-char px-8 py-4 rounded-full font-bold hover:bg-deep-char hover:text-white transition-all duration-300 text-base mb-10"
              data-testid="view-menu-btn"
            >
              View Menu
            </Button>

            {/* Info Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-saffron-blaze" />
                <span className="font-sans text-sm text-deep-char">
                  Clyde North, VIC
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-saffron-blaze" />
                <span className="font-sans text-sm text-deep-char">
                  Opens 5:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative section-fade" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Main Image */}
              <div className="organic-shape overflow-hidden shadow-2xl">
                <img
                  src="/taco-truck-hero.png"
                  alt="Taco's & Things Food Truck"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  data-testid="hero-image"
                />
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-saffron-blaze/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌮</span>
                  </div>
                  <div>
                    <p className="font-sans text-sm text-deep-char/60">
                      Signature Dish
                    </p>
                    <p className="font-serif text-deep-char">Tandoori Taco</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -top-4 -right-4 bg-maize-gold p-4 rounded-2xl shadow-xl hidden md:block">
                <p className="font-serif text-deep-char text-lg">
                  Indian-Mexican
                  <br />
                  Fusion
                </p>
              </div>

              {/* Background Decoration */}
              <div className="absolute -z-10 top-10 right-10 w-full h-full bg-maize-gold/30 organic-shape-alt"></div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center animate-bounce">
          <span className="font-sans text-sm text-deep-char/60 mb-2">
            Scroll to explore
          </span>
          <ChevronDown className="w-5 h-5 text-saffron-blaze" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
