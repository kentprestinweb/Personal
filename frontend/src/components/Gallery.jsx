const Gallery = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
      alt: "Signature Tacos",
      span: "col-span-2 row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
      alt: "Tandoori Chicken Taco",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
      alt: "Masala Fries",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
      alt: "Butter Chicken",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400&q=80",
      alt: "Quesadilla",
      span: "col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
      alt: "Nachos",
      span: "col-span-2",
    },
  ];

  return (
    <section
      id="gallery"
      className="py-20 md:py-32"
      data-testid="gallery-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
            Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-4">
            A Feast for the Eyes
          </h2>
          <p className="font-sans text-lg text-deep-char/70 max-w-2xl mx-auto">
            Take a peek at our mouthwatering creations. Every dish is a work of
            art, crafted to delight both your eyes and taste buds.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`gallery-item rounded-2xl overflow-hidden ${image.span} ${
                index === 0 ? "h-[300px] md:h-[500px]" : "h-[150px] md:h-[240px]"
              }`}
              data-testid={`gallery-image-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="text-center mt-12">
          <p className="font-sans text-deep-char/70 mb-4">
            Share your experience with us!
          </p>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-blaze text-white rounded-full font-sans font-medium hover:bg-chili-red transition-colors"
            data-testid="facebook-gallery-link"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Follow us on Facebook
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
