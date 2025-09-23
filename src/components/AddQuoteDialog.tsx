import React, { useState, useEffect } from 'react';
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
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useCategoryImages } from "@/hooks/useCategoryImages";

interface AddQuoteDialogProps {
  children: React.ReactNode;
}

export const AddQuoteDialog: React.FC<AddQuoteDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categoryImages, setCategoryImages] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [specialCollection, setSpecialCollection] = useState("none");
  const { toast } = useToast();
  const { user } = useAuth();
  const { getCategoryImages, getRandomImageByCategory } = useCategoryImages();

  const [categories, setCategories] = useState<string[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const specialCollections = [
    { value: "none", label: "None" },
    { value: "wisdom-of-ages", label: "Wisdom of the Ages" },
    { value: "daily-motivation", label: "Daily Motivation Pool" }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (category && category !== "custom") {
      loadCategoryImages(category);
    }
  }, [category]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_categories')
        .select('name')
        .eq('is_active', true)
        .order('name');
      
      if (!error && data) {
        setCategories(data.map(cat => cat.name));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCategoryImages = async (selectedCategory: string) => {
    const images = await getCategoryImages(selectedCategory);
    setCategoryImages(images);
    
    // Auto-select random image if available
    if (images.length > 0) {
      const randomImage = await getRandomImageByCategory(selectedCategory);
      setSelectedImage(randomImage?.image_url || null);
    } else {
      setSelectedImage(null);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      const newTags = currentTag.split(',').map(tag => tag.trim()).filter(tag => tag && !tags.includes(tag));
      setTags([...tags, ...newTags]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('add_quote_category', { category_name: newCategoryName.trim() });
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Category added successfully!",
          description: `"${newCategoryName.trim()}" has been added to categories.`,
        });
        setNewCategoryName("");
        setShowAddCategory(false);
        setCategory(newCategoryName.trim());
        await loadCategories();
      } else {
        toast({
          title: "Category already exists",
          description: `"${newCategoryName.trim()}" is already in the categories list.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error adding category",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (category === "add-new") {
      toast({
        title: "Please add the category first",
        description: "Click 'Add' to create the new category before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    const finalCategory = category;
    
    if (!quote.trim() || !author.trim() || !finalCategory) {
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
          category: finalCategory,
          tags: tags.length > 0 ? tags : null,
          special_collection: specialCollection === "none" || !specialCollection ? null : specialCollection,
          background_image: selectedImage,
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
      setSelectedImage(null);
      setCategoryImages([]);
      setTags([]);
      setCurrentTag("");
      setSpecialCollection("none");
      setNewCategoryName("");
      setShowAddCategory(false);
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
                  <SelectItem value="add-new" className="text-primary font-medium">
                    + Add New Category
                  </SelectItem>
                </SelectContent>
              </Select>
              {category === "add-new" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter new category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button type="button" onClick={handleAddCategory} size="sm">
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Background Image</Label>
              {categoryImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {categoryImages.map((image) => (
                      <div
                        key={image.id}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedImage === image.image_url ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setSelectedImage(image.image_url)}
                      >
                        <img
                          src={image.image_url}
                          alt={image.image_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {selectedImage && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Selected background image
                    </div>
                  )}
                </div>
              ) : category && category !== "custom" ? (
                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                  No images available for {category} category.
                  <br />Will use default color background.
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg text-center">
                  Select a category to see available background images
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-collection">Special Collection</Label>
            <Select value={specialCollection} onValueChange={setSpecialCollection}>
              <SelectTrigger>
                <SelectValue placeholder="Select collection (optional)" />
              </SelectTrigger>
              <SelectContent>
                {specialCollections.map((collection) => (
                  <SelectItem key={collection.value} value={collection.value}>
                    {collection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags (separate with commas)"
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