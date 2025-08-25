import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const QuoteOfTheDay = () => {
  return (
    <div className="bg-card rounded-xl border shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-foreground mb-4">
        Quote of the Day
      </h3>
      
      <blockquote className="text-foreground mb-4 italic leading-relaxed">
        "The only impossible journey is the one you never begin."
      </blockquote>
      
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">TR</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">Tony Robbins</p>
          <p className="text-xs text-muted-foreground">Motivational Speaker</p>
        </div>
      </div>
    </div>
  );
};