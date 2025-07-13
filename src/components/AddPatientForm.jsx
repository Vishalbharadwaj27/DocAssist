import React from "react";
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/**
 * Schema for validating patient form data
 * This defines the structure and validation rules for the form
 */
const patientFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string(),
  gender: z.string(),
  mrn: z.string().min(4, "MRN must be at least 4 characters"),
  status: z.enum(["stable", "warning", "critical"]),
  primaryDoctor: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string().email("Invalid email address"),
  contactAddress: z.string(),
  condition: z.string(),
  medication: z.string(),
  allergies: z.string(),
  visitNotes: z.string(),
});

/**
 * Add Patient Form Component
 * A dialog form for adding new patients to the system
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the dialog is open
 * @param {Function} props.onClose - Function to close the dialog
 * @param {Function} props.onAddPatient - Function to handle adding a new patient
 * @returns {JSX.Element} Add patient form dialog
 */
export function AddPatientForm({ isOpen, onClose, onAddPatient }) {
  const { toast } = useToast();
  
  // Initialize form with validation and default values
  const form = useForm({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      // Generate a random MRN number for new patients
      mrn: `MRN${Math.floor(10000 + Math.random() * 90000)}`,
      status: "stable",
      primaryDoctor: "Dr. Sarah Johnson",
      contactPhone: "",
      contactEmail: "",
      contactAddress: "",
      condition: "",
      medication: "",
      allergies: "",
      visitNotes: "",
    },
  });

  /**
   * Handles form submission when user clicks "Add Patient"
   * @param {Object} data - Form data from all input fields
   */
  const onSubmit = (data) => {
    // Format today's date for the patient record
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    
    // Create new patient object with all required fields
    const newPatient = {
      id: `p-${Date.now()}`, // Generate unique patient ID
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      mrn: data.mrn,
      lastVisit: formattedDate,
      status: data.status,
      primaryDoctor: data.primaryDoctor,
      // Contact information object
      contactInfo: {
        phone: data.contactPhone,
        email: data.contactEmail,
        address: data.contactAddress,
      },
      // Default vital signs for new patient
      vitalSigns: {
        temperature: 98.6,
        heartRate: 72,
        bloodPressure: "120/80",
        respiratoryRate: 16,
        oxygenSaturation: 98,
        recordedAt: new Date().toISOString(),
      },
      // Convert condition string to condition object
      conditions: [
        {
          name: data.condition,
          diagnosedDate: formattedDate,
          status: "active",
          severity: "moderate",
        },
      ],
      // Convert medication string to medication object
      medications: [
        {
          name: data.medication,
          dosage: "",
          frequency: "",
          startDate: formattedDate,
          prescribedBy: data.primaryDoctor,
        },
      ],
      // Convert comma-separated allergies string to array
      allergies: data.allergies ? data.allergies.split(",").map(allergy => allergy.trim()) : [],
      labResults: [], // Empty array for new patient
      visits: [
        {
          date: formattedDate,
          type: "routine",
          provider: data.primaryDoctor,
          notes: data.visitNotes,
        },
      ],
    };

    // Call the parent function to add the patient
    onAddPatient(newPatient);
    
    // Show success message to user
    toast({
      title: "Patient Added",
      description: `${data.firstName} ${data.lastName} has been added to your patients.`,
    });
    
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name Field */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Name Field */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Demographics Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth Field */}
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Gender Selection */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Medical Record Information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Medical Record Number */}
              <FormField
                control={form.control}
                name="mrn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Record Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Patient Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="warning">Requires Attention</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Primary Doctor Field */}
            <FormField
              control={form.control}
              name="primaryDoctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Doctor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Information Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Email Address */}
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="patient@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Physical Address */}
                <FormField
                  control={form.control}
                  name="contactAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City, State, Zip" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Medical Information</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Primary Medical Condition */}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Condition</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Hypertension" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Primary Medication */}
                <FormField
                  control={form.control}
                  name="medication"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Medication</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lisinopril" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Allergies List */}
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Penicillin, Peanuts" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Initial Visit Notes */}
                <FormField
                  control={form.control}
                  name="visitNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Visit Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notes about the patient's initial visit"
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// PropTypes for type checking in JavaScript
AddPatientForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddPatient: PropTypes.func.isRequired,
}; 