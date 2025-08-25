import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";

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

  const handlePayment = async () => {
    if (state.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const items = state.items.map(item => ({
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          items,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/cart`,
        },
        headers: session?.access_token ? {
          Authorization: `Bearer ${session.access_token}`,
        } : undefined,
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
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
      disabled={loading || state.items.length === 0}
      className={className}
      size={size}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <ShoppingCart className="h-4 w-4 mr-2" />
      )}
      {children || (loading ? "Processing..." : "Checkout")}
    </Button>
  );
};