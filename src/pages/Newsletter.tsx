import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Star, Calendar, Users, Quote } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const newsletterFeatures = [
  {
    icon: Quote,
    title: "Daily Inspiration",
    description: "Receive a carefully curated quote every morning to start your day with purpose"
  },
  {
    icon: Star,
    title: "Featured Collections",
    description: "Get early access to new quote collections before they're released to the public"
  },
  {
    icon: Calendar,
    title: "Weekly Wisdom",
    description: "Deep dive into the stories behind famous quotes and their authors"
  },
  {
    icon: Users,
    title: "Community Highlights",
    description: "Discover the most shared and loved quotes from our growing community"
  }
];

const testimonials = [
  {
    quote: "The QuoteReads newsletter has become an essential part of my morning routine. The quotes are always perfectly timed with what I need to hear.",
    author: "Sarah Johnson",
    role: "Life Coach"
  },
  {
    quote: "I love how the newsletter introduces me to new authors and perspectives. It's like having a personal wisdom curator.",
    author: "Michael Chen",
    role: "Entrepreneur"
  },
  {
    quote: "The community highlights section helps me discover amazing quotes I might have missed. It's my favorite part!",
    author: "Emma Williams",
    role: "Teacher"
  }
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Simulate subscription
    setIsSubscribed(true);
    toast({
      title: "Successfully subscribed!",
      description: "Welcome to the QuoteReads community. Check your email for confirmation."
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">QuoteReads Newsletter</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of quote enthusiasts who start their day with wisdom, inspiration, and community connection.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Daily Delivery
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Personalized
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Always Free
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Subscription Form */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Subscribe to Daily Wisdom</CardTitle>
                <CardDescription>
                  Get inspired every morning with our curated selection of quotes and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isSubscribed ? (
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" className="px-8">
                        Subscribe
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      No spam, unsubscribe at any time. We respect your privacy.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Mail className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">You're All Set!</h3>
                      <p className="text-muted-foreground">
                        Thank you for subscribing. Your first newsletter will arrive tomorrow morning.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">What You'll Receive</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {newsletterFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">What Our Subscribers Say</h2>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <blockquote className="text-muted-foreground mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Community Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12,453</div>
                  <div className="text-sm text-muted-foreground">Newsletter Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98.2%</div>
                  <div className="text-sm text-muted-foreground">Open Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Newsletter</CardTitle>
                <CardDescription>
                  Get a preview of what lands in your inbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <Quote className="h-4 w-4" />
                    Today's Quote
                  </div>
                  <blockquote className="italic text-muted-foreground mb-2">
                    "The only way to do great work is to love what you do."
                  </blockquote>
                  <div className="text-xs text-muted-foreground mb-3">— Steve Jobs</div>
                  
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Reflection
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">
                    Today, consider how passion drives excellence...
                  </p>
                  
                  <div className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Community Favorite
                  </div>
                  <p className="text-muted-foreground text-xs">
                    This week's most shared quote was...
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archive</CardTitle>
                <CardDescription>
                  Browse past newsletters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Archive
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}