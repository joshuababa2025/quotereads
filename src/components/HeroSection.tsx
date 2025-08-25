import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-reading-illustration.jpg";

export const HeroSection = () => {
  return (
    <section className="bg-gradient-hero py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              Summer of Quotes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
              Discover wisdom, inspiration, and beauty in words that have shaped minds and hearts across generations.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Read More
            </Button>
          </div>

          {/* Right Image */}
          <div className="flex-1 max-w-md">
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