import { Button } from "@/components/ui/button";
import { Heart, Target, Brain, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: Heart, label: "Love", color: "text-pink-500", path: "/category/love" },
  { icon: Target, label: "Motivation", color: "text-green-500", path: "/category/motivation" },
  { icon: Brain, label: "Wisdom", color: "text-blue-500", path: "/category/wisdom" },
  { icon: Sun, label: "Happiness", color: "text-yellow-500", path: "/category/happiness" },
];

export const CategoryButtons = () => {
  const navigate = useNavigate();
  return (
    <section className="py-8 lg:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3 lg:mb-4">
            What quote should inspire you today?
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Pick from your favorite moods, authors, or topics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {categories.map(({ icon: Icon, label, color, path }) => (
            <Button
              key={label}
              variant="outline"
              size="lg"
              className="flex flex-col items-center space-y-2 p-4 sm:p-6 h-auto border-2 hover:border-primary hover:bg-primary-soft transition-all"
              onClick={() => navigate(path)}
            >
              <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />
              <span className="font-semibold text-xs sm:text-sm lg:text-base">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};