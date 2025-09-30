import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-reading-illustration.jpg";

export const HeroSection = () => {
  return (
    <section className="bg-gradient-hero py-8 sm:py-12 lg:py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-3 lg:mb-4 leading-tight">
              Summer of Quotes
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-md mx-auto lg:mx-0">
              Discover wisdom, inspiration, and beauty in words that have shaped minds and hearts across generations.
            </p>
            <Link to="/community-quotes">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Read More
              </Button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex-1 max-w-sm lg:max-w-md">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Person reading in a peaceful setting" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};