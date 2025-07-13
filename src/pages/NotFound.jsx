import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * 404 Not Found Page Component
 * Displays when users try to access a non-existent route
 * @returns {JSX.Element} 404 error page
 */
const NotFound = () => {
  // Get current location for logging purposes
  const location = useLocation();

  // Log the 404 error when component mounts
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md text-center px-4">
          {/* Error icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-medical-lightBlue flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-medical-blue" />
            </div>
          </div>
          
          {/* Error message */}
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          {/* Return to dashboard button */}
          <Button asChild size="lg" className="animate-pulse">
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 