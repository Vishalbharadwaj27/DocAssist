import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { Search, X } from 'lucide-react';
import { searchPatients } from '@/utils/mockData';
import { useSlideIn } from '@/utils/animations';

/**
 * Search Bar Component
 * Provides patient search functionality with real-time results
 * @param {Object} props - Component props
 * @param {boolean} props.autoFocus - Whether to automatically focus the input
 * @param {Function} props.onResultClick - Function to call when a result is clicked
 * @returns {JSX.Element} Search bar with results dropdown
 */
export const SearchBar = ({ 
  autoFocus = false,
  onResultClick
}) => {
  // Search query state
  const [query, setQuery] = useState('');
  
  // Search results state
  const [results, setResults] = useState([]);
  
  // Focus state for showing/hiding results
  const [isFocused, setIsFocused] = useState(false);
  
  // References to DOM elements
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(50, 300, 'up');

  // Auto-focus the input when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Search for patients when query changes
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchPatients(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handles when a search result is clicked
   * @param {Object} patient - The selected patient object
   */
  const handleResultClick = (patient) => {
    // Handle result click, could navigate to patient view
    console.log('Selected patient:', patient.id);
    setQuery('');
    setIsFocused(false);
    onResultClick?.();
    // For demo purposes, we could implement setting the selected patient in a
    // global context or triggering navigation
  };

  /**
   * Gets the appropriate CSS class for patient status indicator
   * @param {string} status - Patient status
   * @returns {string} CSS class for status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-medical-critical';
      case 'warning': return 'bg-medical-warning';
      default: return 'bg-medical-success';
    }
  };

  return (
    <div className="relative w-full">
      {/* Search input container */}
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {/* Search input field */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search patients, medications, conditions..."
          className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        
        {/* Clear button - only shown when there's text */}
        {query && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isFocused && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute z-10 mt-2 w-full rounded-md border bg-popover shadow-md animate-scale-in overflow-hidden"
          style={slideInStyle}
        >
          <div className="max-h-80 overflow-y-auto subtle-scrollbar">
            {/* Results header */}
            <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground bg-accent">
              Patients ({results.length})
            </h3>
            
            {/* Results list */}
            <div className="py-1">
              {results.map((patient, index) => (
                <div
                  key={patient.id}
                  className="px-4 py-2 flex items-center gap-3 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => handleResultClick(patient)}
                >
                  {/* Status indicator dot */}
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(patient.status)}`} />
                  
                  {/* Patient information */}
                  <div>
                    <div className="font-medium">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      MRN: {patient.mrn} • DOB: {patient.dateOfBirth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking in JavaScript
SearchBar.propTypes = {
  autoFocus: PropTypes.bool,
  onResultClick: PropTypes.func,
}; 