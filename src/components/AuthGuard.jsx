import { useEffect, useState } from "react";
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Authentication Guard Component
 * Protects routes by checking if user is authenticated
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @returns {JSX.Element} Protected route content or redirect
 */
const AuthGuard = ({ children, requireAuth = true }) => {
  // Loading state while checking authentication
  const [loading, setLoading] = useState(true);
  
  // Current user session
  const [session, setSession] = useState(null);
  
  // Current location for redirect purposes
  const location = useLocation();

  useEffect(() => {
    /**
     * Check current session status
     */
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    // Set up authentication state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Check initial session
    checkSession();

    // Cleanup subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If authentication is required and user is not logged in, redirect to login
  if (requireAuth && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is logged in but trying to access auth pages (login/signup), redirect to home
  if (!requireAuth && session) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and can access the protected content
  return <>{children}</>;
};

// PropTypes for type checking in JavaScript
AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool,
};

export default AuthGuard; 