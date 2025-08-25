import { MoreVertical, FolderPlus, Palette, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuotes } from "@/contexts/QuotesContext";
import { useToast } from "@/hooks/use-toast";

interface QuoteOptionsMenuProps {
  quoteId: string;
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
}

export const QuoteOptionsMenu = ({ 
  quoteId, 
  quote, 
  author, 
  category, 
  variant 
}: QuoteOptionsMenuProps) => {
  const { state, dispatch } = useQuotes();
  const { toast } = useToast();

  const handleAddToShelf = (shelfId: string, shelfName: string) => {
    dispatch({
      type: 'ADD_TO_SHELF',
      quoteId,
      shelfId,
      quote: { id: quoteId, quote, author, category, variant }
    });
    toast({
      title: "Added to shelf",
      description: `Quote added to "${shelfName}"`
    });
  };

  const handleAddToTheme = (themeId: string, themeName: string) => {
    dispatch({
      type: 'ADD_TO_THEME',
      quoteId,
      themeId,
      quote: { id: quoteId, quote, author, category, variant }
    });
    toast({
      title: "Added to theme",
      description: `Quote added to "${themeName}" theme`
    });
  };

  const handleDownload = () => {
    // Create a downloadable image of the quote
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;
    
    // Set background
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text properties
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    
    // Draw quote text (simple implementation)
    const lines = quote.match(/.{1,40}(\s|$)/g) || [quote];
    lines.forEach((line, index) => {
      ctx.fillText(line.trim(), canvas.width / 2, 200 + (index * 40));
    });
    
    // Draw author
    ctx.font = '18px Arial';
    ctx.fillText(`— ${author}`, canvas.width / 2, 200 + (lines.length * 40) + 60);
    
    // Download
    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quote-${author.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Quote downloaded",
      description: "Quote image saved to your device"
    });
  };

  const handleShare = async () => {
    const shareText = `"${quote}" - ${author}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quote by ${author}`,
          text: shareText,
        });
      } catch (err) {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Text copied!",
          description: "Quote copied to clipboard"
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Text copied!",
        description: "Quote copied to clipboard"
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Add to Shelf */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <FolderPlus className="mr-2 h-4 w-4" />
            Add to Shelf
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {state.customShelves.map((shelf) => (
              <DropdownMenuItem
                key={shelf.id}
                onClick={() => handleAddToShelf(shelf.id, shelf.name)}
              >
                {shelf.name} ({shelf.quoteCount})
              </DropdownMenuItem>
            ))}
            {state.customShelves.length === 0 && (
              <DropdownMenuItem disabled>
                No custom shelves yet
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Add to Theme */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            Add to Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {state.quoteThemes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => handleAddToTheme(theme.id, theme.name)}
              >
                <div className={`w-3 h-3 rounded mr-2 ${theme.backgroundStyle}`} />
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Image
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Quote
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};