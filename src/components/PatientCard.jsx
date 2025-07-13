import React from 'react';
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSlideIn } from '@/utils/animations';

/**
 * Patient Card Component
 * Displays a patient's basic information in a card format
 * @param {Object} props - Component props
 * @param {Object} props.patient - Patient data object
 * @param {Function} props.onClick - Function to call when card is clicked
 * @param {number} props.delay - Animation delay in milliseconds
 * @returns {JSX.Element} Patient card
 */
export const PatientCard = ({ 
  patient, 
  onClick,
  delay = 0
}) => {
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(delay, 300, 'up');
  
  /**
   * Gets the appropriate CSS class for patient status colors
   * @param {string} status - Patient status (critical, warning, stable)
   * @returns {string} CSS class name for status styling
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-medical-critical';
      case 'warning': return 'bg-medical-warning';
      default: return 'bg-medical-success';
    }
  };

  /**
   * Gets initials from first and last name
   * @param {string} firstName - Patient's first name
   * @param {string} lastName - Patient's last name
   * @returns {string} Initials (e.g., "JD" for "John Doe")
   */
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-card cursor-pointer transition-all hover:scale-[1.02] duration-300"
      onClick={onClick}
      style={slideInStyle}
    >
      {/* Status indicator bar at top of card */}
      <div className={`h-1 ${getStatusColor(patient.status)}`} />
      
      <CardContent className="p-4">
        {/* Patient header with avatar and basic info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Patient avatar with initials */}
            <Avatar className="h-12 w-12 border-2 border-border">
              <AvatarFallback className="bg-medical-lightBlue text-medical-blue font-medium">
                {getInitials(patient.firstName, patient.lastName)}
              </AvatarFallback>
            </Avatar>
            
            {/* Patient name and basic details */}
            <div className="space-y-1">
              <h3 className="font-medium text-lg leading-none">
                {patient.firstName} {patient.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>MRN: {patient.mrn}</span>
                <span>•</span>
                <span>{patient.gender}</span>
              </div>
            </div>
          </div>
          
          {/* Status badges for critical and warning patients */}
          {patient.status === 'critical' && (
            <Badge variant="destructive" className="gap-1 pl-2 pr-3 rounded-full">
              <AlertCircle className="h-3 w-3" />
              Critical
            </Badge>
          )}
          {patient.status === 'warning' && (
            <Badge variant="outline" className="bg-medical-warning/10 text-medical-warning border-medical-warning gap-1 pl-2 pr-3 rounded-full">
              <AlertCircle className="h-3 w-3" />
              Warning
            </Badge>
          )}
        </div>

        {/* Patient dates information */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">DOB:</span>
            <span>{patient.dateOfBirth}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Last visit:</span>
            <span>{patient.lastVisit}</span>
          </div>
        </div>

        {/* Patient conditions list */}
        <div className="mt-3">
          <div className="text-xs font-medium text-muted-foreground mb-1">Conditions</div>
          <div className="flex flex-wrap gap-1">
            {patient.conditions.map((condition, i) => (
              <Badge key={i} variant="secondary" className="rounded-full text-xs">
                {condition.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// PropTypes for type checking in JavaScript
PatientCard.propTypes = {
  patient: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mrn: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
    lastVisit: PropTypes.string.isRequired,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  delay: PropTypes.number,
}; 