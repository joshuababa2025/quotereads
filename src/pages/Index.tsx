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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Announcement Banner */}
      <AnnouncementBanner />
      
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 container mx-auto px-4 py-8">
        {/* Main Content Area */}
        <main className="flex-1">
          {/* Hero Section */}
          <div className="mb-8">
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
        <aside className="lg:w-80 space-y-6">
          <SignUpSidebar />
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
