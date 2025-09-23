import { MoreVertical, FolderPlus, Palette, Download, Share2, Trash2 } from "lucide-react";
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
import { downloadQuoteImage } from "@/lib/quoteDownload";

interface QuoteOptionsMenuProps {
  quoteId: string;
  quote: string;
  author: string;
  category: string;
  variant: "purple" | "green" | "orange" | "pink" | "blue";
  backgroundImage?: string;
  isOwner?: boolean;
  onDelete?: () => void;
}

export const QuoteOptionsMenu = ({ 
  quoteId, 
  quote, 
  author, 
  category, 
  variant,
  backgroundImage,
  isOwner = false,
  onDelete
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
    downloadQuoteImage({
      quote,
      author,
      category,
      variant,
      backgroundImage
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
        
        {isOwner && onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Quote
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};