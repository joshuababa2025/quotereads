import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BookShelvesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
}

export const BookShelves = ({ open, onOpenChange, bookTitle }: BookShelvesProps) => {
  const { toast } = useToast();
  const [selectedShelves, setSelectedShelves] = useState<string[]>([]);
  const [newShelfName, setNewShelfName] = useState("");
  const [showNewShelfForm, setShowNewShelfForm] = useState(false);

  const defaultShelves = [
    { id: "want-to-read", name: "Want to Read", count: 12 },
    { id: "currently-reading", name: "Currently Reading", count: 3 },
    { id: "read", name: "Read", count: 45 },
    { id: "favorites", name: "Favorites", count: 8 },
    { id: "philosophy", name: "Philosophy", count: 15 },
    { id: "inspiration", name: "Inspiration", count: 23 }
  ];

  const handleShelfToggle = (shelfId: string) => {
    setSelectedShelves(prev => 
      prev.includes(shelfId) 
        ? prev.filter(id => id !== shelfId)
        : [...prev, shelfId]
    );
  };

  const handleCreateShelf = () => {
    if (newShelfName.trim()) {
      toast({
        title: "Shelf created",
        description: `"${newShelfName}" has been added to your shelves.`,
      });
      setNewShelfName("");
      setShowNewShelfForm(false);
    }
  };

  const handleSaveToShelves = () => {
    if (selectedShelves.length > 0) {
      const shelfNames = defaultShelves
        .filter(shelf => selectedShelves.includes(shelf.id))
        .map(shelf => shelf.name);
      
      toast({
        title: "Book added to shelves",
        description: `"${bookTitle}" has been added to: ${shelfNames.join(", ")}.`,
      });
      
      onOpenChange(false);
      setSelectedShelves([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Add to Shelf
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose which shelves to add "{bookTitle}" to:
          </p>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {defaultShelves.map((shelf) => (
              <div key={shelf.id} className="flex items-center space-x-3">
                <Checkbox
                  id={shelf.id}
                  checked={selectedShelves.includes(shelf.id)}
                  onCheckedChange={() => handleShelfToggle(shelf.id)}
                />
                <label 
                  htmlFor={shelf.id}
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {shelf.name}
                  <span className="text-muted-foreground ml-2">({shelf.count})</span>
                </label>
              </div>
            ))}
          </div>

          {showNewShelfForm ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="New shelf name"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateShelf()}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleCreateShelf}>
                  Create
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowNewShelfForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowNewShelfForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Shelf
            </Button>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              className="flex-1" 
              onClick={handleSaveToShelves}
              disabled={selectedShelves.length === 0}
            >
              Add to {selectedShelves.length} Shelf{selectedShelves.length !== 1 ? 's' : ''}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};