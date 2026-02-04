const Gallery = () => {
  const images = [
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/n2cl794d_1.jpg",
      alt: "Delicious Tacos",
      span: "col-span-2 row-span-2",
      height: "h-[300px] md:h-[500px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/w0c8gqkq_2.jpg",
      alt: "Signature Dish",
      span: "col-span-1",
      height: "h-[145px] md:h-[240px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/q4q0k8fb_6.jpg",
      alt: "Crispy Chicken Strips",
      span: "col-span-1",
      height: "h-[145px] md:h-[240px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/puod0awa_7.jpg",
      alt: "Fusion Noodle Burger",
      span: "col-span-1",
      height: "h-[145px] md:h-[240px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/wdsnvmjf_3.jpg",
      alt: "Fresh Creation",
      span: "col-span-1",
      height: "h-[145px] md:h-[240px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/18ze1ust_8.jpg",
      alt: "Grilled Prawns with Chips",
      span: "col-span-2",
      height: "h-[180px] md:h-[280px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/ypow9kz5_4.jpg",
      alt: "Chef's Special",
      span: "col-span-1",
      height: "h-[180px] md:h-[280px]"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_tacos-victoria/artifacts/o7eixpi3_5.jpg",
      alt: "Fusion Delight",
      span: "col-span-1",
      height: "h-[180px] md:h-[280px]"
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`gallery-item rounded-2xl overflow-hidden ${image.span} ${image.height} group`}
              data-testid={`gallery-image-${index}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        {/* Facebook CTA */}
        <div className="text-center mt-12">
          <p className="font-sans text-deep-char/70 mb-4">
            Share your experience with us!
          </p>
          <a
            href="https://www.facebook.com/p/Tacos-Things-61575431517600/"
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
