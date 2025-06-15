import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EnhancedDocumentUpload } from "@/components/knowledge/EnhancedDocumentUpload";
import { Search, Plus, Book, Edit, Trash, Save, X, Upload, Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { KnowledgeBlock, AIProcessingResult } from "@/types/property-knowledge";

const sampleKnowledgeBlocks: KnowledgeBlock[] = [
  {
    id: "1",
    title: "Check-in Instructions",
    content: "The check-in time is 3:00 PM. Early check-in can be arranged with prior notice, subject to availability. The key lockbox code will be sent to you 24 hours before arrival. Please contact us if you're arriving after 8:00 PM.",
    category: "checkin",
    lastUpdated: "2 days ago",
    status: "approved",
    guestPersona: "all",
    seasonal: "all",
    priority: "high",
    tags: ["arrival", "lockbox", "timing"],
    aiConfidence: 0.95,
  },
  {
    id: "2",
    title: "Wifi Information",
    content: "Network name: VillaGuest\nPassword: sunshine2023\nThe wifi reaches all areas of the property, including the pool area.",
    category: "amenities",
    lastUpdated: "1 week ago",
    status: "approved",
    guestPersona: "all",
    seasonal: "all",
    priority: "medium",
    tags: ["wifi", "internet", "password"],
  },
  {
    id: "3",
    title: "Local Restaurants",
    content: "1. Seaside Grill - Seafood restaurant, 5 min walk\n2. La Trattoria - Italian cuisine, 10 min walk\n3. Golden Dragon - Chinese food, 15 min drive\n4. The Steakhouse - Premium meats, 10 min drive",
    category: "local",
    lastUpdated: "2 weeks ago",
  },
  {
    id: "4",
    title: "Cancellation Policy",
    content: "Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in are eligible for a 50% refund of the total booking amount, excluding fees.",
    category: "policies",
    lastUpdated: "1 month ago",
  },
];

const KnowledgePage = () => {
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>(sampleKnowledgeBlocks);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingBlock, setEditingBlock] = useState<KnowledgeBlock | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newBlock, setNewBlock] = useState<Omit<KnowledgeBlock, "id" | "lastUpdated">>({
    title: "",
    content: "",
    category: "property",
    status: "draft",
    guestPersona: "all",
    seasonal: "all",
    priority: "medium",
  });
  
  const filteredBlocks = knowledgeBlocks.filter(block => 
    block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSaveEdit = () => {
    if (editingBlock) {
      setKnowledgeBlocks(
        knowledgeBlocks.map(block => 
          block.id === editingBlock.id ? { ...editingBlock, lastUpdated: "Just now" } : block
        )
      );
      setEditingBlock(null);
    }
  };
  
  const handleCreateBlock = () => {
    if (newBlock.title && newBlock.content) {
      const createdBlock: KnowledgeBlock = {
        ...newBlock,
        id: Date.now().toString(),
        lastUpdated: "Just now",
      };
      
      setKnowledgeBlocks([createdBlock, ...knowledgeBlocks]);
      setNewBlock({
        title: "",
        content: "",
        category: "property",
        status: "draft",
        guestPersona: "all",
        seasonal: "all",
        priority: "medium",
      });
      setIsCreating(false);
    }
  };
  
  const handleDeleteBlock = (id: string) => {
    setKnowledgeBlocks(knowledgeBlocks.filter(block => block.id !== id));
  };
  
  const handleDocumentProcessed = (result: AIProcessingResult) => {
    const newBlocks: KnowledgeBlock[] = result.extractedBlocks.map(block => ({
      ...block,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      lastUpdated: "Just now",
    }));
    
    setKnowledgeBlocks([...newBlocks, ...knowledgeBlocks]);
  };
  
  const getCategoryLabel = (category: KnowledgeBlock["category"]) => {
    const categories = {
      property: "Property Info",
      policies: "Policies",
      local: "Local Area",
      custom: "Custom",
      safety: "Safety",
      amenities: "Amenities",
      checkin: "Check-in",
      emergency: "Emergency",
    };
    
    return categories[category];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'reviewed': return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
      default: return <Edit className="h-3 w-3 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-8 animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">
            AI-powered content management for comprehensive guest information.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search knowledge base..." 
              className="pl-9 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDocumentUpload(true)}>
              <Brain className="h-4 w-4 mr-2" />
              AI Document Processing
            </Button>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge Block
            </Button>
          </div>
        </div>
        
        {showDocumentUpload && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <EnhancedDocumentUpload 
              onDocumentProcessed={handleDocumentProcessed}
              onClose={() => setShowDocumentUpload(false)}
              propertyType="villa"
            />
          </div>
        )}
        
        {isCreating && (
          <Card className="border-primary/50 animate-scale-in">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>New Knowledge Block</span>
                <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Title
                  </label>
                  <Input 
                    value={newBlock.title}
                    onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                    placeholder="Enter a title for this knowledge block"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Category
                  </label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newBlock.category}
                    onChange={(e) => setNewBlock({ ...newBlock, category: e.target.value as KnowledgeBlock["category"] })}
                  >
                    <option value="property">Property Info</option>
                    <option value="policies">Policies</option>
                    <option value="local">Local Area</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Content
                  </label>
                  <Textarea 
                    value={newBlock.content}
                    onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                    placeholder="Enter the knowledge content..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleCreateBlock} disabled={!newBlock.title || !newBlock.content}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlocks.map((block) => (
            <Card key={block.id} className="hover-card-effect">
              {editingBlock && editingBlock.id === block.id ? (
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Title
                      </label>
                      <Input 
                        value={editingBlock.title}
                        onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Category
                      </label>
                      <select 
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={editingBlock.category}
                        onChange={(e) => setEditingBlock({ ...editingBlock, category: e.target.value as KnowledgeBlock["category"] })}
                      >
                        <option value="property">Property Info</option>
                        <option value="policies">Policies</option>
                        <option value="local">Local Area</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Content
                      </label>
                      <Textarea 
                        value={editingBlock.content}
                        onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingBlock(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">{block.title}</CardTitle>
                          {getStatusIcon(block.status)}
                          {block.source?.generatedByAI && (
                            <Badge variant="outline" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            <Book className="h-3 w-3 mr-1" />
                            {getCategoryLabel(block.category)}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(block.priority)}`}>
                            {block.priority}
                          </Badge>
                          {block.aiConfidence && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round(block.aiConfidence * 100)}% confident
                            </Badge>
                          )}
                        </div>
                        
                        {block.tags && block.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {block.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {block.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{block.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          Updated {block.lastUpdated}
                        </div>
                        
                        {block.source?.filename && (
                          <div className="text-xs text-muted-foreground">
                            Source: {block.source.filename}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingBlock(block)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteBlock(block.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line line-clamp-4">{block.content}</p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
          
          {filteredBlocks.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-medium mb-1">No knowledge blocks found</h3>
                <p>Try adjusting your search or upload documents for AI processing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default KnowledgePage;
