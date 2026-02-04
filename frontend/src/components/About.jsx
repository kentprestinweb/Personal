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
    }
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-br from-cream-paper to-maize-gold/20"
      data-testid="about-section"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
          Our Story
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-6">
          A Flavourful Journey of Two Cultures
        </h2>
        <p className="font-sans text-lg mb-6 text-deep-char/70 max-w-3xl mx-auto">
          At Taco's & Things, we believe that the best flavours are born from unexpected 
          combinations. Our culinary journey began with a simple idea: what if we brought 
          together the aromatic spices of India with the vibrant, fresh flavours of Mexico?
        </p>
        <p className="text-lg text-deep-char/70 font-sans leading-relaxed mb-12 max-w-3xl mx-auto">
          From our signature Tandoori Paneer Tacos to our crispy Southern
          Chicken creations, every dish tells a story of two cultures coming
          together in perfect harmony. We use only the freshest ingredients
          and authentic spices to create dishes that will take your taste
          buds on an unforgettable adventure.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4"
              data-testid={`about-feature-${index}`}
            >
              <div className="w-14 h-14 bg-maize-gold/30 rounded-xl flex items-center justify-center text-saffron-blaze mb-4">
                {feature.icon}
              </div>
              <h3 className="font-serif text-deep-char text-lg mb-1">
                {feature.title}
              </h3>
              <p className="font-sans text-sm text-deep-char/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
