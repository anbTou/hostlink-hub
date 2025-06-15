
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Property } from "@/types/property-knowledge";
import { Plus, Home, Building, Castle, TreePine, Hotel } from "lucide-react";

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property | null) => void;
  onCreateProperty: (property: Omit<Property, "id">) => void;
}

export const PropertySelector = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onCreateProperty,
}: PropertySelectorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    type: "villa" as Property["type"],
    address: "",
  });

  const handleCreateProperty = () => {
    if (newProperty.name.trim()) {
      onCreateProperty(newProperty);
      setNewProperty({ name: "", type: "villa", address: "" });
      setIsCreating(false);
    }
  };

  const getPropertyIcon = (type: Property["type"]) => {
    switch (type) {
      case "villa": return <Castle className="h-4 w-4" />;
      case "apartment": return <Building className="h-4 w-4" />;
      case "house": return <Home className="h-4 w-4" />;
      case "cabin": return <TreePine className="h-4 w-4" />;
      case "hotel": return <Hotel className="h-4 w-4" />;
      default: return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Property Knowledge</h3>
          <p className="text-sm text-muted-foreground">
            Manage knowledge for specific properties
          </p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Property Name
                </label>
                <Input
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                  placeholder="e.g., Sunset Villa, Downtown Apartment"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Property Type
                </label>
                <Select
                  value={newProperty.type}
                  onValueChange={(value: Property["type"]) => 
                    setNewProperty({ ...newProperty, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="cabin">Cabin</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Address (Optional)
                </label>
                <Input
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  placeholder="Property address"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProperty} disabled={!newProperty.name.trim()}>
                  Create Property
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedProperty === null ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectProperty(null)}
        >
          All Properties
        </Button>
        
        {properties.map((property) => (
          <Button
            key={property.id}
            variant={selectedProperty?.id === property.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectProperty(property)}
            className="flex items-center gap-2"
          >
            {getPropertyIcon(property.type)}
            {property.name}
            {property.isDefault && (
              <Badge variant="secondary" className="text-xs ml-1">
                Default
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
