import { useContent } from "../context/ContentContext";

const Gallery = () => {
  const { content, loading } = useContent();

  if (loading || !content) {
    return <section id="gallery" className="py-20 md:py-32" />;
  }

  const images = content.gallery_images || [];

  // Create layout configuration based on number of images
  const getImageConfig = (index, total) => {
    if (total <= 4) {
      return { span: "col-span-1", height: "h-[200px] md:h-[280px]" };
    }
    if (index === 0) {
      return { span: "col-span-2 row-span-2", height: "h-[300px] md:h-[500px]" };
    }
    if (index === 5) {
      return { span: "col-span-2", height: "h-[180px] md:h-[280px]" };
    }
    return { span: "col-span-1", height: "h-[145px] md:h-[240px]" };
  };

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
            {content.gallery_label}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-4">
            {content.gallery_headline}
          </h2>
          <p className="font-sans text-lg text-deep-char/70 max-w-2xl mx-auto">
            {content.gallery_description}
          </p>
        </div>

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {images.map((image, index) => {
              const config = getImageConfig(index, images.length);
              return (
                <div
                  key={index}
                  className={`gallery-item rounded-2xl overflow-hidden ${config.span} ${config.height} group`}
                  data-testid={`gallery-image-${index}`}
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-deep-char/50 font-sans">
            No gallery images yet
          </div>
        )}

        {/* Facebook CTA */}
        <div className="text-center mt-12">
          <p className="font-sans text-deep-char/70 mb-4">
            Share your experience with us!
          </p>
          <a
            href={content.facebook_url}
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
