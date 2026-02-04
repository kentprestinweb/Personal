import { useState } from "react";
import { Flame, Leaf, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const UBEREATS_URL = "https://www.ubereats.com/au/store/tacos-%26-things/dPoR8c_FQVeNNV1SyGY3Ow?diningMode=PICKUP&utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas";
const DOORDASH_URL = "https://www.doordash.com/store/taco's-&-things-clyde-north-33378679/58290346/?pickup=true&utm_campaign=gpa";

const MenuItemCard = ({ item }) => {
  return (
    <div
      className="menu-card bg-white rounded-2xl overflow-hidden shadow-md border border-maize-gold/20 group"
      data-testid={`menu-item-${item.id}`}
    >
      {/* Image with hover story */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url || "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Hover Story Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-char/90 via-deep-char/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-cream-paper text-sm font-sans leading-relaxed">
            {item.description}
          </p>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {item.is_popular && (
            <span className="badge-popular px-3 py-1 rounded-full text-xs font-bold text-deep-char flex items-center gap-1">
              <Star className="w-3 h-3" /> Popular
            </span>
          )}
          {item.is_spicy && (
            <span className="badge-spicy px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
              <Flame className="w-3 h-3" /> Spicy
            </span>
          )}
          {item.is_vegetarian && (
            <span className="badge-veg px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
              <Leaf className="w-3 h-3" /> Veg
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-deep-char group-hover:text-saffron-blaze transition-colors pr-2">
            {item.name}
          </h3>
          <span className="font-sans text-xl font-bold text-saffron-blaze whitespace-nowrap">
            A${item.price.toFixed(2)}
          </span>
        </div>
        <p className="font-sans text-sm text-deep-char/60 line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const Menu = ({ items }) => {
  const [activeTab, setActiveTab] = useState("most-ordered");

  const categories = [
    { id: "most-ordered", name: "Most Ordered", emoji: "⭐" },
    { id: "tacos", name: "Tacos", emoji: "🌮" },
    { id: "tandoori-tacos", name: "Tandoori Tacos", emoji: "🔥" },
    { id: "southern-tacos", name: "Southern Tacos", emoji: "🍗" },
    { id: "indian", name: "Bit of Indian", emoji: "🍛" },
    { id: "fish-chips", name: "Fish & Chips", emoji: "🐟" },
    { id: "grilled-fish", name: "Grilled Fish", emoji: "🍽️" },
    { id: "burgers", name: "Burgers", emoji: "🍔" },
    { id: "sharing", name: "Sharing Platter", emoji: "🍱" },
    { id: "snack-packs", name: "Snack Packs", emoji: "📦" },
    { id: "kids", name: "Kid's", emoji: "👶" },
    { id: "sides", name: "Sides", emoji: "🍟" },
    { id: "desserts", name: "Desserts", emoji: "🍨" },
  ];

  return (
    <section
      id="menu"
      className="py-20 md:py-32"
      data-testid="menu-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
            Our Menu
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-4">
            Explore Our Fusion Delights
          </h2>
          <p className="font-sans text-lg text-deep-char/70 max-w-2xl mx-auto">
            From signature tandoori tacos to exotic Indian dishes, discover flavours that
            blend the best of two culinary worlds.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent relative z-10 pb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`px-4 py-2 rounded-full font-sans font-medium transition-all text-sm ${
                  activeTab === category.id
                    ? "bg-saffron-blaze text-white shadow-lg"
                    : "bg-white text-deep-char hover:bg-maize-gold/30"
                }`}
                data-testid={`menu-tab-${category.id}`}
              >
                <span className="mr-1">{category.emoji}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8 pt-4">
          {/* Menu Items Grid */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {items
                  .filter((item) => item.category === category.id)
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </div>
              {items.filter((item) => item.category === category.id).length === 0 && (
                <p className="text-center text-deep-char/60 py-12">
                  No items in this category yet.
                </p>
              )}
            </TabsContent>
          ))}
          </div>
        </Tabs>

        {/* Order CTA */}
        <div className="mt-16 text-center">
          <h3 className="font-serif text-2xl text-deep-char mb-4">Ready to Order?</h3>
          <p className="font-sans text-deep-char/70 mb-6">Order now for pickup or delivery through our partners</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={UBEREATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#06C167] text-white px-8 py-4 rounded-full font-bold hover:bg-[#05a857] transition-all duration-300 hover:scale-105 shadow-lg"
              data-testid="menu-ubereats-btn"
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
              className="flex items-center gap-3 bg-[#FF3008] text-white px-8 py-4 rounded-full font-bold hover:bg-[#e62b07] transition-all duration-300 hover:scale-105 shadow-lg"
              data-testid="menu-doordash-btn"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.071 8.409a6.09 6.09 0 00-5.396-3.228H.584A.589.589 0 00.17 6.184L3.894 9.93a1.752 1.752 0 001.242.516h12.049a1.554 1.554 0 11.031 3.108H8.91a.589.589 0 00-.415 1.003l3.725 3.747a1.75 1.75 0 001.242.516h3.757c4.887 0 8.584-5.225 5.852-10.41z"/>
              </svg>
              Order on DoorDash
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
