import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuoteCountDisplay } from "@/components/QuoteCountDisplay";

const collections = [
  {
    title: "Wisdom of the Ages",
    description: "Ancient philosophers and modern thinkers share their greatest insights",
    color: "bg-gradient-to-br from-purple-100 to-purple-200",
    textColor: "text-purple-900",
    path: "/wisdom-of-ages",
    specialCollection: "wisdom-of-ages"
  },
  {
    title: "Daily Motivation",
    description: "Start your day with powerful quotes that inspire action",
    color: "bg-gradient-to-br from-green-100 to-green-200", 
    textColor: "text-green-900",
    path: "/daily-motivation",
    category: "Motivation"
  }
];

export const FeaturedCollections = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Featured Collections
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {collections.map((collection, index) => (
            <div 
              key={index}
              className={`${collection.color} rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
              onClick={() => navigate(collection.path)}
            >
              <h3 className={`text-xl font-bold ${collection.textColor} mb-2`}>
                {collection.title}
              </h3>
              <p className={`${collection.textColor} opacity-80 mb-4`}>
                {collection.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${collection.textColor} opacity-70`}>
                  <QuoteCountDisplay 
                    category={collection.category}
                    specialCollection={collection.specialCollection}
                  /> quotes
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`${collection.textColor} hover:bg-white/20 group-hover:translate-x-1 transition-transform`}
                >
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};