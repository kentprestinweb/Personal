import { Play, ExternalLink } from "lucide-react";

const Videos = () => {
  // Video showcase cards linking to Facebook
  const videoCards = [
    {
      id: "1",
      thumbnail: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
      title: "Fresh Tacos Being Made",
      description: "Watch our chefs craft the perfect fusion taco with fresh ingredients"
    },
    {
      id: "2", 
      thumbnail: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80",
      title: "Kitchen Action",
      description: "Behind the scenes at Taco's & Things - where the magic happens"
    },
    {
      id: "3",
      thumbnail: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80",
      title: "Signature Dishes",
      description: "Our most popular Indian-Mexican fusion creations"
    }
  ];

  return (
    <section
      id="videos"
      className="py-20 md:py-32 bg-deep-char"
      data-testid="videos-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
            Watch Us Cook
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-cream-paper mb-4">
            Behind the Scenes
          </h2>
          <p className="font-sans text-lg text-cream-paper/70 max-w-2xl mx-auto">
            Get a taste of the action! Follow us on Facebook to watch our talented chefs 
            create mouthwatering Indian-Mexican fusion dishes.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoCards.map((video, index) => (
            <a
              key={video.id}
              href="https://www.facebook.com/p/Tacos-Things-61575431517600/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-cream-paper/5 rounded-2xl overflow-hidden border border-cream-paper/10 hover:border-saffron-blaze/50 transition-all duration-300 hover:scale-[1.02]"
              data-testid={`video-card-${index}`}
            >
              {/* Video Thumbnail with Play Overlay */}
              <div className="relative aspect-video bg-deep-char overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-deep-char/40 group-hover:bg-deep-char/20 transition-colors duration-300" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-saffron-blaze/90 rounded-full flex items-center justify-center group-hover:bg-saffron-blaze group-hover:scale-110 transition-all duration-300 shadow-xl">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" />
                  </div>
                </div>
                {/* Facebook Badge */}
                <div className="absolute top-3 right-3 bg-[#1877F2] text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Video
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-5">
                <h3 className="font-serif text-xl text-cream-paper group-hover:text-saffron-blaze transition-colors mb-2">
                  {video.title}
                </h3>
                <p className="font-sans text-sm text-cream-paper/60 mb-3">
                  {video.description}
                </p>
                <span className="inline-flex items-center gap-1 text-saffron-blaze font-sans text-sm font-medium">
                  Watch on Facebook
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* CTA to Facebook */}
        <div className="text-center mt-12">
          <p className="font-sans text-cream-paper/70 mb-4">
            Follow us for more videos, daily specials, and behind-the-scenes content!
          </p>
          <a
            href="https://www.facebook.com/p/Tacos-Things-61575431517600/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1877F2] text-white rounded-full font-sans font-bold hover:bg-[#166FE5] transition-all duration-300 hover:scale-105 shadow-lg"
            data-testid="videos-facebook-link"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Watch All Videos on Facebook
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Videos;
