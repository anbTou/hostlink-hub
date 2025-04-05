
import { MainLayout } from "@/components/layout/MainLayout";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check, PlusCircle, Search, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Maintenance reminder",
      content: "Schedule quarterly maintenance check for all properties. Need to coordinate with service providers.",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 2))
    },
    {
      id: "2",
      title: "Guest feedback ideas",
      content: "Consider adding a welcome package with local recommendations and amenities guide. Guests have been asking about local attractions.",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 5))
    },
    {
      id: "3",
      title: "Marketing campaign",
      content: "Brainstorm ideas for summer promotion. Consider discounts for longer stays or partnerships with local businesses.",
      timestamp: new Date(new Date().setDate(new Date().getDate() - 7))
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title.trim(),
        content: newNote.content.trim(),
        timestamp: new Date()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "" });
    }
  };
  
  const handleConvertToTask = (noteId: string) => {
    // In a real app, this would open a modal to create a task
    alert("Converting note to task: " + noteId);
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote === noteId) {
      setSelectedNote(null);
    }
  };
  
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0].id);
    }
  }, [notes, selectedNote]);
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Quick Notes</h1>
          <p className="text-muted-foreground">Capture thoughts and easily convert them to tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notes..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="divide-y max-h-[500px] overflow-y-auto">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedNote === note.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedNote(note.id)}
                  >
                    <h3 className="font-medium text-sm truncate">{note.title}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-1">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(note.timestamp, "MMM d, yyyy")}
                    </p>
                  </div>
                ))}
                
                {filteredNotes.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    No notes found
                  </div>
                )}
              </div>
            </div>
            
            <Button className="w-full" onClick={() => {
              setSelectedNote(null);
              setNewNote({ title: "", content: "" });
            }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Note
            </Button>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedNote ? "Edit Note" : "New Note"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNote ? (
                  // Edit existing note
                  (() => {
                    const note = notes.find(n => n.id === selectedNote);
                    if (!note) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={note.title}
                            onChange={(e) => {
                              setNotes(notes.map(n => 
                                n.id === selectedNote 
                                  ? { ...n, title: e.target.value } 
                                  : n
                              ));
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="edit-content">Content</Label>
                          <Textarea
                            id="edit-content"
                            rows={10}
                            value={note.content}
                            onChange={(e) => {
                              setNotes(notes.map(n => 
                                n.id === selectedNote 
                                  ? { ...n, content: e.target.value } 
                                  : n
                              ));
                            }}
                            className="resize-none"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Created: {format(note.timestamp, "MMMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          
                          <div className="space-x-2">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteNote(note.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                            <Button size="sm" onClick={() => handleConvertToTask(note.id)}>
                              <ArrowRight className="mr-2 h-4 w-4" />
                              Convert to Task
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  // Create new note
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-title">Title</Label>
                      <Input
                        id="new-title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        placeholder="Note title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-content">Content</Label>
                      <Textarea
                        id="new-content"
                        rows={10}
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        placeholder="Write your note here..."
                        className="resize-none"
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleAddNote}
                      disabled={!newNote.title.trim() || !newNote.content.trim()}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Save Note
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Notes;
