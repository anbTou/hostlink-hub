
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

interface QuickNotesProps {
  notes: Note[];
}

export function QuickNotes({ notes: initialNotes }: QuickNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: new Date(),
      };
      setNotes([note, ...notes]);
      setNewNote("");
    }
  };

  const handleConvertToTask = (noteId: string) => {
    // In a real app, this would create a task based on the note content
    console.log("Converting note to task:", noteId);
    // For the demo, we'll just remove the note
    setNotes(notes.filter(note => note.id !== noteId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea 
          placeholder="Add a quick note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="resize-none"
        />
        <Button 
          onClick={handleAddNote} 
          className="w-full"
          disabled={!newNote.trim()}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>
      
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {notes.map((note) => (
          <div 
            key={note.id} 
            className="bg-muted/50 p-3 rounded-md relative group border border-border"
          >
            <p className="text-sm">{note.content}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {format(note.timestamp, "MMM d, h:mm a")}
              </span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="py-1 h-auto text-xs"
                onClick={() => handleConvertToTask(note.id)}
              >
                Convert to Task
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {notes.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-3">
            No notes yet. Add your first note above.
          </p>
        )}
      </div>
    </div>
  );
}
