import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Loader2, Gift } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

interface PaymentButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}

export const PaymentButton = ({ className, size = "default", children }: PaymentButtonProps) => {
  const { user } = useAuth();
  const { state } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  
  const isGiveaway = searchParams.get('type') === 'giveaway';
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  const handlePayment = async () => {
    if (!isGiveaway && state.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (isGiveaway && (!orderId || !amount)) {
      toast({
        title: "Invalid giveaway order",
        description: "Missing order information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let items;
      let successUrl;
      let cancelUrl;

      if (isGiveaway) {
        // Fetch giveaway order details
        const { data: giveawayOrder, error: fetchError } = await supabase
          .from('giveaway_purchases')
          .select(`
            *,
            giveaway_packages (
              title,
              description,
              image_url
            )
          `)
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;

        items = [{
          name: `Giveaway: ${giveawayOrder.giveaway_packages.title}`,
          price: parseFloat(amount),
          quantity: 1,
          image: giveawayOrder.giveaway_packages.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500',
        }];
        
        successUrl = `${window.location.origin}/payment-success?type=giveaway&orderId=${orderId}`;
        cancelUrl = `${window.location.origin}/giveaway`;
      } else {
        items = state.items.map(item => ({
          name: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));
        
        successUrl = `${window.location.origin}/payment-success`;
        cancelUrl = `${window.location.origin}/cart`;
      }

      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items,
          successUrl,
          cancelUrl,
          metadata: isGiveaway ? { type: 'giveaway', orderId } : undefined,
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : undefined,
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={loading || (!isGiveaway && state.items.length === 0)}
      className={className}
      size={size}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : isGiveaway ? (
        <Gift className="h-4 w-4 mr-2" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {children || (loading ? "Processing..." : isGiveaway ? "Pay for Giveaway" : "Checkout")}
    </Button>
  );
};