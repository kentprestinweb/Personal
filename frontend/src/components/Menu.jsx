import { useState } from "react";
import { Flame, Leaf, Star, Plus } from "lucide-react";
import { useCart } from "../App";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

const MenuItemCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`, {
      description: `$${item.price.toFixed(2)}`,
    });
  };

  return (
    <div
      className="menu-card bg-white rounded-2xl overflow-hidden shadow-md border border-maize-gold/20 group"
      data-testid={`menu-item-${item.id}`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url || "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
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
          <h3 className="font-serif text-xl text-deep-char group-hover:text-saffron-blaze transition-colors">
            {item.name}
          </h3>
          <span className="font-sans text-xl font-bold text-saffron-blaze">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="font-sans text-sm text-deep-char/60 mb-4 line-clamp-2">
          {item.description}
        </p>
        <Button
          onClick={handleAddToCart}
          className="w-full bg-deep-char text-white rounded-full py-3 font-sans font-medium hover:bg-saffron-blaze transition-colors flex items-center justify-center gap-2"
          data-testid={`add-to-cart-${item.id}`}
        >
          <Plus className="w-4 h-4" />
          Add to Order
        </Button>
      </div>
    </div>
  );
};

const Menu = ({ items }) => {
  const [activeTab, setActiveTab] = useState("tacos");

  const categories = [
    { id: "tacos", name: "Tacos", emoji: "🌮" },
    { id: "curries", name: "Curries", emoji: "🍛" },
    { id: "fusion", name: "Fusion", emoji: "🔥" },
    { id: "sides", name: "Sides", emoji: "🍟" },
    { id: "drinks", name: "Drinks", emoji: "🥤" },
  ];

  const filteredItems = items.filter((item) => item.category === activeTab);

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
            From signature tandoori tacos to exotic curries, discover dishes that
            blend the best of two culinary worlds.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap justify-center gap-2 mb-10 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`px-6 py-3 rounded-full font-sans font-medium transition-all ${
                  activeTab === category.id
                    ? "bg-saffron-blaze text-white shadow-lg"
                    : "bg-white text-deep-char hover:bg-maize-gold/30"
                }`}
                data-testid={`menu-tab-${category.id}`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

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
        </Tabs>
      </div>
    </section>
  );
};

export default Menu;
