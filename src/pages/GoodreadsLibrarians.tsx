import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Settings, AlertCircle } from "lucide-react";

const GoodreadsLibrarians = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">Goodreads Librarians Group</h1>
                  <Badge variant="secondary">Official</Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  2,847 members • Active 2 hours ago
                </p>
              </div>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Group Purpose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This group is dedicated to maintaining the accuracy and quality of book records 
                  on Goodreads. Librarians help correct book information, merge duplicate editions, 
                  and ensure that all book data is properly organized and accessible.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How to Request Changes</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Submit book record change requests through our discussion threads. Include 
                        the book title, author, and specific changes needed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Recent Change Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Merge duplicate editions - "The Seven Husbands of Evelyn Hugo"</h4>
                    <p className="text-sm text-muted-foreground">Request to merge multiple ISBN entries</p>
                    <Badge variant="outline" className="mt-2">Pending</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Correct author name - "Circe" by Madeline Miller</h4>
                    <p className="text-sm text-muted-foreground">Fix spelling in author's name</p>
                    <Badge variant="default" className="mt-2">Completed</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-1">Update publication date - "Project Hail Mary"</h4>
                    <p className="text-sm text-muted-foreground">Correct publication year</p>
                    <Badge variant="outline" className="mt-2">In Review</Badge>
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
                  Join Librarians
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Before Requesting:</h4>
                    <p className="text-muted-foreground">Search existing discussions to avoid duplicates</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Include Details:</h4>
                    <p className="text-muted-foreground">Provide ISBN, edition info, and source references</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Be Patient:</h4>
                    <p className="text-muted-foreground">Changes are reviewed by volunteer librarians</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Requests Processed</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Records Updated</span>
                    <span className="font-semibold">892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Librarians</span>
                    <span className="font-semibold">15</span>
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

export default GoodreadsLibrarians;