import { Navigation } from "@/components/Navigation";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { HeroSection } from "@/components/HeroSection";
import { CategoryButtons } from "@/components/CategoryButtons";
import { TrendingQuotes } from "@/components/TrendingQuotes";
import { PersonalizedQuotes } from "@/components/PersonalizedQuotes";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { Footer } from "@/components/Footer";
import { SignUpSidebar } from "@/components/SignUpSidebar";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";
import { LatestBlogPosts } from "@/components/LatestBlogPosts";
import { useState, useEffect } from "react";

const Index = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Listen for popup state changes from Navigation component
  useEffect(() => {
    const handlePopupChange = (event: CustomEvent) => {
      setIsPopupOpen(event.detail.isOpen);
    };

    window.addEventListener('popupStateChange', handlePopupChange as EventListener);
    return () => window.removeEventListener('popupStateChange', handlePopupChange as EventListener);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 container mx-auto px-4 py-6 lg:py-8">
        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Section */}
          <div className="mb-6 lg:mb-8">
            <HeroSection />
          </div>

          {/* Category Buttons */}
          <CategoryButtons />

          {/* Trending Quotes */}
          <TrendingQuotes />

          {/* Personalized Quotes */}
          <PersonalizedQuotes />

          {/* Featured Collections */}
          <FeaturedCollections />
        </main>

        {/* Sidebar */}
        <aside className="lg:w-80 space-y-4 lg:space-y-6">
          <div className={`transition-opacity duration-300 ${isPopupOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <SignUpSidebar />
          </div>
          <QuoteOfTheDay />
          <LatestBlogPosts />
        </aside>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
