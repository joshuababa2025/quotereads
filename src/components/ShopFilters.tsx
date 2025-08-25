import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ShopFiltersProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const categories = [
  'Electronics',
  'Clothing & Fashion', 
  'Home & Garden',
  'Books & Media',
  'Sports & Fitness',
  'Health & Beauty',
  'Toys & Games',
  'Office Supplies'
];

export function ShopFilters({
  priceRange,
  onPriceChange,
  selectedCategories,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  onClearFilters
}: ShopFiltersProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6 p-3 lg:p-6 pt-0">
        {/* Price Range */}
        <div>
          <h4 className="font-medium text-foreground mb-2 lg:mb-3 text-sm lg:text-base">Price Range</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceChange(value as [number, number])}
              max={50}
              min={5}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-xs lg:text-sm text-muted-foreground">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-medium text-foreground mb-2 lg:mb-3 text-sm lg:text-base">Categories</h4>
          <div className="space-y-1 lg:space-y-2 max-h-32 lg:max-h-none overflow-y-auto lg:overflow-visible">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <label
                  htmlFor={category}
                  className="text-xs lg:text-sm text-foreground cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-medium text-foreground mb-2 lg:mb-3 text-sm lg:text-base">Rating</h4>
          <div className="space-y-1 lg:space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={selectedRating === rating}
                  onCheckedChange={() => onRatingChange(selectedRating === rating ? 0 : rating)}
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center space-x-1 cursor-pointer"
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2 h-2 lg:w-3 lg:h-3 ${
                        i < rating 
                          ? 'text-quote-orange fill-current' 
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-xs lg:text-sm text-foreground ml-1">& up</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}