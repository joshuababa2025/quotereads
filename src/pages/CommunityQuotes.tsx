import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share } from "lucide-react";

const CommunityQuotes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-6">Popular quotes</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <Input 
                  placeholder="Find quotes by keyword, author" 
                  className="flex-1"
                />
                <Button>Search</Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-8 border-b border-border mb-6">
                <button className="pb-2 border-b-2 border-primary text-primary font-medium">Popular</button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">Recent</button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">New</button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">Friends</button>
                <button className="pb-2 text-muted-foreground hover:text-foreground">Authors</button>
              </div>
            </div>

            {/* Quote Cards */}
            <div className="space-y-6">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" />
                        <AvatarFallback>OW</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <blockquote className="text-lg font-medium mb-2">
                          "Be yourself; everyone else is already taken."
                        </blockquote>
                        <p className="text-muted-foreground mb-3">— Oscar Wilde</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          <Badge variant="outline" className="text-xs">attributed-no-source</Badge>
                          <Badge variant="outline" className="text-xs">be-yourself</Badge>
                          <Badge variant="outline" className="text-xs">gilbert-perreira</Badge>
                          <Badge variant="outline" className="text-xs">honesty</Badge>
                          <Badge variant="outline" className="text-xs">inspirational</Badge>
                          <Badge variant="outline" className="text-xs">misattributed-oscar-wilde</Badge>
                          <Badge variant="outline" className="text-xs">quote-investigator</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">175256 likes</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Share</Button>
                            <Button variant="outline" size="sm">Discuss</Button>
                            <Button variant="outline" size="sm">
                              <Heart className="w-4 h-4 mr-1" />
                              Like
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">BROWSE BY TAG</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <Input placeholder="Search for a tag" className="flex-1" />
                  <Button variant="secondary" size="sm">Search</Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <a href="#" className="block text-primary hover:underline">Love Quotes 99.5k</a>
                    <a href="#" className="block text-primary hover:underline">Life Quotes 78k</a>
                    <a href="#" className="block text-primary hover:underline">Inspirational 65k</a>
                    <a href="#" className="block text-primary hover:underline">Humor 54k</a>
                    <a href="#" className="block text-primary hover:underline">Philosophy 43k</a>
                    <a href="#" className="block text-primary hover:underline">God 38k</a>
                    <a href="#" className="block text-primary hover:underline">Wisdom 32k</a>
                    <a href="#" className="block text-primary hover:underline">Romance 29k</a>
                    <a href="#" className="block text-primary hover:underline">Hope 26k</a>
                    <a href="#" className="block text-primary hover:underline">Poetry 24k</a>
                    <a href="#" className="block text-primary hover:underline">Death 22k</a>
                    <a href="#" className="block text-primary hover:underline">Happiness 19.5k</a>
                    <a href="#" className="block text-primary hover:underline">Life Quotes 78k</a>
                    <a href="#" className="block text-primary hover:underline">Inspirational 65k</a>
                    <a href="#" className="block text-primary hover:underline">Humor 54k</a>
                    <a href="#" className="block text-primary hover:underline">Philosophy 43k</a>
                    <a href="#" className="block text-primary hover:underline">God 38k</a>
                  </div>
                  
                  <div className="space-y-1">
                    <a href="#" className="block text-primary hover:underline">Love Quotes 99.5k</a>
                    <a href="#" className="block text-primary hover:underline">Life Quotes 78k</a>
                    <a href="#" className="block text-primary hover:underline">Inspirational 65k</a>
                    <a href="#" className="block text-primary hover:underline">Humor 54k</a>
                    <a href="#" className="block text-primary hover:underline">Philosophy 43k</a>
                    <a href="#" className="block text-primary hover:underline">God 38k</a>
                    <a href="#" className="block text-primary hover:underline">Wisdom 32k</a>
                    <a href="#" className="block text-primary hover:underline">Romance 29k</a>
                    <a href="#" className="block text-primary hover:underline">Hope 26k</a>
                    <a href="#" className="block text-primary hover:underline">Poetry 24k</a>
                    <a href="#" className="block text-primary hover:underline">Death 22k</a>
                    <a href="#" className="block text-primary hover:underline">Happiness 19.5k</a>
                    <a href="#" className="block text-primary hover:underline">Life Quotes 78k</a>
                    <a href="#" className="block text-primary hover:underline">Inspirational 65k</a>
                    <a href="#" className="block text-primary hover:underline">Humor 54k</a>
                    <a href="#" className="block text-primary hover:underline">Philosophy 43k</a>
                    <a href="#" className="block text-primary hover:underline">God 38k</a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityQuotes;