import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { QuoteCard } from "@/components/QuoteCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar } from "lucide-react";
import { getQuotesByCategory } from "@/data/quotes";

const QuoteOfTheDay = () => {
  const quotesOfTheDay = getQuotesByCategory("Quote of the Day");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const currentQuote = quotesOfTheDay[currentQuoteIndex];

  const getNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotesOfTheDay.length);
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Quote of the Day</h1>
            </div>
            <p className="text-muted-foreground text-lg mb-2">{formatDate()}</p>
            <p className="text-muted-foreground">Start your day with inspiration and wisdom</p>
          </div>

          {/* Current Quote */}
          {currentQuote && (
            <div className="mb-8">
              <QuoteCard
                id={currentQuote.id}
                quote={currentQuote.quote}
                author={currentQuote.author}
                category={currentQuote.category}
                variant="purple"
              />
            </div>
          )}

          {/* Refresh Button */}
          <div className="text-center mb-12">
            <Button 
              onClick={getNextQuote}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Get Another Quote
            </Button>
          </div>

          {/* Previous Quotes */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">Previous Daily Quotes</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {quotesOfTheDay
                .filter((_, index) => index !== currentQuoteIndex)
                .slice(0, 6)
                .map((quote, index) => (
                  <QuoteCard
                    key={quote.id}
                    id={quote.id}
                    quote={quote.quote}
                    author={quote.author}
                    category={quote.category}
                    variant={["blue", "green", "orange", "pink"][index % 4] as "blue" | "green" | "orange" | "pink"}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuoteOfTheDay;