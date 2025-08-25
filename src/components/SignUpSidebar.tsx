import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome, Apple } from "lucide-react";

export const SignUpSidebar = () => {
  return (
    <div className="bg-card rounded-xl border shadow-lg p-6 sticky top-4">
      <h3 className="text-xl font-bold text-foreground mb-2">
        Discover & Read More
      </h3>
      
      <div className="space-y-4">
        {/* Google Sign Up */}
        <Button 
          variant="outline" 
          className="w-full justify-center items-center space-x-2 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
        >
          <Chrome className="h-4 w-4" />
          <span>Continue with Google</span>
        </Button>

        {/* Apple Sign Up */}
        <Button 
          variant="outline" 
          className="w-full justify-center items-center space-x-2 bg-black text-white border-black hover:bg-gray-900"
        >
          <Apple className="h-4 w-4" />
          <span>Continue with Apple</span>
        </Button>

        {/* Email Sign Up */}
        <div className="space-y-3">
          <Input 
            type="email" 
            placeholder="Sign up with Email" 
            className="border-muted"
          />
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};