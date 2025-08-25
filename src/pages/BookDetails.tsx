import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Star, Heart, Share2, MessageCircle, ShoppingBag, Plus } from "lucide-react";
import { BookRating } from "@/components/BookRating";
import { BookShelves } from "@/components/BookShelves";
import { CommentSection } from "@/components/CommentSection";
import { ShareDialog } from "@/components/ShareDialog";
import { useState } from "react";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [showShelves, setShowShelves] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Mock book data - in real app, fetch based on bookId
  const books = {
    1: {
      id: 1,
      title: "The Power Behind Quiet Words",
      author: "Aria Thompson",
      date: "June 22, 2025",
      category: "Self-Inspiration",
      isbn: "978-0-123456-78-9",
      pages: 284,
      language: "English",
      publisher: "Wisdom Press",
      description: "There are some words that don't need to be loud to make an impact. Sometimes the quietest whispers carry the most profound truths, touching hearts in ways that thunderous proclamations never could. In this profound exploration of the power of understated wisdom, Aria Thompson takes readers on a journey through the subtle art of meaningful communication.",
      fullDescription: "Drawing from years of research in psychology, linguistics, and philosophy, Thompson reveals how the most transformative messages often come not from grand gestures or loud proclamations, but from the gentle, thoughtful words spoken at just the right moment. Through compelling stories, practical exercises, and deep insights, this book shows readers how to harness the incredible power of quiet words to create lasting change in their relationships, careers, and personal growth.",
      rating: 4.3,
      ratingsCount: 1247,
      reviewsCount: 89,
      genres: ["Self-Help", "Psychology", "Communication", "Personal Development"],
      amazonUrl: "https://amazon.com/power-behind-quiet-words"
    },
    2: {
      id: 2,
      title: "Writing Through Pain: A Conversation with Maya Chen",
      author: "Editorial Team",
      date: "June 15, 2025",
      category: "Author Interviews",
      isbn: "978-0-123456-79-0",
      pages: 156,
      language: "English",
      publisher: "Literary Insights",
      description: "In our exclusive interview with bestselling author Maya Chen, we explore how personal struggles become the foundation for her most powerful quotes and how vulnerability transforms into strength.",
      fullDescription: "This intimate conversation reveals the creative process behind some of the most moving quotes of our time. Maya Chen opens up about her journey through adversity, loss, and healing, showing how pain can become a powerful catalyst for meaningful writing. Through candid discussions and behind-the-scenes insights, readers gain a deeper understanding of how authentic expression emerges from life's most challenging moments.",
      rating: 4.7,
      ratingsCount: 892,
      reviewsCount: 67,
      genres: ["Biography", "Writing", "Inspiration", "Memoir"],
      amazonUrl: "https://amazon.com/writing-through-pain-maya-chen"
    },
    3: {
      id: 3,
      title: "The History Behind 'In the Middle of Difficulty Lies Opportunity'",
      author: "Dr. Robert Rivera",
      date: "June 8, 2025",
      category: "History of Quotes",
      isbn: "978-0-123456-80-6",
      pages: 342,
      language: "English",
      publisher: "Historical Wisdom Press",
      description: "Einstein's famous words have inspired millions, but what was the context behind this profound observation? This article explores the fascinating story of how this quote came to be during one of history's most challenging periods.",
      fullDescription: "Dr. Robert Rivera, renowned historian and Einstein scholar, takes readers on a fascinating journey through the historical context that gave birth to one of history's most enduring quotes. Through meticulous research and compelling storytelling, Rivera reveals the circumstances, challenges, and insights that led Einstein to this profound observation about finding opportunity within difficulty.",
      rating: 4.5,
      ratingsCount: 2156,
      reviewsCount: 134,
      genres: ["History", "Biography", "Philosophy", "Science"],
      amazonUrl: "https://amazon.com/history-difficulty-opportunity-einstein"
    }
  };

  const book = books[parseInt(bookId || "0") as keyof typeof books];

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Book Not Found</h1>
          <Button onClick={() => navigate("/chapters-preview")}>
            Back to Chapters
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Book Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted-foreground/20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-24 w-24 text-muted-foreground/50" />
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{book.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <BookRating rating={book.rating} />
                <span className="text-sm text-muted-foreground">
                  {book.rating} · {book.ratingsCount.toLocaleString()} ratings · {book.reviewsCount} reviews
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {book.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                onClick={() => setShowShelves(true)}
              >
                <Plus className="h-4 w-4" />
                Want to Read
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.open(book.amazonUrl, '_blank')}
              >
                <ShoppingBag className="h-4 w-4" />
                Buy on Amazon
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowShare(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Pages:</span>
                <p className="font-medium">{book.pages}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Published:</span>
                <p className="font-medium">{book.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Language:</span>
                <p className="font-medium">{book.language}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ISBN:</span>
                <p className="font-medium">{book.isbn}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Content Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({book.reviewsCount})</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">About this book</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {book.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {book.fullDescription}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Reviews & Comments</h3>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
                <CommentSection quoteId={`book-${book.id}`} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Book Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Publisher:</span>
                      <p className="font-medium">{book.publisher}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Publication Date:</span>
                      <p className="font-medium">{book.date}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Pages:</span>
                      <p className="font-medium">{book.pages}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Language:</span>
                      <p className="font-medium">{book.language}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">ISBN:</span>
                      <p className="font-medium">{book.isbn}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <p className="font-medium">{book.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Average Rating:</span>
                      <p className="font-medium">{book.rating}/5</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Ratings:</span>
                      <p className="font-medium">{book.ratingsCount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <BookShelves 
        open={showShelves} 
        onOpenChange={setShowShelves}
        bookTitle={book.title}
      />
      
      <ShareDialog 
        open={showShare}
        onOpenChange={setShowShare}
        title={book.title}
        url={`/book/${book.id}`}
      />
      
      <Footer />
    </div>
  );
};

export default BookDetails;