import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Mail, Lock, EyeOff, Eye, UserPlus } from "lucide-react";
import { useSlideIn } from "@/utils/animations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * Schema for validating signup form data
 * This defines the structure and validation rules for the signup form
 */
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Signup Page Component
 * Handles user registration with form validation and Supabase authentication
 * @returns {JSX.Element} Signup form page
 */
const Signup = () => {
  // State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // State for visible error message
  const [signupError, setSignupError] = useState("");
  
  // Navigation hook for redirecting after signup
  const navigate = useNavigate();
  
  // Toast notification hook
  const { toast } = useToast();
  
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(0, 400);
  
  // Initialize form with validation and default values
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      terms: false,
    },
  });

  /**
   * Handles form submission when user clicks "Create account"
   * @param {Object} data - Form data from all input fields
   */
  const onSubmit = async (data) => {
    setIsLoading(true);
    setSignupError(""); // Clear previous error
    try {
      // Create user account in Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name, // Store name in user metadata
          },
        },
      });
      
      // Check for errors from Supabase
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      // Show error message if signup fails
      setSignupError(error.message || "An error occurred during signup");
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
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
        {/* Card Header with title and description */}
        <CardHeader className="space-y-1 bg-gradient-to-r from-primary/10 to-accent/10 pb-8">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <UserPlus className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        
        {/* Card Content with form */}
        <CardContent className="p-6 pt-8">
          {/* Show error message above the form if present */}
          {signupError && (
            <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2 text-center text-sm border border-red-300">
              {signupError}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="pl-10"
                        />
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Email Field */}
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
                          type="email"
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
              
              {/* Password Field with visibility toggle */}
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
              
              {/* Confirm Password Field with visibility toggle */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="transition-all duration-300 hover:scale-[1.01]">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="pl-10"
                        />
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Terms and Conditions Checkbox */}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I agree to the{" "}
                        <Link to="/terms" className="text-primary hover:underline">
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="text-primary hover:underline">
                          privacy policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full transition-transform duration-200 active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        
        {/* Card Footer with login link */}
        <CardFooter className="flex justify-center bg-muted/20 p-6">
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup; 