import { Play, ExternalLink } from "lucide-react";

const Videos = () => {
  // Facebook video IDs from Taco's & Things page
  const videos = [
    {
      id: "1",
      embedUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F61575431517600%2Fvideos%2F702498465679993%2F&show_text=false&width=267&t=0",
      title: "Fresh Tacos Being Made",
      description: "Watch our chefs craft the perfect fusion taco"
    },
    {
      id: "2", 
      embedUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F61575431517600%2Fvideos%2F680aborrar502946823%2F&show_text=false&width=267&t=0",
      title: "Kitchen Action",
      description: "Behind the scenes at Taco's & Things"
    },
    {
      id: "3",
      embedUrl: "https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F61575431517600%2Fvideos%2F1329741161621927%2F&show_text=false&width=267&t=0",
      title: "Signature Dishes",
      description: "Our most popular fusion creations"
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
            Get a taste of the action! Watch our talented chefs create mouthwatering 
            Indian-Mexican fusion dishes right before your eyes.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="bg-cream-paper/5 rounded-2xl overflow-hidden border border-cream-paper/10 hover:border-saffron-blaze/50 transition-all duration-300 group"
              data-testid={`video-card-${index}`}
            >
              {/* Video Embed Container */}
              <div className="relative aspect-[9/16] md:aspect-[9/14] bg-deep-char">
                <iframe
                  src={video.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  loading="lazy"
                  title={video.title}
                ></iframe>
              </div>
              
              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-serif text-lg text-cream-paper group-hover:text-saffron-blaze transition-colors mb-1">
                  {video.title}
                </h3>
                <p className="font-sans text-sm text-cream-paper/60">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Facebook */}
        <div className="text-center mt-12">
          <p className="font-sans text-cream-paper/70 mb-4">
            Want to see more? Follow us on Facebook for daily updates!
          </p>
          <a
            href="https://www.facebook.com/p/Tacos-Things-61575431517600/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1877F2] text-white rounded-full font-sans font-medium hover:bg-[#166FE5] transition-colors"
            data-testid="videos-facebook-link"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Watch More on Facebook
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Videos;
