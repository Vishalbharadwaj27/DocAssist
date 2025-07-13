import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PatientCard } from '@/components/PatientCard';
import { PatientProfile } from '@/components/PatientProfile';
import { ConversationInterface } from '@/components/ConversationInterface';
import { DoctorAI } from '@/components/DoctorAI';
import { patients } from '@/utils/mockData';
import { useFadeIn } from '@/utils/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddPatientForm } from '@/components/AddPatientForm';
import { useAuth } from '@/hooks/useAuth';

/**
 * Main Index Page Component
 * Dashboard page that shows patient overview and navigation
 * @returns {JSX.Element} Main dashboard page
 */
const Index = () => {
  // Currently selected patient for detailed view
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // List of all patients
  const [patientsList, setPatientsList] = useState(patients);
  
  // State for add patient form modal
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  
  // Animation hook for fade-in effect
  const contentStyle = useFadeIn(200);
  
  // Get current authenticated user
  const { user } = useAuth();
  
  // Get the user's name from metadata or use a default value
  const userName = user?.user_metadata?.name || "Doctor";

  /**
   * Handles when a patient card is clicked
   * @param {Object} patient - The selected patient object
   */
  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handles when back button is clicked from patient profile
   */
  const handleBackClick = () => {
    setSelectedPatient(null);
  };

  /**
   * Handles adding a new patient to the list
   * @param {Object} newPatient - The new patient object to add
   */
  const handleAddPatient = (newPatient) => {
    setPatientsList(prev => [newPatient, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container px-4 md:px-6 py-8" style={contentStyle}>
        {selectedPatient ? (
          /* Show patient profile when a patient is selected */
          <PatientProfile 
            patient={selectedPatient} 
            onBack={handleBackClick} 
          />
        ) : (
          /* Show main dashboard when no patient is selected */
          <div className="space-y-8">
            {/* Welcome header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {userName}</h1>
              <p className="text-muted-foreground">
                Tuesday, December 12, 2023 • You have {patientsList.length} patients scheduled today
              </p>
            </div>
            
            {/* Main navigation tabs */}
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              </TabsList>
              
              {/* Dashboard tab content */}
              <TabsContent value="dashboard" className="mt-6">
                {/* Status cards showing patient counts by status */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatusCard 
                    title="Critical Patients" 
                    count={patientsList.filter(p => p.status === 'critical').length} 
                    color="medical-critical"
                  />
                  <StatusCard 
                    title="Requires Attention" 
                    count={patientsList.filter(p => p.status === 'warning').length} 
                    color="medical-warning"
                  />
                  <StatusCard 
                    title="Stable Patients" 
                    count={patientsList.filter(p => p.status === 'stable').length} 
                    color="medical-success"
                  />
                </div>
                
                {/* Recent patients section */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patientsList.map((patient, index) => (
                      <PatientCard 
                        key={patient.id} 
                        patient={patient} 
                        onClick={() => handlePatientClick(patient)}
                        delay={index * 100}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Patients tab content */}
              <TabsContent value="patients" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">All Patients</h2>
                  <Button onClick={() => setIsAddPatientOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patientsList.map((patient, index) => (
                    <PatientCard 
                      key={patient.id} 
                      patient={patient} 
                      onClick={() => handlePatientClick(patient)}
                      delay={index * 100}
                    />
                  ))}
                </div>
              </TabsContent>
              
              {/* AI Assistant tab content */}
              <TabsContent value="ai" className="mt-6">
                <div className="grid grid-cols-1 gap-6">
                  <DoctorAI />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Add Patient Form Modal */}
      <AddPatientForm 
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

/**
 * Status Card Component
 * Displays a count with a colored indicator
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number} props.count - Number to display
 * @param {string} props.color - CSS color class for styling
 * @returns {JSX.Element} Status card
 */
const StatusCard = ({ title, count, color }) => {
  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-6 overflow-hidden relative`}>
      {/* Colored indicator bar on the left */}
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color}`} />
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className={`text-4xl font-bold text-${color}`}>{count}</p>
    </div>
  );
};

export default Index; 