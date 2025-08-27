import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Printer, FileText, Download, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserQuote {
  id: string;
  content: string;
  author?: string;
  category?: string;
  created_at: string;
}

const MyQuotesPrint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [likedQuotes, setLikedQuotes] = useState<any[]>([]);
  const [favoritedQuotes, setFavoritedQuotes] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('my-quotes');
  const [layout, setLayout] = useState<string>('list');
  const [includeAuthor, setIncludeAuthor] = useState(true);
  const [includeCategory, setIncludeCategory] = useState(true);
  const [includeDate, setIncludeDate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!user) return;

      try {
        // Fetch user's posted quotes
        const { data: userQuotes } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_hidden', false)
          .order('created_at', { ascending: false });

        // Fetch liked quotes
        const { data: liked } = await supabase
          .from('liked_quotes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch favorited quotes
        const { data: favorited } = await supabase
          .from('favorited_quotes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setQuotes(userQuotes || []);
        setLikedQuotes(liked || []);
        setFavoritedQuotes(favorited || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user]);

  const getCurrentQuotes = () => {
    switch (selectedCollection) {
      case 'my-quotes':
        return quotes.map(q => ({
          content: q.content,
          author: q.author,
          category: q.category,
          created_at: q.created_at
        }));
      case 'liked':
        return likedQuotes.map(q => ({
          content: q.quote_content,
          author: q.quote_author,
          category: q.quote_category,
          created_at: q.created_at
        }));
      case 'favorited':
        return favoritedQuotes.map(q => ({
          content: q.quote_content,
          author: q.quote_author,
          category: q.quote_category,
          created_at: q.created_at
        }));
      default:
        return [];
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const quotesToPrint = getCurrentQuotes();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Quotes Collection</title>
          <style>
            body { 
              font-family: Georgia, serif; 
              line-height: 1.6; 
              margin: 40px;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .quote { 
              margin-bottom: ${layout === 'grid' ? '30px' : '40px'}; 
              ${layout === 'grid' ? 'display: inline-block; width: 45%; margin-right: 5%; vertical-align: top;' : ''}
              page-break-inside: avoid;
            }
            .quote-content { 
              font-style: italic; 
              font-size: 18px; 
              margin-bottom: 10px;
              line-height: 1.8;
            }
            .quote-author { 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .quote-category { 
              color: #666; 
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .quote-date { 
              color: #999; 
              font-size: 12px;
              margin-top: 5px;
            }
            @media print {
              body { margin: 20px; }
              .quote { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>My Quotes Collection</h1>
            <p>Collection: ${selectedCollection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p>Total Quotes: ${quotesToPrint.length}</p>
          </div>
          ${quotesToPrint.map(quote => `
            <div class="quote">
              <div class="quote-content">"${quote.content}"</div>
              ${includeAuthor && quote.author ? `<div class="quote-author">— ${quote.author}</div>` : ''}
              ${includeCategory && quote.category ? `<div class="quote-category">${quote.category}</div>` : ''}
              ${includeDate ? `<div class="quote-date">${new Date(quote.created_at).toLocaleDateString()}</div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleExportPDF = () => {
    // For now, we'll use the print function which allows saving as PDF
    handlePrint();
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-lg">Loading your quotes...</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentQuotes = getCurrentQuotes();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/my-quotes')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Quotes
            </Button>
            <h1 className="text-3xl font-bold">Print & Export Quotes</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Print Settings</CardTitle>
                  <CardDescription>
                    Customize how your quotes will appear when printed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Collection Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="collection">Collection</Label>
                    <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                      <SelectTrigger id="collection">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="my-quotes">My Posted Quotes ({quotes.length})</SelectItem>
                        <SelectItem value="liked">Liked Quotes ({likedQuotes.filter(q => q.interaction_type === 'like').length})</SelectItem>
                        <SelectItem value="favorited">Saved for Later ({favoritedQuotes.length})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Layout */}
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout</Label>
                    <Select value={layout} onValueChange={setLayout}>
                      <SelectTrigger id="layout">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="grid">Grid View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Include Options */}
                  <div className="space-y-3">
                    <Label>Include in Print</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="author" 
                          checked={includeAuthor}
                          onCheckedChange={(checked) => setIncludeAuthor(checked as boolean)}
                        />
                        <Label htmlFor="author">Author Names</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="category" 
                          checked={includeCategory}
                          onCheckedChange={(checked) => setIncludeCategory(checked as boolean)}
                        />
                        <Label htmlFor="category">Categories</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="date" 
                          checked={includeDate}
                          onCheckedChange={(checked) => setIncludeDate(checked as boolean)}
                        />
                        <Label htmlFor="date">Dates</Label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handlePrint} 
                      className="w-full flex items-center gap-2"
                      disabled={currentQuotes.length === 0}
                    >
                      <Printer className="w-4 h-4" />
                      Print Quotes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleExportPDF}
                      className="w-full flex items-center gap-2"
                      disabled={currentQuotes.length === 0}
                    >
                      <Download className="w-4 h-4" />
                      Export as PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Print Preview
                  </CardTitle>
                  <CardDescription>
                    Preview how your quotes will look when printed ({currentQuotes.length} quotes)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentQuotes.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No quotes found in the selected collection.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white">
                      <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                        <h2 className="text-2xl font-bold mb-2">My Quotes Collection</h2>
                        <p className="text-sm text-gray-600">
                          Collection: {selectedCollection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600">Total Quotes: {currentQuotes.length}</p>
                      </div>
                      
                      <div className={layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                        {currentQuotes.slice(0, 10).map((quote, index) => (
                          <div key={index} className="break-inside-avoid">
                            <p className="text-lg italic mb-2 leading-relaxed">"{quote.content}"</p>
                            {includeAuthor && quote.author && (
                              <p className="font-semibold mb-1">— {quote.author}</p>
                            )}
                            {includeCategory && quote.category && (
                              <p className="text-sm text-gray-600 uppercase tracking-wide">{quote.category}</p>
                            )}
                            {includeDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(quote.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                        {currentQuotes.length > 10 && (
                          <div className="text-center text-gray-500 italic col-span-full">
                            ... and {currentQuotes.length - 10} more quotes
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyQuotesPrint;