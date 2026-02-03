import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const ReviewCard = ({ review }) => {
  return (
    <div
      className="review-card bg-white p-8 rounded-3xl shadow-lg h-full"
      data-testid={`review-${review.id}`}
    >
      {/* Quote Icon */}
      <div className="w-12 h-12 bg-maize-gold/30 rounded-full flex items-center justify-center mb-6">
        <Quote className="w-5 h-5 text-saffron-blaze" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < review.rating
                ? "fill-maize-gold text-maize-gold"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="font-sans text-lg text-deep-char/80 leading-relaxed mb-6 italic">
        "{review.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-saffron-blaze to-chili-red rounded-full flex items-center justify-center text-white font-bold">
          {review.author.charAt(0)}
        </div>
        <div>
          <p className="font-serif text-deep-char">{review.author}</p>
          <p className="font-sans text-sm text-deep-char/60">{review.date}</p>
        </div>
      </div>
    </div>
  );
};

const Reviews = ({ reviews }) => {
  return (
    <section
      id="reviews"
      className="py-20 md:py-32 bg-gradient-to-br from-maize-gold/20 to-cream-paper"
      data-testid="reviews-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block font-sans text-saffron-blaze font-bold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-char mb-4">
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-maize-gold text-maize-gold"
                />
              ))}
            </div>
            <span className="font-sans text-lg text-deep-char font-medium">
              5.0 Rating • 41 Reviews on Google
            </span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <ReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="hidden md:flex -left-4 bg-white border-maize-gold text-deep-char hover:bg-saffron-blaze hover:text-white"
            data-testid="reviews-prev"
          />
          <CarouselNext
            className="hidden md:flex -right-4 bg-white border-maize-gold text-deep-char hover:bg-saffron-blaze hover:text-white"
            data-testid="reviews-next"
          />
        </Carousel>

        {/* Google Review CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.google.com/maps/search/tacos+and+things+clyde+north"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all text-deep-char font-sans font-medium hover:text-saffron-blaze"
            data-testid="google-reviews-link"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
