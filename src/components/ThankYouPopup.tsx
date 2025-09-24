import React, { useEffect } from 'react';
import { CheckCircle, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThankYouPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const ThankYouPopup = ({ 
  isOpen, 
  onClose, 
  title = "Thank You!", 
  message = "Your application has been submitted successfully." 
}: ThankYouPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        onClick={onClose}
      >
        {/* Popup */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-auto shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Animation */}
          <div className="text-center">
            <div className="mx-auto mb-6 relative">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-in zoom-in duration-700 delay-200" />
              <div className="absolute -top-2 -right-2 animate-in zoom-in duration-500 delay-500">
                <Heart className="w-8 h-8 text-red-500 fill-current animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 animate-in slide-in-from-bottom-2 duration-500 delay-300">
              {title}
            </h2>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed animate-in slide-in-from-bottom-2 duration-500 delay-400">
              {message}
            </p>

            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full animate-bounce`}
                  style={{
                    backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][i % 4],
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${0.5 + i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>

            {/* Action Button */}
            <div className="animate-in slide-in-from-bottom-2 duration-500 delay-600">
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};