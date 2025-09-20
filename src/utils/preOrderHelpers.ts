export interface PreOrderProduct {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  comingSoon?: boolean;
  releaseDate?: Date;
  description?: string;
  pages?: number;
  publisher?: string;
  isbn?: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function calculateTimeLeft(releaseDate: Date): TimeLeft {
  const now = new Date().getTime();
  const releaseTime = releaseDate.getTime();
  const difference = releaseTime - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const totalSeconds = Math.floor(difference / 1000);
    
    return { days, hours, minutes, seconds, isExpired: false, totalSeconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }
}

export function formatReleaseDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function isPreOrderAvailable(product: PreOrderProduct): boolean {
  return !!(product.comingSoon && product.releaseDate && !calculateTimeLeft(product.releaseDate).isExpired);
}

export function getPreOrderStatus(product: PreOrderProduct): 'available' | 'expired' | 'not-preorder' {
  if (!product.comingSoon || !product.releaseDate) {
    return 'not-preorder';
  }
  
  const timeLeft = calculateTimeLeft(product.releaseDate);
  return timeLeft.isExpired ? 'expired' : 'available';
}

export function generatePreOrderMessage(product: PreOrderProduct): string {
  const status = getPreOrderStatus(product);
  
  switch (status) {
    case 'available':
      const timeLeft = calculateTimeLeft(product.releaseDate!);
      if (timeLeft.days > 0) {
        return `Pre-order now! Ships in ${timeLeft.days} ${timeLeft.days === 1 ? 'day' : 'days'}.`;
      } else if (timeLeft.hours > 0) {
        return `Pre-order now! Ships in ${timeLeft.hours} ${timeLeft.hours === 1 ? 'hour' : 'hours'}.`;
      } else {
        return `Pre-order now! Ships very soon!`;
      }
    case 'expired':
      return 'This item is now available for regular purchase.';
    case 'not-preorder':
    default:
      return 'Available for immediate purchase.';
  }
}