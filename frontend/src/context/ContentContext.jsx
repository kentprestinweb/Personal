import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContentContext = createContext(null);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API}/content`);
      setContent(res.data);
    } catch (err) {
      console.error("Failed to load content:", err);
      // Use default content if fetch fails
      setContent({
        hero_headline: "Where Indian Spices Meet Mexican Soul",
        hero_tagline: "Experience the perfect fusion of two beloved cuisines. Fresh ingredients, bold flavours, and a whole lot of love in every bite.",
        hero_image: "/taco-truck-hero.png",
        hero_uber_eats_url: "https://www.ubereats.com/au/store/tacos-%26-things-clyde-north/",
        hero_doordash_url: "https://www.doordash.com/store/tacos-and-things-clyde-north/",
        about_label: "Our Story",
        about_headline: "A Flavourful Journey of Two Cultures",
        about_text_1: "At Taco's & Things, we believe that the best flavours are born from unexpected combinations.",
        about_text_2: "From our signature Tandoori Paneer Tacos to our crispy Southern Chicken creations, every dish tells a story of two cultures coming together in perfect harmony.",
        gallery_label: "Gallery",
        gallery_headline: "A Feast for the Eyes",
        gallery_description: "Take a peek at our mouthwatering creations.",
        gallery_images: [],
        contact_label: "Visit Us",
        contact_headline: "Come Say Hello",
        contact_address: "Unit 3/47 Rainier Cres, Clyde North VIC 3978",
        contact_phone: "0439 406 042",
        contact_email: "hello@tacosandthings.com.au",
        contact_hours: "Open daily from 5:00 PM",
        contact_map_embed: "",
        footer_tagline: "Where Indian Spices Meet Mexican Soul",
        footer_description: "Bringing you the best fusion cuisine in Clyde North.",
        facebook_url: "https://www.facebook.com/p/Tacos-Things-61575431517600/"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshContent = () => {
    fetchContent();
  };

  return (
    <ContentContext.Provider value={{ content, loading, refreshContent }}>
      {children}
    </ContentContext.Provider>
  );
};
