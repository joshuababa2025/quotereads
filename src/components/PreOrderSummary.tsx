import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Package } from "lucide-react";
import { usePreOrderTimer } from "@/hooks/usePreOrderTimer";

interface PreOrderItem {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  quantity: number;
  releaseDate?: Date;
}

interface PreOrderSummaryProps {
  items: PreOrderItem[];
}

export function PreOrderSummary({ items }: PreOrderSummaryProps) {
  if (items.length === 0) return null;

  const totalPreOrderValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300">
          <Package className="w-5 h-5" />
          Pre-Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <PreOrderItemRow key={item.id} item={item} />
        ))}
        <div className="border-t border-orange-200 dark:border-orange-800 pt-3">
          <div className="flex justify-between items-center font-semibold text-orange-800 dark:text-orange-300">
            <span>Pre-Order Total:</span>
            <span>${totalPreOrderValue.toFixed(2)}</span>
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            You'll be charged now. Items will ship when available.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PreOrderItemRow({ item }: { item: PreOrderItem }) {
  const timeLeft = usePreOrderTimer(item.releaseDate);

  return (
    <div className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-100 dark:border-orange-800">
      <div className="w-16 h-20 bg-muted rounded overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm text-foreground truncate">
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              by {item.author}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300">
                Pre-Order
              </Badge>
              <span className="text-xs text-muted-foreground">
                Qty: {item.quantity}
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
        
        {item.releaseDate && !timeLeft.isExpired && (
          <div className="flex items-center gap-1 mt-2 text-xs text-orange-600 dark:text-orange-400">
            <Clock className="w-3 h-3" />
            <span>
              Ships in {timeLeft.days} {timeLeft.days === 1 ? 'day' : 'days'}
              {timeLeft.days < 1 && (
                <span> ({timeLeft.hours}h {timeLeft.minutes}m)</span>
              )}
            </span>
          </div>
        )}
        
        {item.releaseDate && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>
              Expected: {item.releaseDate.toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}