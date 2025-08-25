import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChaptersPreview = () => {
  const navigate = useNavigate();
  const chapters = [
    {
      id: 1,
      title: "The Power Behind Quiet Words",
      author: "Aria Thompson",
      date: "June 22, 2025",
      category: "Self-Inspiration",
      description: "There are some words that don't need to be loud to make an impact. Sometimes the quietest whispers carry the most profound truths, touching hearts in ways that thunderous proclamations never could.",
      image: "/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png",
      readMore: "Read more →"
    },
    {
      id: 2,
      title: "Writing Through Pain: A Conversation with Maya Chen",
      author: "Editorial Team",
      date: "June 15, 2025",
      category: "Author Interviews",
      description: "In our exclusive interview with bestselling author Maya Chen, we explore how personal struggles become the foundation for her most powerful quotes and how vulnerability transforms into strength.",
      image: "/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png",
      readMore: "Read more →"
    },
    {
      id: 3,
      title: "The History Behind 'In the Middle of Difficulty Lies Opportunity'",
      author: "Dr. Robert Rivera",
      date: "June 8, 2025",
      category: "History of Quotes",
      description: "Einstein's famous words have inspired millions, but what was the context behind this profound observation? This article explores the fascinating story of how this quote came to be during one of history's most challenging periods.",
      image: "/lovable-uploads/d6ef49b8-d427-4023-8085-e6fd9a0aacf9.png",
      readMore: "Read more →"
    }
  ];

  const topics = [
    { name: "Self-Inspiration", color: "bg-orange-100 text-orange-800", path: "/category/inspiration" },
    { name: "Author Highlights", color: "bg-blue-100 text-blue-800", path: "/category/wisdom" },
    { name: "Writing Tips", color: "bg-green-100 text-green-800", path: "/category/creativity" },
    { name: "Faith & Spirituality", color: "bg-purple-100 text-purple-800", path: "/category/spirituality" },
    { name: "Love & Relationships", color: "bg-pink-100 text-pink-800", path: "/category/love" },
    { name: "Personal Growth", color: "bg-yellow-100 text-yellow-800", path: "/category/growth" }
  ];

  const mostRead = [
    { id: 1, title: "5 Morning Quotes That Changed My Life", author: "Sarah Miles" },
    { id: 2, title: "Finding Hope in Dark Times", author: "Sarah Miles" },
    { id: 3, title: "The Art of Collecting Wisdom", author: "Sarah Miles" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Chapters Preview</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, reflections, and stories behind the words that move us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="overflow-hidden">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {chapter.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      By {chapter.author} • {chapter.date}
                    </span>
                  </div>
                  <h2 
                    className="text-2xl font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/book/${chapter.id}`)}
                  >
                    {chapter.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {chapter.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 p-0"
                    onClick={() => navigate(`/book/${chapter.id}`)}
                  >
                    {chapter.readMore}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 pt-8">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="ghost" size="sm">2</Button>
              <Button variant="ghost" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Explore Topics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Explore Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge 
                      key={topic.name} 
                      className={`${topic.color} cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => navigate(topic.path)}
                    >
                      {topic.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Most Read This Week */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Most Read This Week</h3>
                <div className="space-y-3">
                  {mostRead.map((item) => (
                    <div 
                      key={item.id} 
                      className="text-sm hover:text-primary cursor-pointer transition-colors"
                      onClick={() => navigate(`/book/${item.id}`)}
                    >
                      <span className="text-muted-foreground">by {item.author}</span>
                      <p className="font-medium">{item.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quote of the Day */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quote of the Day</h3>
                <blockquote className="text-lg font-medium mb-2">
                  "In the middle of every difficulty lies opportunity."
                </blockquote>
                <cite className="text-sm opacity-90">- Albert Einstein</cite>
              </CardContent>
            </Card>

            {/* Share Your Story */}
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Share Your Story</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Want to share your quote journey or personal reflections?
                </p>
                <Button className="w-full">Submit a Post</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChaptersPreview;