import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // For prop validation in JavaScript
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useSlideIn } from '@/utils/animations';

/**
 * Patient Notes Component
 * Allows doctors to add, view, and manage clinical notes for patients
 * @param {Object} props - Component props
 * @param {string} props.patientId - Unique identifier for the patient
 * @returns {JSX.Element} Patient notes interface
 */
const PatientNotes = ({ patientId }) => {
  // Array of notes for this patient
  const [notes, setNotes] = useState([]);
  
  // Current note being typed
  const [newNote, setNewNote] = useState('');
  
  // Whether we're in "add note" mode
  const [isAdding, setIsAdding] = useState(false);
  
  // Toast notification hook
  const { toast } = useToast();
  
  // Animation hook for slide-in effect
  const slideInStyle = useSlideIn(100);

  // Load saved notes for this patient when component mounts
  useEffect(() => {
    // In a real app, we'd fetch from an API or database
    // For now, we'll use localStorage for persistence
    const savedNotes = localStorage.getItem(`patient-notes-${patientId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        // Convert string dates back to Date objects
        const notesWithDates = parsedNotes.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(notesWithDates);
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }
  }, [patientId]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`patient-notes-${patientId}`, JSON.stringify(notes));
    }
  }, [notes, patientId]);

  /**
   * Adds a new note to the patient's record
   */
  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj = {
      id: Date.now().toString(),
      content: newNote.trim(),
      createdAt: new Date()
    };

    setNotes(prev => [newNoteObj, ...prev]);
    setNewNote('');
    setIsAdding(false);

    toast({
      title: "Note saved",
      description: "Your note has been saved successfully."
    });
  };

  /**
   * Deletes a note from the patient's record
   * @param {string} noteId - ID of the note to delete
   */
  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    
    toast({
      title: "Note deleted",
      description: "The note has been removed."
    });
  };

  /**
   * Formats a date for display
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-4" style={slideInStyle}>
      <Card>
        {/* Card header with title and add button */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Patient Notes</CardTitle>
            <CardDescription>Record and track patient visit notes</CardDescription>
          </div>
          {!isAdding && (
            <Button 
              size="sm" 
              onClick={() => setIsAdding(true)}
              className="mt-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {isAdding ? (
            /* Add note form */
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your clinical notes here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </div>
            </div>
          ) : notes.length === 0 ? (
            /* Empty state when no notes exist */
            <div className="text-center py-8 text-muted-foreground">
              <p>No notes have been added yet.</p>
              <p>Click "Add Note" to create your first note for this patient.</p>
            </div>
          ) : (
            /* List of existing notes */
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="bg-accent/50">
                  <CardContent className="pt-6">
                    {/* Note header with date and delete button */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteNote(note.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Note content */}
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// PropTypes for type checking in JavaScript
PatientNotes.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default PatientNotes; 