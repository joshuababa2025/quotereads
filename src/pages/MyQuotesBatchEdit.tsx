import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Trash2, Archive, Eye, EyeOff, Edit3, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserQuote {
  id: string;
  content: string;
  author?: string;
  category?: string;
  is_hidden: boolean;
  created_at: string;
}

const MyQuotesBatchEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<UserQuote[]>([]);
  const [selectedQuotes, setSelectedQuotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserQuotes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setQuotes(data || []);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast({
          title: "Error",
          description: "Failed to load your quotes",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuotes();
  }, [user, toast]);

  const toggleQuoteSelection = (quoteId: string) => {
    const newSelected = new Set(selectedQuotes);
    if (newSelected.has(quoteId)) {
      newSelected.delete(quoteId);
    } else {
      newSelected.add(quoteId);
    }
    setSelectedQuotes(newSelected);
  };

  const selectAll = () => {
    if (selectedQuotes.size === quotes.length) {
      setSelectedQuotes(new Set());
    } else {
      setSelectedQuotes(new Set(quotes.map(q => q.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedQuotes.size === 0) return;

    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .in('id', Array.from(selectedQuotes));

      if (error) throw error;

      setQuotes(quotes.filter(q => !selectedQuotes.has(q.id)));
      setSelectedQuotes(new Set());

      toast({
        title: "Success",
        description: `${selectedQuotes.size} quote(s) deleted`
      });
    } catch (error) {
      console.error('Error deleting quotes:', error);
      toast({
        title: "Error",
        description: "Failed to delete quotes",
        variant: "destructive"
      });
    }
  };

  const toggleVisibilitySelected = async (hide: boolean) => {
    if (selectedQuotes.size === 0) return;

    try {
      const { error } = await supabase
        .from('quotes')
        .update({ is_hidden: hide })
        .in('id', Array.from(selectedQuotes));

      if (error) throw error;

      setQuotes(quotes.map(q => 
        selectedQuotes.has(q.id) ? { ...q, is_hidden: hide } : q
      ));
      setSelectedQuotes(new Set());

      toast({
        title: "Success",
        description: `${selectedQuotes.size} quote(s) ${hide ? 'hidden' : 'made visible'}`
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update quote visibility",
        variant: "destructive"
      });
    }
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
            <h1 className="text-3xl font-bold">Batch Edit Quotes</h1>
          </div>

          {quotes.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No quotes to edit</h3>
                  <p className="text-muted-foreground">You haven't posted any quotes yet.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Action Bar */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        className="flex items-center gap-2"
                      >
                        {selectedQuotes.size === quotes.length ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                        {selectedQuotes.size === quotes.length ? 'Deselect All' : 'Select All'}
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {selectedQuotes.size} of {quotes.length} selected
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVisibilitySelected(false)}
                        disabled={selectedQuotes.size === 0}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Show
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleVisibilitySelected(true)}
                        disabled={selectedQuotes.size === 0}
                        className="flex items-center gap-2"
                      >
                        <EyeOff className="w-4 h-4" />
                        Hide
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteSelected}
                        disabled={selectedQuotes.size === 0}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Quotes List */}
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <Card key={quote.id} className={`${selectedQuotes.has(quote.id) ? 'ring-2 ring-primary' : ''} ${quote.is_hidden ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedQuotes.has(quote.id)}
                          onCheckedChange={() => toggleQuoteSelection(quote.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-lg italic mb-2">"{quote.content}"</p>
                              {quote.author && (
                                <p className="text-sm text-muted-foreground mb-1">— {quote.author}</p>
                              )}
                              {quote.category && (
                                <span className="inline-block px-2 py-1 text-xs bg-secondary rounded-full">
                                  {quote.category}
                                </span>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {quote.is_hidden && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                    <EyeOff className="w-3 h-3" />
                                    Hidden
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(quote.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyQuotesBatchEdit;