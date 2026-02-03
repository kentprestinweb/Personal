import { Utensils, Leaf, Heart, Award } from "lucide-react";

const About = () => {
  const features = [
  {
    icon: <Utensils className="w-6 h-6" />,
    title: "Fusion Cuisine",
    description: "Unique blend of Indian spices with Mexican traditions"
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Fresh Ingredients",
    description: "Locally sourced produce and premium quality meats"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Made with Love",
    description: "Every dish crafted with passion and care"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "5-Star Rated",
    description: "Consistently excellent reviews from our customers"
  }];


  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-br from-cream-paper to-maize-gold/20"
      data-testid="about-section">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="organic-shape overflow-hidden h-48 md:h-64">
                  <img
                    src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80"
                    alt="Tandoori Chicken Taco"
                    className="w-full h-full object-cover"
                    data-testid="about-image-1" />

                </div>
                <div className="organic-shape-alt overflow-hidden h-32 md:h-40">
                  <img
                    src="https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80"
                    alt="Masala Fries"
                    className="w-full h-full object-cover"
                    data-testid="about-image-2" />

                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="organic-shape-alt overflow-hidden h-32 md:h-40">
                  <img
                    src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80"
                    alt="Butter Chicken"
                    className="w-full h-full object-cover"
                    data-testid="about-image-3" />

                </div>
                <div className="organic-shape overflow-hidden h-48 md:h-64">
                  <img
                    src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"
                    alt="Fresh Tacos"
                    className="w-full h-full object-cover"
                    data-testid="about-image-4" />

                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-saffron-blaze text-white p-6 rounded-full shadow-xl z-10">
              <p className="font-serif text-center">
                <span className="text-3xl font-bold">5+</span>
                <br />
                <span className="text-sm">Years</span>
              </p>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-6">
              A Flavourful Journey of Two Cultures
            </h2>
            <p className="!font-sans !text-lg mb-6 text-deep-char/70">At Taco's & Things, we believe that the best flavours are born from unexpected combinations. Our culinary journey began with a simple idea: what if we brought together the aromatic spices of India with the vibrant, fresh flavours of Mexico?




            </p>
            <p className="text-lg text-deep-char/70 font-sans leading-relaxed mb-8">
              From our signature Tandoori Paneer Tacos to our crispy Southern
              Chicken creations, every dish tells a story of two cultures coming
              together in perfect harmony. We use only the freshest ingredients
              and authentic spices to create dishes that will take your taste
              buds on an unforgettable adventure.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) =>
              <div
                key={index}
                className="flex items-start gap-4"
                data-testid={`about-feature-${index}`}>

                  <div className="flex-shrink-0 w-12 h-12 bg-maize-gold/30 rounded-xl flex items-center justify-center text-saffron-blaze">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-deep-char text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="font-sans text-sm text-deep-char/60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default About;