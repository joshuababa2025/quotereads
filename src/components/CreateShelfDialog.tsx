import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useQuotes } from "@/contexts/QuotesContext";
import { useToast } from "@/hooks/use-toast";

export const CreateShelfDialog = () => {
  const [open, setOpen] = useState(false);
  const [shelfName, setShelfName] = useState("");
  const { dispatch } = useQuotes();
  const { toast } = useToast();

  const handleCreateShelf = () => {
    if (!shelfName.trim()) return;
    
    dispatch({
      type: 'CREATE_SHELF',
      name: shelfName.trim()
    });
    
    toast({
      title: "Shelf created",
      description: `"${shelfName}" shelf has been created`
    });
    
    setShelfName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto text-sm text-primary">
          <Plus className="w-3 h-3 mr-1" />
          Add shelf
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Shelf</DialogTitle>
          <DialogDescription>
            Create a custom shelf to organize your quotes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shelf-name" className="text-right">
              Name
            </Label>
            <Input
              id="shelf-name"
              value={shelfName}
              onChange={(e) => setShelfName(e.target.value)}
              className="col-span-3"
              placeholder="e.g., Motivational, Daily Reads"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateShelf();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleCreateShelf} disabled={!shelfName.trim()}>
            Create Shelf
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};