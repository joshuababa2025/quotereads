import { QuoteCard } from "./QuoteCard";
import { useNavigate } from "react-router-dom";

const personalizedQuotes = [
  {
    id: "personal-1",
    quote: "Success is not final, failure is not fatal.",
    author: "Winston Churchill",
    category: "Motivation",
    variant: "green" as const
  },
  {
    id: "personal-2",
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "Dreams",
    variant: "pink" as const
  },
  {
    id: "personal-3",
    quote: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "Hope",
    variant: "blue" as const
  }
];

export const PersonalizedQuotes = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What will you discover?
          </h2>
          <p className="text-muted-foreground">
            Because Aisha liked motivational quotes...
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personalizedQuotes.map((quote, index) => (
            <QuoteCard
              key={quote.id}
              id={quote.id}
              quote={quote.quote}
              author={quote.author}
              category={quote.category}
              variant={quote.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};