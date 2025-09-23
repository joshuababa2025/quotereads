import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  amazon_link?: string;
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
  is_featured: boolean;
  view_count: number;
}

const AdminBooks = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookDialog, setShowBookDialog] = useState(false);
  const [showChapterDialog, setShowChapterDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    cover_image: '',
    categories: '',
    pages: '',
    published_date: '',
    language: 'English',
    isbn: '',
    amazon_link: '',
    buy_link: '',
    product_link: '',
    is_on_sale: false,
    price: ''
  });

  const [chapterForm, setChapterForm] = useState({
    book_id: '',
    title: '',
    author: '',
    category: '',
    description: '',
    content: '',
    cover_image: '',
    buy_link: '',
    published_date: '',
    is_featured: false
  });

  useEffect(() => {
    fetchBooks();
    fetchChapters();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBooks((data || []).map(book => ({
        ...book,
        categories: typeof book.categories === 'string' ? [book.categories] : book.categories || []
      })));
    } catch (error) {
      console.error('Error fetching books:', error);
      toast({
        title: "Error",
        description: "Failed to load books",
        variant: "destructive"
      });
    }
  };

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*, books(title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bookData = {
        ...bookForm,
        categories: bookForm.categories, // Keep as string since DB expects string
        pages: parseInt(bookForm.pages) || 0,
        price: bookForm.price ? parseFloat(bookForm.price) : null,
        published_date: bookForm.published_date || new Date().toISOString().split('T')[0]
      };

      if (editingBook) {
        const { error } = await supabase
          .from('books')
          .update(bookData)
          .eq('id', editingBook.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Book updated successfully" });
      } else {
        const { error } = await supabase
          .from('books')
          .insert([bookData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Book created successfully" });
      }

      setShowBookDialog(false);
      setEditingBook(null);
      resetBookForm();
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast({
        title: "Error",
        description: "Failed to save book",
        variant: "destructive"
      });
    }
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const chapterData = {
        ...chapterForm,
        published_date: chapterForm.published_date || new Date().toISOString().split('T')[0]
      };

      if (editingChapter) {
        const { error } = await supabase
          .from('chapters')
          .update(chapterData)
          .eq('id', editingChapter.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Chapter updated successfully" });
      } else {
        const { error } = await supabase
          .from('chapters')
          .insert([chapterData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Chapter created successfully" });
      }

      setShowChapterDialog(false);
      setEditingChapter(null);
      resetChapterForm();
      fetchChapters();
    } catch (error) {
      console.error('Error saving chapter:', error);
      toast({
        title: "Error",
        description: "Failed to save chapter",
        variant: "destructive"
      });
    }
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      cover_image: '',
      categories: '',
      pages: '',
      published_date: '',
      language: 'English',
      isbn: '',
      amazon_link: '',
      buy_link: '',
      product_link: '',
      is_on_sale: false,
      price: ''
    });
  };

  const resetChapterForm = () => {
    setChapterForm({
      book_id: '',
      title: '',
      author: '',
      category: '',
      description: '',
      content: '',
      cover_image: '',
      buy_link: '',
      published_date: '',
      is_featured: false
    });
  };

  const editBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      cover_image: book.cover_image || '',
      categories: book.categories.join(', '),
      pages: book.pages.toString(),
      published_date: book.published_date,
      language: book.language,
      isbn: book.isbn,
      amazon_link: book.amazon_link || '',
      buy_link: book.buy_link || '',
      product_link: book.product_link || '',
      is_on_sale: book.is_on_sale,
      price: book.price?.toString() || ''
    });
    setShowBookDialog(true);
  };

  const editChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterForm({
      book_id: chapter.book_id,
      title: chapter.title,
      author: chapter.author,
      category: chapter.category,
      description: chapter.description,
      content: chapter.content || '',
      cover_image: chapter.cover_image || '',
      published_date: chapter.published_date,
      is_featured: chapter.is_featured
    });
    setShowChapterDialog(true);
  };

  const deleteBook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Book deleted successfully" });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive"
      });
    }
  };

  const deleteChapter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;
    
    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Chapter deleted successfully" });
      fetchChapters();
    } catch (error) {
      console.error('Error deleting chapter:', error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive"
      });
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Admin - Books & Chapters</h1>
          
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books">Books ({books.length})</TabsTrigger>
              <TabsTrigger value="chapters">Chapters ({chapters.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="books" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Books</h2>
                <Dialog open={showBookDialog} onOpenChange={setShowBookDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetBookForm(); setEditingBook(null); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBookSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={bookForm.title}
                            onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="author">Author</Label>
                          <Input
                            id="author"
                            value={bookForm.author}
                            onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={bookForm.description}
                          onChange={(e) => setBookForm({...bookForm, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cover_image">Cover Image URL</Label>
                          <Input
                            id="cover_image"
                            value={bookForm.cover_image}
                            onChange={(e) => setBookForm({...bookForm, cover_image: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="categories">Categories (comma-separated)</Label>
                          <Input
                            id="categories"
                            value={bookForm.categories}
                            onChange={(e) => setBookForm({...bookForm, categories: e.target.value})}
                            placeholder="Self-Help, Psychology, Communication"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="pages">Pages</Label>
                          <Input
                            id="pages"
                            type="number"
                            value={bookForm.pages}
                            onChange={(e) => setBookForm({...bookForm, pages: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="published_date">Published Date</Label>
                          <Input
                            id="published_date"
                            type="date"
                            value={bookForm.published_date}
                            onChange={(e) => setBookForm({...bookForm, published_date: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="isbn">ISBN</Label>
                          <Input
                            id="isbn"
                            value={bookForm.isbn}
                            onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="amazon_link">Amazon Link</Label>
                          <Input
                            id="amazon_link"
                            value={bookForm.amazon_link}
                            onChange={(e) => setBookForm({...bookForm, amazon_link: e.target.value})}
                            placeholder="https://amazon.com/book-title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="buy_link">Buy Now Link (Main Purchase Link)</Label>
                          <Input
                            id="buy_link"
                            value={bookForm.buy_link}
                            onChange={(e) => setBookForm({...bookForm, buy_link: e.target.value})}
                            placeholder="https://bookstore.com/buy/book-title"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="product_link">Product Link (Alternative/Sale Link)</Label>
                        <Input
                          id="product_link"
                          value={bookForm.product_link}
                          onChange={(e) => setBookForm({...bookForm, product_link: e.target.value})}
                          placeholder="https://special-offer.com/book-title"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="is_on_sale"
                            checked={bookForm.is_on_sale}
                            onCheckedChange={(checked) => setBookForm({...bookForm, is_on_sale: checked})}
                          />
                          <Label htmlFor="is_on_sale">On Sale</Label>
                        </div>
                        {bookForm.is_on_sale && (
                          <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={bookForm.price}
                              onChange={(e) => setBookForm({...bookForm, price: e.target.value})}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowBookDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingBook ? 'Update' : 'Create'} Book
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-4">
                {books.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                          <p className="text-muted-foreground mb-2">by {book.author}</p>
                          <p className="text-sm text-muted-foreground mb-3">{book.description.substring(0, 150)}...</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {book.categories.map((category) => (
                              <Badge key={category} variant="secondary">{category}</Badge>
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {book.pages} pages • {book.language} • {book.is_on_sale ? `$${book.price}` : 'Not for sale'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => editBook(book)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteBook(book.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="chapters" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Chapters</h2>
                <Dialog open={showChapterDialog} onOpenChange={setShowChapterDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetChapterForm(); setEditingChapter(null); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Chapter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Add New Chapter'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChapterSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="book_id">Book</Label>
                        <Select value={chapterForm.book_id} onValueChange={(value) => setChapterForm({...chapterForm, book_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a book" />
                          </SelectTrigger>
                          <SelectContent>
                            {books.map((book) => (
                              <SelectItem key={book.id} value={book.id}>{book.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chapter_title">Title</Label>
                          <Input
                            id="chapter_title"
                            value={chapterForm.title}
                            onChange={(e) => setChapterForm({...chapterForm, title: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="chapter_author">Author</Label>
                          <Input
                            id="chapter_author"
                            value={chapterForm.author}
                            onChange={(e) => setChapterForm({...chapterForm, author: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input
                            id="category"
                            value={chapterForm.category}
                            onChange={(e) => setChapterForm({...chapterForm, category: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="chapter_published_date">Published Date</Label>
                          <Input
                            id="chapter_published_date"
                            type="date"
                            value={chapterForm.published_date}
                            onChange={(e) => setChapterForm({...chapterForm, published_date: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="chapter_description">Description</Label>
                        <Textarea
                          id="chapter_description"
                          value={chapterForm.description}
                          onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={chapterForm.content}
                          onChange={(e) => setChapterForm({...chapterForm, content: e.target.value})}
                          rows={8}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chapter_cover_image">Cover Image URL</Label>
                          <Input
                            id="chapter_cover_image"
                            value={chapterForm.cover_image}
                            onChange={(e) => setChapterForm({...chapterForm, cover_image: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="chapter_buy_link">Buy Link</Label>
                          <Input
                            id="chapter_buy_link"
                            value={chapterForm.buy_link}
                            onChange={(e) => setChapterForm({...chapterForm, buy_link: e.target.value})}
                            placeholder="https://store.com/buy-book"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={chapterForm.is_featured}
                          onCheckedChange={(checked) => setChapterForm({...chapterForm, is_featured: checked})}
                        />
                        <Label htmlFor="is_featured">Featured Chapter</Label>
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowChapterDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingChapter ? 'Update' : 'Create'} Chapter
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-4">
                {chapters.map((chapter) => (
                  <Card key={chapter.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{chapter.title}</h3>
                            {chapter.is_featured && <Badge>Featured</Badge>}
                          </div>
                          <p className="text-muted-foreground mb-2">by {chapter.author} • {chapter.category}</p>
                          <p className="text-sm text-muted-foreground mb-3">{chapter.description.substring(0, 150)}...</p>
                          <div className="text-sm text-muted-foreground">
                            {chapter.view_count} views • {new Date(chapter.published_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => editChapter(chapter)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteChapter(chapter.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminBooks;