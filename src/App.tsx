import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/contexts/CartContext";
import { QuotesProvider } from "@/contexts/QuotesContext";
import { QuoteInteractionProvider } from "@/contexts/QuoteInteractionContext";
import { SearchProvider } from "@/contexts/SearchContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Groups from "./pages/Groups";
import CommunityQuotes from "./pages/CommunityQuotes";
import Giveaway from "./pages/Giveaway";
import MyQuotes from "./pages/MyQuotes";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import PaymentSuccess from "./pages/PaymentSuccess";
import ChaptersPreview from "./pages/ChaptersPreview";
import SoccerClub from "./pages/SoccerClub";
import BlogPost from "./pages/BlogPost";
import Collections from "./pages/Collections";
import Topics from "./pages/Topics";
import Newsletter from "./pages/Newsletter";
import WisdomOfAges from "./pages/WisdomOfAges";
import DailyMotivation from "./pages/DailyMotivation";
import CategoryQuotes from "./pages/CategoryQuotes";
import Search from "./pages/Search";

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
            <SearchProvider>
              <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                <Route path="/search" element={<Search />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </BrowserRouter>
              </TooltipProvider>
            </SearchProvider>
          </QuoteInteractionProvider>
        </QuotesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
