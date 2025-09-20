import { usePreOrderTimer } from "@/hooks/usePreOrderTimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function CountdownTest() {
  // Test with a date 5 days from now
  const testDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  const timeLeft = usePreOrderTimer(testDate);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Countdown Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Testing countdown to: {testDate.toLocaleString()}
          </p>
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-orange-100 dark:bg-orange-900 rounded p-3">
              <div className="text-2xl font-bold text-orange-600">{timeLeft.days}</div>
              <div className="text-xs text-orange-700">Days</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded p-3">
              <div className="text-2xl font-bold text-orange-600">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-xs text-orange-700">Hours</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded p-3">
              <div className="text-2xl font-bold text-orange-600">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-xs text-orange-700">Minutes</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded p-3">
              <div className="text-2xl font-bold text-orange-600">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-xs text-orange-700">Seconds</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Total seconds remaining: {timeLeft.totalSeconds}
          </p>
          <p className="text-xs text-muted-foreground">
            Expired: {timeLeft.isExpired ? 'Yes' : 'No'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}