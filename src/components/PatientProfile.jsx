import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { useSlideIn } from '@/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Phone, Mail, MapPin, Heart, Activity, 
  Pill, AlertTriangle, TestTube, ClipboardList, ArrowLeft,
  AlertCircle, Save, Plus
} from 'lucide-react';
import DoctorAI from './DoctorAI';
import PatientNotes from './PatientNotes';

/**
 * Main Patient Profile component that displays comprehensive patient information
 * @param {Object} props - Component props
 * @param {Object} props.patient - Patient data object
 * @param {Function} props.onBack - Function to handle back navigation
 * @returns {JSX.Element} Patient profile interface
 */
export const PatientProfile = ({ patient, onBack }) => {
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(200);
  
  /**
   * Gets the appropriate CSS class for patient status colors
   * @param {string} status - Patient status (stable, warning, critical)
   * @returns {string} CSS class name for status styling
   */
  const getStatusColor = (status) => {
    switch(status) {
      case 'stable': return 'medical-success';
      case 'warning': return 'medical-warning';
      case 'critical': return 'medical-critical';
      default: return 'medical-blue';
    }
  };

  /**
   * Formats a date string into a readable format
   * @param {string} dateString - Date string to format
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  /**
   * Calculates age from birth date
   * @param {string} birthDateString - Birth date string
   * @returns {number} Calculated age in years
   */
  const calculateAge = (birthDateString) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  /**
   * Formats date and time for display
   * @param {string} dateTimeString - Date and time string
   * @returns {string} Formatted date and time string
   */
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(dateTime);
  };

  /**
   * Checks if blood pressure is within normal range
   * @param {string} bp - Blood pressure string (e.g., "120/80")
   * @returns {boolean} True if blood pressure is normal
   */
  const checkBPNormal = (bp) => {
    const [systolic, diastolic] = bp.split('/').map(Number);
    return (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80);
  };

  /**
   * Gets CSS class for severity badge styling
   * @param {string} severity - Condition severity level
   * @returns {string} CSS class for badge styling
   */
  const getSeverityBadgeClass = (severity) => {
    switch(severity) {
      case 'mild': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'moderate': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'severe': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  /**
   * Gets CSS class for lab result badge styling
   * @param {string} status - Lab result status
   * @returns {string} CSS class for badge styling
   */
  const getLabResultBadgeClass = (status) => {
    switch(status) {
      case 'normal': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'critical': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-6" style={slideInStyle}>
      {/* Header with back button */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Patient Profile</h1>
      </div>
      
      {/* Main content grid - patient info on left, details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Overview Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Patient avatar and basic info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-medical-lightBlue text-medical-blue rounded-full flex items-center justify-center text-3xl font-bold mb-3">
                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold">{patient.firstName} {patient.lastName}</h2>
              <Badge className={`bg-${getStatusColor(patient.status)} text-white mt-1`}>
                {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
              </Badge>
            </div>
            
            {/* Patient contact and demographic information */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-medical-blue" />
                <span className="font-medium mr-2">DOB:</span>
                <span>{formatDate(patient.dateOfBirth)} ({calculateAge(patient.dateOfBirth)} years)</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-medical-blue" />
                <span className="font-medium mr-2">MRN:</span>
                <span>{patient.mrn}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-medical-blue" />
                <span className="font-medium mr-2">Phone:</span>
                <span>{patient.contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-medical-blue" />
                <span className="font-medium mr-2">Email:</span>
                <span className="truncate">{patient.contactInfo.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-medical-blue mt-0.5" />
                <span className="font-medium mr-2">Address:</span>
                <span>{patient.contactInfo.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content Area with Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="summary">
            {/* Tab navigation */}
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            {/* Summary Tab - Conditions, Allergies, Medications */}
            <TabsContent value="summary" className="space-y-6">
              {/* Conditions & Allergies Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-medical-critical" />
                    Conditions & Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Active medical conditions */}
                  <div>
                    <h3 className="font-semibold mb-2">Active Conditions</h3>
                    <ul className="space-y-2">
                      {patient.conditions.map((condition, index) => (
                        <li key={index} className="flex justify-between">
                          <div>
                            <span>{condition.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              (Diagnosed: {formatDate(condition.diagnosedDate)})
                            </span>
                          </div>
                          <Badge className={getSeverityBadgeClass(condition.severity)}>
                            {condition.severity}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  {/* Allergies section */}
                  <div>
                    <h3 className="font-semibold mb-2">Allergies</h3>
                    {patient.allergies.length > 0 ? (
                      <ul className="space-y-1">
                        {patient.allergies.map((allergy, index) => (
                          <li key={index} className="flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-medical-warning" />
                            {allergy}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No known allergies</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Medications Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-medical-blue" />
                    Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.medications.length > 0 ? (
                    <ul className="space-y-3">
                      {patient.medications.map((medication, index) => (
                        <li key={index} className="border-b pb-2 last:border-0 last:pb-0">
                          <div className="font-medium">{medication.name} {medication.dosage}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.frequency} • Started {formatDate(medication.startDate)}
                          </div>
                          <div className="text-sm">Prescribed by: {medication.prescribedBy}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No active medications</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Vitals Tab - Vital Signs and Lab Results */}
            <TabsContent value="vitals" className="space-y-6">
              {/* Vital Signs Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-medical-blue" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {patient.vitalSigns ? (
                    <>
                      <div className="text-sm text-muted-foreground mb-2">
                        Recorded on: {formatDateTime(patient.vitalSigns.recordedAt)}
                      </div>
                      {/* Grid of vital signs cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VitalCard
                          title="Temperature"
                          value={`${patient.vitalSigns.temperature}°F`}
                          normal={(patient.vitalSigns.temperature >= 97.7 && patient.vitalSigns.temperature <= 99.5)}
                          normalRange="97.7-99.5°F"
                        />
                        <VitalCard
                          title="Heart Rate"
                          value={`${patient.vitalSigns.heartRate} bpm`}
                          normal={(patient.vitalSigns.heartRate >= 60 && patient.vitalSigns.heartRate <= 100)}
                          normalRange="60-100 bpm"
                        />
                        <VitalCard
                          title="Blood Pressure"
                          value={patient.vitalSigns.bloodPressure}
                          normal={checkBPNormal(patient.vitalSigns.bloodPressure)}
                          normalRange="90/60-120/80 mmHg"
                        />
                        <VitalCard
                          title="Respiratory Rate"
                          value={`${patient.vitalSigns.respiratoryRate} bpm`}
                          normal={(patient.vitalSigns.respiratoryRate >= 12 && patient.vitalSigns.respiratoryRate <= 20)}
                          normalRange="12-20 bpm"
                        />
                        <VitalCard
                          title="Oxygen Saturation"
                          value={`${patient.vitalSigns.oxygenSaturation}%`}
                          normal={(patient.vitalSigns.oxygenSaturation >= 95)}
                          normalRange="≥95%"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No vital signs recorded</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Lab Results Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="h-5 w-5 mr-2 text-medical-blue" />
                    Lab Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.labResults.length > 0 ? (
                    <ul className="space-y-4">
                      {patient.labResults.map((labResult, index) => (
                        <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{labResult.name}</div>
                            <Badge className={getLabResultBadgeClass(labResult.status)}>
                              {labResult.status}
                            </Badge>
                          </div>
                          <div className="flex mb-1">
                            <span className="font-semibold">{labResult.result}</span>
                            {labResult.normalRange && (
                              <span className="text-muted-foreground ml-2">
                                (Normal: {labResult.normalRange})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(labResult.date)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No lab results available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* History Tab - Visit History */}
            <TabsContent value="history" className="space-y-6">
              {/* Visit History Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-medical-blue" />
                    Visit History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patient.visits.length > 0 ? (
                    <ul className="space-y-4">
                      {patient.visits.map((visit, index) => (
                        <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{formatDate(visit.date)}</span>
                            <Badge variant="outline">
                              {visit.type.charAt(0).toUpperCase() + visit.type.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-sm mb-2">Provider: {visit.provider}</div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Notes:</span> {visit.notes}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No visit history available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="space-y-6">
              <DoctorAI patient={patient} />
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-6">
              <PatientNotes patientId={patient.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper component to display individual vital signs
 * @param {Object} props - Component props
 * @param {string} props.title - Vital sign name
 * @param {string} props.value - Vital sign value
 * @param {boolean} props.normal - Whether the value is within normal range
 * @param {string} props.normalRange - Normal range description
 * @returns {JSX.Element} Vital sign card
 */
const VitalCard = ({ title, value, normal, normalRange }) => {
  return (
    <div className="border rounded-lg p-3">
      <h4 className="text-sm font-medium text-muted-foreground mb-1">{title}</h4>
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{value}</span>
        <Badge variant={normal ? "outline" : "destructive"} className={normal ? "bg-medical-lightSuccess text-medical-success" : ""}>
          {normal ? "Normal" : "Abnormal"}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Normal range: {normalRange}
      </div>
    </div>
  );
};

// PropTypes for type checking in JavaScript
PatientProfile.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    dateOfBirth: PropTypes.string.isRequired,
    mrn: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    contactInfo: PropTypes.shape({
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    }).isRequired,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      diagnosedDate: PropTypes.string.isRequired,
      severity: PropTypes.string.isRequired,
    })).isRequired,
    allergies: PropTypes.arrayOf(PropTypes.string).isRequired,
    medications: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      dosage: PropTypes.string.isRequired,
      frequency: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      prescribedBy: PropTypes.string.isRequired,
    })).isRequired,
    vitalSigns: PropTypes.object,
    labResults: PropTypes.array.isRequired,
    visits: PropTypes.array.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};

VitalCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  normal: PropTypes.bool.isRequired,
  normalRange: PropTypes.string.isRequired,
};

export default PatientProfile; 