import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AddQuoteDialogProps {
  children: React.ReactNode;
}

export const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [theme, setTheme] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const themes = ["purple", "orange", "green", "pink", "blue"];
  const categories = ["Love", "Motivation", "Wisdom", "Happiness", "Life", "Hope", "Dreams", "Success"];

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!quote.trim() || !author.trim() || !category || !theme) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Please sign in to add quotes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('quotes')
        .insert({
          content: quote.trim(),
          author: author.trim(),
          category,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Quote submitted successfully!",
        description: "Your quote has been added to the community.",
      });

      // Reset form
      setQuote("");
      setAuthor("");
      setCategory("");
      setTheme("");
      setTags([]);
      setCurrentTag("");
      setOpen(false);
    } catch (error) {
      console.error('Error adding quote:', error);
      toast({
        title: "Error adding quote",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a Quote</DialogTitle>
          <DialogDescription>
            Share an inspiring quote with the community
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="quote">Quote *</Label>
            <Textarea
              id="quote"
              placeholder="Enter the quote..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="Quote author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme *</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => (
                    <SelectItem key={themeOption} value={themeOption}>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-4 h-4 rounded ${
                            themeOption === 'purple' ? 'bg-purple-500' :
                            themeOption === 'orange' ? 'bg-orange-500' :
                            themeOption === 'green' ? 'bg-green-500' :
                            themeOption === 'pink' ? 'bg-pink-500' :
                            'bg-blue-500'
                          }`}
                        />
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};