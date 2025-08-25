import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { QuotesProvider } from "@/contexts/QuotesContext";
import { QuoteInteractionProvider } from "@/contexts/QuoteInteractionContext";
import { CommentsProvider } from "@/contexts/CommentsContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Groups = lazy(() => import("./pages/Groups"));
const CommunityQuotes = lazy(() => import("./pages/CommunityQuotes"));
const Giveaway = lazy(() => import("./pages/Giveaway"));
const MyQuotes = lazy(() => import("./pages/MyQuotes"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Blog = lazy(() => import("./pages/Blog"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const ChaptersPreview = lazy(() => import("./pages/ChaptersPreview"));
const SoccerClub = lazy(() => import("./pages/SoccerClub"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Collections = lazy(() => import("./pages/Collections"));
const Topics = lazy(() => import("./pages/Topics"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const WisdomOfAges = lazy(() => import("./pages/WisdomOfAges"));
const DailyMotivation = lazy(() => import("./pages/DailyMotivation"));
const CategoryQuotes = lazy(() => import("./pages/CategoryQuotes"));
const QuoteThemes = lazy(() => import("./pages/QuoteThemes"));
const QuoteDetails = lazy(() => import("./pages/QuoteDetails"));
const BookDetails = lazy(() => import("./pages/BookDetails"));
const Search = lazy(() => import("./pages/Search"));
const QuoteOfTheDay = lazy(() => import("./pages/QuoteOfTheDay"));

// Simple inline 404 component to avoid import issues
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-xl text-muted-foreground">Oops! Page not found</p>
      <a href="/" className="text-primary hover:text-primary/80 underline">
        Return to Home
      </a>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <QuotesProvider>
          <QuoteInteractionProvider>
            <CommentsProvider>
              <SearchProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Suspense fallback={
                      <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center space-y-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p className="text-muted-foreground">Loading...</p>
                        </div>
                      </div>
                    }>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/groups" element={<Groups />} />
                        <Route path="/community-quotes" element={<CommunityQuotes />} />
                        <Route path="/giveaway" element={<Giveaway />} />
                        <Route path="/my-quotes" element={<MyQuotes />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/payment-success" element={<PaymentSuccess />} />
                        <Route path="/chapters-preview" element={<ChaptersPreview />} />
                        <Route path="/soccer-club" element={<SoccerClub />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogPost />} />
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/topics" element={<Topics />} />
                        <Route path="/newsletter" element={<Newsletter />} />
                        <Route path="/wisdom-of-ages" element={<WisdomOfAges />} />
                        <Route path="/daily-motivation" element={<DailyMotivation />} />
                        <Route path="/category/:category" element={<CategoryQuotes />} />
                        <Route path="/quote-themes" element={<QuoteThemes />} />
                        <Route path="/quote/:quoteId" element={<QuoteDetails />} />
                        <Route path="/book/:bookId" element={<BookDetails />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/quote-of-the-day" element={<QuoteOfTheDay />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </TooltipProvider>
              </SearchProvider>
            </CommentsProvider>
          </QuoteInteractionProvider>
        </QuotesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
