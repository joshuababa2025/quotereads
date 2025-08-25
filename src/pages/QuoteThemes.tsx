import { Navigation } from '@/components/Navigation';
import { QuoteCard } from '@/components/QuoteCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuotes } from '@/contexts/QuotesContext';
import { Palette, Download, Share2, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QuoteThemes = () => {
  const { state } = useQuotes();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const downloadThemeGallery = (themeId: string, themeName: string) => {
    // Create a gallery image with multiple quotes
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const quotes = state.themedQuotes[themeId] || [];
    const theme = state.quoteThemes.find(t => t.id === themeId);
    
    if (quotes.length === 0 || !theme) return;

    canvas.width = 1200;
    canvas.height = 800;
    
    // Set background based on theme
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add title
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${themeName} Gallery`, canvas.width / 2, 60);
    
    // Add quotes (simple grid layout)
    quotes.slice(0, 4).forEach((quote, index) => {
      const x = (index % 2) * 600 + 300;
      const y = Math.floor(index / 2) * 300 + 200;
      
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      
      // Draw quote text (truncated)
      const shortQuote = quote.quote.length > 60 ? quote.quote.substring(0, 60) + '...' : quote.quote;
      const lines = shortQuote.match(/.{1,30}(\s|$)/g) || [shortQuote];
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line.trim(), x, y + (lineIndex * 25));
      });
      
      // Draw author
      ctx.font = '14px Arial';
      ctx.fillText(`— ${quote.author}`, x, y + (lines.length * 25) + 30);
    });
    
    // Download
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${themeName.replace(/\s+/g, '-').toLowerCase()}-gallery.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            {/* Theme Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Theme Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    All Themes
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Nature & Landscapes
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Minimalist
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Gradients
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Create Custom Theme
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Browse Templates
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-sm text-foreground cursor-pointer hover:text-primary">
                    Upload Background
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Quote Themes</h1>
              <p className="text-muted-foreground mb-6">
                Transform your favorite quotes into beautiful, shareable images
              </p>
              
              {/* View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">
                    {state.quoteThemes.length} themes available
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Themes Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="all">All Themes</TabsTrigger>
                  <TabsTrigger value="sunset-sky">Sunset Sky</TabsTrigger>
                  <TabsTrigger value="ocean-calm">Ocean Calm</TabsTrigger>
                  <TabsTrigger value="minimalist-black">Minimalist</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {state.quoteThemes.map((theme) => {
                      const themeQuotes = state.themedQuotes[theme.id] || [];
                      return (
                        <Card key={theme.id} className="overflow-hidden">
                          <div className={`h-32 ${theme.backgroundStyle} flex items-center justify-center`}>
                            <div className={`text-center ${theme.textColor}`}>
                              <h3 className="font-bold text-lg">{theme.name}</h3>
                              <p className="text-sm opacity-90">Theme Preview</p>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">{theme.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {themeQuotes.length} quotes
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => downloadThemeGallery(theme.id, theme.name)}
                                  disabled={themeQuotes.length === 0}
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            {theme.isDefault && (
                              <Badge variant="secondary" className="text-xs">
                                Default Theme
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Individual theme tabs */}
                {state.quoteThemes.map((theme) => (
                  <TabsContent key={theme.id} value={theme.id} className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{theme.name}</h2>
                        <p className="text-muted-foreground">
                          {(state.themedQuotes[theme.id] || []).length} quotes in this theme
                        </p>
                      </div>
                      <Button 
                        onClick={() => downloadThemeGallery(theme.id, theme.name)}
                        disabled={(state.themedQuotes[theme.id] || []).length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Gallery
                      </Button>
                    </div>
                    
                    {(state.themedQuotes[theme.id] || []).length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No quotes in this theme yet</p>
                        <p className="text-sm mt-2">Use the 3-dot menu on quotes to add them to this theme</p>
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {(state.themedQuotes[theme.id] || []).map((quote) => (
                          <div key={quote.id} className="relative">
                            <div className={`rounded-xl p-6 shadow-lg ${theme.backgroundStyle} ${theme.textColor}`}>
                              <div className="text-4xl font-serif mb-4 opacity-20">"</div>
                              <blockquote className="text-lg font-medium mb-6 leading-relaxed">
                                {quote.quote}
                              </blockquote>
                              <div>
                                <p className="font-semibold text-sm opacity-90">— {quote.author}</p>
                                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
                                  {quote.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuoteThemes;