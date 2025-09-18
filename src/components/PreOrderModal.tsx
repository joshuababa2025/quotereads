import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  comingSoon?: boolean;
  releaseDate?: Date;
}

interface PreOrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function PreOrderModal({ product, isOpen, onClose }: PreOrderModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!product.releaseDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const releaseTime = product.releaseDate!.getTime();
      const difference = releaseTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [product.releaseDate]);

  const handlePreOrder = () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    toast.success(`Pre-order confirmed! We'll notify you at ${email} when ${product.title} is available.`);
    setEmail("");
    setPhone("");
    onClose();
  };

  const handleNotifyMe = () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    toast.success(`Great! We'll notify you at ${email} when ${product.title} is available.`);
    setEmail("");
    setPhone("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pre-Order Now</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image and Details */}
          <div>
            <div className="aspect-[4/5] bg-muted rounded-lg mb-4 overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2">
              {product.title}
            </h3>
            <p className="text-muted-foreground mb-3">
              by {product.author}
            </p>
            
            {product.rating && (
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < product.rating! 
                        ? 'text-quote-orange fill-current' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-1">
                  ({product.rating})
                </span>
              </div>
            )}
            
            <div className="text-2xl font-bold text-primary mb-4">
              ${product.price}
            </div>
          </div>
          
          {/* Pre-order Form */}
          <div>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-foreground">Release Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.days}</div>
                  <div className="text-xs text-muted-foreground">Days</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.hours}</div>
                  <div className="text-xs text-muted-foreground">Hours</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.minutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-background rounded p-2">
                  <div className="text-xl font-bold text-primary">{timeLeft.seconds}</div>
                  <div className="text-xs text-muted-foreground">Seconds</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-2 pt-4">
                <Button 
                  onClick={handlePreOrder}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Pre-Order Now - ${product.price}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNotifyMe}
                  className="w-full"
                >
                  Notify Me When Available
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                By pre-ordering, you'll be charged when the item ships. 
                You can cancel anytime before release.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}