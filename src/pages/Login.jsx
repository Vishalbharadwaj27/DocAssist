import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useSlideIn } from "@/utils/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Schema for validating login form data
 * This defines the structure and validation rules for the login form
 */
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

/**
 * Login Page Component
 * Handles user authentication with email and password
 * @returns {JSX.Element} Login form page
 */
const Login = () => {
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // State for visible error message
  const [loginError, setLoginError] = useState("");
  
  // Navigation hook for redirecting after login
  const navigate = useNavigate();
  
  // Toast notification hook
  const { toast } = useToast();
  
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(0, 400);
  
  // Initialize form with validation and default values
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Handles form submission when user clicks "Log in"
   * @param {Object} data - Form data from email and password fields
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(""); // Clear previous error
    try {
      // Attempt to sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      // Check for authentication errors
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Login successful",
        description: "You are now logged in",
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      // Show error message if login fails
      setLoginError(error.message || "An error occurred during login");
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "An error occurred during login",
      });
    } finally {
      // Always stop loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card 
        className="w-full max-w-md overflow-hidden border-transparent shadow-lg animate-fade-in"
        style={slideInStyle}
      >
        {/* Card header with title and description */}
        <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <User className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to log in to your account
          </CardDescription>
        </CardHeader>
        
        {/* Card content with login form */}
        <CardContent className="p-6 pt-8">
          {/* Show error message above the form if present */}
          {loginError && (
            <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2 text-center text-sm border border-red-300">
              {loginError}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Password field with visibility toggle */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full transition-transform duration-200 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        {/* Card footer with links */}
        <CardFooter className="flex flex-col space-y-4 bg-muted/20 p-6">
          <div className="text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login; 