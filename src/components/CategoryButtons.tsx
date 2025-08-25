import { Button } from "@/components/ui/button";
import { Heart, Target, Brain, Sun } from "lucide-react";

const categories = [
  { icon: Heart, label: "Love", color: "text-pink-500" },
  { icon: Target, label: "Motivation", color: "text-green-500" },
  { icon: Brain, label: "Wisdom", color: "text-blue-500" },
  { icon: Sun, label: "Happiness", color: "text-yellow-500" },
];

export const CategoryButtons = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What quote should inspire you today?
          </h2>
          <p className="text-muted-foreground">
            Pick from your favorite moods, authors, or topics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {categories.map(({ icon: Icon, label, color }) => (
            <Button
              key={label}
              variant="outline"
              size="lg"
              className="flex flex-col items-center space-y-2 p-6 h-auto border-2 hover:border-primary hover:bg-primary-soft transition-all"
            >
              <Icon className={`h-8 w-8 ${color}`} />
              <span className="font-semibold">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};