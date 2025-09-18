/**
 * Pre-order utilities for managing pre-order functionality
 * Ready for backend integration
 */

export interface PreOrderData {
  productId: number;
  userId?: string;
  email?: string;
  phone?: string;
  quantity: number;
  totalAmount: number;
  expectedShipDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  createdAt: Date;
  paymentIntentId?: string; // For Stripe integration
}

export interface PreOrderProduct {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  releaseDate: Date;
  availableForPreOrder: boolean;
  maxPreOrderQuantity?: number;
  preOrderDiscount?: number;
}

/**
 * Calculate time remaining until product release
 */
export function calculateTimeUntilRelease(releaseDate: Date) {
  const now = new Date().getTime();
  const releaseTime = releaseDate.getTime();
  const difference = releaseTime - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      totalHours: 0
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  const totalHours = Math.floor(difference / (1000 * 60 * 60));

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalHours
  };
}

/**
 * Validate pre-order eligibility
 */
export function validatePreOrderEligibility(product: PreOrderProduct, quantity: number = 1): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!product.availableForPreOrder) {
    errors.push('Product is not available for pre-order');
  }

  if (product.releaseDate <= new Date()) {
    errors.push('Product has already been released');
  }

  if (product.maxPreOrderQuantity && quantity > product.maxPreOrderQuantity) {
    errors.push(`Maximum pre-order quantity is ${product.maxPreOrderQuantity}`);
  }

  if (quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate pre-order total with potential discounts
 */
export function calculatePreOrderTotal(product: PreOrderProduct, quantity: number): {
  subtotal: number;
  discount: number;
  total: number;
  savings: number;
} {
  const originalPrice = product.price * quantity;
  const discountAmount = product.preOrderDiscount || 0;
  const discount = originalPrice * (discountAmount / 100);
  const total = originalPrice - discount;

  return {
    subtotal: originalPrice,
    discount: discountAmount,
    total,
    savings: discount
  };
}

/**
 * Format release date for display
 */
export function formatReleaseDate(date: Date, format: 'short' | 'long' | 'relative' = 'long'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'relative':
      const timeUntil = calculateTimeUntilRelease(date);
      if (timeUntil.isExpired) return 'Released';
      if (timeUntil.days > 0) return `in ${timeUntil.days} day${timeUntil.days !== 1 ? 's' : ''}`;
      if (timeUntil.totalHours > 0) return `in ${timeUntil.totalHours} hour${timeUntil.totalHours !== 1 ? 's' : ''}`;
      return 'Soon';
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Generate pre-order confirmation data
 * This function prepares data for backend submission
 */
export function generatePreOrderPayload(
  product: PreOrderProduct,
  quantity: number,
  customerInfo: {
    email?: string;
    phone?: string;
    userId?: string;
  }
): Omit<PreOrderData, 'createdAt' | 'paymentIntentId'> {
  const totals = calculatePreOrderTotal(product, quantity);

  return {
    productId: product.id,
    userId: customerInfo.userId,
    email: customerInfo.email,
    phone: customerInfo.phone,
    quantity,
    totalAmount: totals.total,
    expectedShipDate: product.releaseDate,
    status: 'pending'
  };
}

/**
 * Pre-order analytics helpers
 * Ready for integration with analytics services
 */
export function trackPreOrderEvent(
  eventType: 'view' | 'add_to_cart' | 'checkout_started' | 'checkout_completed',
  product: PreOrderProduct,
  additionalData?: Record<string, any>
) {
  // This would integrate with your analytics service (Google Analytics, Mixpanel, etc.)
  const eventData = {
    event_type: eventType,
    product_id: product.id,
    product_title: product.title,
    product_price: product.price,
    release_date: product.releaseDate.toISOString(),
    timestamp: new Date().toISOString(),
    ...additionalData
  };

  // Example: window.gtag?.('event', eventType, eventData);
  // Example: window.analytics?.track(eventType, eventData);
  
  console.log('Pre-order analytics event:', eventData);
}