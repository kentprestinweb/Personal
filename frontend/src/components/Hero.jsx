import { ChevronDown, MapPin, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";

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
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif text-deep-char leading-tight mb-6">
              Where{" "}
              <span className="text-saffron-blaze">Mumbai</span>
              <br />
              Meets{" "}
              <span className="text-guacamole-green">Mexico City</span>
            </h1>
            <p className="font-serif text-2xl text-deep-char/80 -mt-4 mb-4">Taco's & Things</p>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-deep-char/70 font-sans leading-relaxed mb-8 max-w-lg">
              Experience the bold fusion of Indian spices and Mexican flavours.
              Handcrafted tacos, exotic curries, and unforgettable taste
              adventures await.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                onClick={scrollToMenu}
                className="bg-saffron-blaze text-white px-8 py-4 rounded-full font-bold hover:bg-chili-red transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl btn-glow text-base"
                data-testid="order-online-btn"
              >
                Order Online
              </Button>
              <Button
                onClick={scrollToMenu}
                variant="outline"
                className="bg-transparent border-2 border-deep-char text-deep-char px-8 py-4 rounded-full font-bold hover:bg-deep-char hover:text-white transition-all duration-300 text-base"
                data-testid="view-menu-btn"
              >
                View Menu
              </Button>
            </div>

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
                  src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80"
                  alt="Delicious fusion tacos"
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
