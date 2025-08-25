import { QuoteCard } from "./QuoteCard";
import { Heart } from "lucide-react";

const trendingQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Motivational",
    variant: "purple" as const,
    likes: 1247
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    category: "Wisdom",
    variant: "orange" as const,
    likes: 892
  }
];

export const TrendingQuotes = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What are others loving right now?
          </h2>
          <p className="text-muted-foreground">
            See which quotes are trending this week
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {trendingQuotes.map((quote, index) => (
            <QuoteCard
              key={index}
              quote={quote.quote}
              author={quote.author}
              category={quote.category}
              variant={quote.variant}
              likes={quote.likes}
            />
          ))}
        </div>
      </div>
    </section>
  );
};