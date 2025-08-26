import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const ReadWithJenna = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/lovable-uploads/9d58d4ed-24f5-4c0b-8162-e3462157af1e.png" 
                alt="Read With Jenna" 
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">Read With Jenna</h1>
                  <Crown className="w-6 h-6 text-yellow-500" />
                  <Badge variant="secondary">Official</Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  39,649 members • Active a month ago
                </p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  About This Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When anyone on the TODAY team is looking for a book recommendation, there is only 
                  one person to turn to: Jenna Bush Hager. Jenna selects a book each month for our 
                  official book club, featuring diverse authors and compelling stories that bring 
                  people together through the power of reading.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Book Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="w-16 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">This month's pick coming soon!</h3>
                    <p className="text-sm text-muted-foreground">
                      Stay tuned for Jenna's next book recommendation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Discussions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Group Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Members</span>
                  <span className="font-semibold">39,649</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Books Read</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Active Discussions</span>
                  <span className="font-semibold">156</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">New book announcement coming this week</p>
                  <p className="text-muted-foreground">Discussion threads now open for previous selection</p>
                  <p className="text-muted-foreground">Welcome 500+ new members this month!</p>
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

export default ReadWithJenna;