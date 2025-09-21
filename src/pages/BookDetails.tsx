import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Heart, Share2, ExternalLink, Calendar, BookOpen, Globe, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image?: string;
  rating: number;
  rating_count: number;
  review_count: number;
  categories: string[];
  pages: number;
  published_date: string;
  language: string;
  isbn: string;
  buy_link?: string;
  product_link?: string;
  is_on_sale: boolean;
  price?: number;
}

interface Chapter {
  id: string;
  book_id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  content?: string;
  cover_image?: string;
  published_date: string;
  view_count: number;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  is_verified: boolean;
  created_at: string;
}

const BookDetails = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const id = bookId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, review_text: '', reviewer_name: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    console.log('useEffect running with id:', id);
    if (id) {
      fetchBookOrChapter();
      fetchReviews();
    } else {
      console.log('No ID found');
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = async () => {
    const bookIdToUse = book?.id || chapter?.book_id || id;
    if (!bookIdToUse) return;
    
    try {
      const { data, error } = await supabase
        .from('book_reviews')
        .select('*')
        .eq('book_id', bookIdToUse)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.review_text.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review",
        variant: "destructive"
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    // Use book.id if available, otherwise chapter's book_id, otherwise the id parameter
    const bookIdToUse = book?.id || chapter?.book_id || id;
    
    if (!bookIdToUse) {
      toast({
        title: "Error",
        description: "Unable to identify book for review",
        variant: "destructive"
      });
      return;
    }

    setSubmittingReview(true);
    
    try {
      const { error } = await supabase
        .from('book_reviews')
        .insert({
          book_id: bookIdToUse,
          user_id: user.id,
          rating: newReview.rating,
          review_text: newReview.review_text,
          reviewer_name: newReview.reviewer_name || user.email?.split('@')[0] || 'Anonymous'
        });
      
      if (error) throw error;
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!"
      });
      
      setNewReview({ rating: 0, review_text: '', reviewer_name: '' });
      fetchReviews();
      fetchBookOrChapter(); // Refresh book data for updated ratings
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const fetchBookOrChapter = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      // Try chapter first
      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (chapterData) {
        setChapter(chapterData);
        
        // Get book for this chapter
        if (chapterData.book_id) {
          const { data: bookData, error: bookError } = await supabase
            .from('books')
            .select('*')
            .eq('id', chapterData.book_id)
            .single();
            
          if (bookData) {
            setBook(bookData);
          }
        }
      } else {
        // Try as book
        const { data: bookData, error: bookError } = await supabase
          .from('books')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (bookData) {
          setBook(bookData);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const title = chapter?.title || book?.title || '';
    const shareText = `Check out "${title}" on QuoteReads`;
    
    if (navigator.share) {
      navigator.share({
        title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard"
      });
    }
  };



  const handlePurchase = () => {
    if (book?.buy_link) {
      const url = book.buy_link.startsWith('http') ? book.buy_link : `https://${book.buy_link}`;
      window.open(url, '_blank');
    }
  };

  const handleWantToRead = () => {
    if (book?.is_on_sale && book?.product_link) {
      const url = book.product_link.startsWith('http') ? book.product_link : `https://${book.product_link}`;
      window.open(url, '_blank');
    } else {
      setIsLiked(!isLiked);
      toast({
        title: isLiked ? "Removed from favorites" : "Added to favorites",
        description: isLiked ? "Book removed from your favorites" : "Book added to your favorites"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-400/50 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Content not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                {(chapter?.cover_image || book.cover_image) ? (
                  <img 
                    src={chapter?.cover_image || book.cover_image} 
                    alt={chapter?.title || book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {chapter?.title || book.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                by {chapter?.author || book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(book.rating)}
                </div>
                <span className="font-semibold">{book.rating}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{book.rating_count?.toLocaleString() || 0} ratings</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{book.review_count} reviews</span>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2">CATEGORIES:</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(book.categories) ? book.categories : []).map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6">
                {book.buy_link && (
                  <Button onClick={handlePurchase} className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Buy Now{book.price && ` $${book.price}`}
                  </Button>
                )}
                
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              {/* Book Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Pages:</p>
                  <p className="text-muted-foreground">{book.pages}</p>
                </div>
                <div>
                  <p className="font-semibold">Published:</p>
                  <p className="text-muted-foreground">{formatDate(book.published_date)}</p>
                </div>
                <div>
                  <p className="font-semibold">Language:</p>
                  <p className="text-muted-foreground">{book.language}</p>
                </div>
                <div>
                  <p className="font-semibold">ISBN:</p>
                  <p className="text-muted-foreground">{book.isbn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({book.review_count})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {chapter?.content ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap">{chapter.content}</div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      {book.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Write Review */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Rating</Label>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-6 w-6 cursor-pointer ${
                                i < newReview.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                              onClick={() => setNewReview({...newReview, rating: i + 1})}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="reviewer_name">Name (optional)</Label>
                        <Input
                          id="reviewer_name"
                          value={newReview.reviewer_name}
                          onChange={(e) => setNewReview({...newReview, reviewer_name: e.target.value})}
                          placeholder="Your name or leave blank for default"
                        />
                      </div>
                      <div>
                        <Label htmlFor="review_text">Review</Label>
                        <Textarea
                          id="review_text"
                          value={newReview.review_text}
                          onChange={(e) => setNewReview({...newReview, review_text: e.target.value})}
                          placeholder="Share your thoughts about this book..."
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={submitReview} 
                        disabled={submittingReview}
                        className="w-full"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">{review.reviewer_name}</span>
                                {review.is_verified && (
                                  <Badge variant="secondary" className="text-xs">Verified</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.review_text}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Publication Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Pages:</span>
                          <span>{book.pages}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Published:</span>
                          <span>{formatDate(book.published_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Language:</span>
                          <span>{book.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ISBN:</span>
                          <span>{book.isbn}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(book.categories) ? book.categories : []).map((category) => (
                          <Badge key={category} variant="outline">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookDetails;