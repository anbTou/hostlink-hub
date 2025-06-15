import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PropertySelector } from "@/components/knowledge/PropertySelector";
import { Property } from "@/types/property-knowledge";
import {
  Home,
  Info,
  BedDouble,
  Bath,
  Sparkles,
  MapPin,
  CalendarClock,
  ClipboardList,
  HeartPulse,
  Sun,
  Camera,
  Edit,
  Pencil,
  Users,
  Map,
  Plus,
} from "lucide-react";

const PropertyInfo = () => {
  const [properties] = useState<Property[]>([
    {
      id: "1",
      name: "Villa Serenity",
      type: "villa",
      address: "123 Ocean View Drive, Coastal City",
      isDefault: true,
    },
    {
      id: "2",
      name: "Downtown Apartment",
      type: "apartment",
      address: "456 Main Street, City Center",
    },
  ]);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(properties[0]);

  const handleCreateProperty = (newPropertyData: Omit<Property, "id">) => {
    const newProperty: Property = {
      ...newPropertyData,
      id: Date.now().toString(),
    };
    // In a real app, this would update the properties state
    console.log("Creating property:", newProperty);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-scale-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Property Information</h1>
            <p className="text-muted-foreground">
              Comprehensive details about your property for AI knowledge
            </p>
          </div>
          <div className="flex gap-3">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
          </div>
        </div>

        <PropertySelector
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={setSelectedProperty}
          onCreateProperty={handleCreateProperty}
        />
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="flex w-full overflow-x-auto overflow-y-hidden py-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Basic</span>
            </TabsTrigger>
            <TabsTrigger value="arrival" className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Arrival</span>
            </TabsTrigger>
            <TabsTrigger value="accommodation" className="flex items-center gap-2">
              <BedDouble className="h-4 w-4" />
              <span>Accommodation</span>
            </TabsTrigger>
            <TabsTrigger value="amenities" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Amenities</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Rules</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <HeartPulse className="h-4 w-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="local" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Local Area</span>
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>Seasonal</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <span>Photos</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Basic Details Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Basic Property Details
                  {selectedProperty && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedProperty.name}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedProperty 
                    ? `Information for ${selectedProperty.name}`
                    : "Select a property to view its details"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedProperty ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-medium mb-2">{selectedProperty.name}</h3>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Type:</span> {selectedProperty.type}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Address:</span> {selectedProperty.address}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Size:</span> 3,500 sq ft
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Key Features</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Ocean View</Badge>
                          <Badge variant="outline">Private Pool</Badge>
                          <Badge variant="outline">Garden</Badge>
                          <Badge variant="outline">Terrace</Badge>
                          <Badge variant="outline">Smart Home</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Marketing Description</h3>
                      <p className="text-sm">A luxurious oceanfront villa with private pool, stunning views, and modern amenities, perfect for families or groups seeking relaxation and privacy.</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Full Description</h3>
                      <p className="text-sm whitespace-pre-line">
                        {selectedProperty.name} is an exquisite luxury retreat with thoughtfully designed spaces and modern amenities. This property combines elegant architecture with comfortable living to create the perfect vacation home.

                        The property features spacious rooms, modern bathrooms, a gourmet kitchen, and multiple entertainment areas. Large windows throughout maximize natural light and views, while smart home technology ensures convenience at your fingertips.

                        Located in a prime location, this property offers the perfect balance of privacy and convenience for your guests.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Select a property to view and edit its information</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Accommodation Tab */}
          <TabsContent value="accommodation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5" />
                  Accommodation Details
                  {selectedProperty && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedProperty.name}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Information about bedrooms, bathrooms, and layout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedProperty ? (
                  <>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Max Occupancy:</span>
                        <span>8 adults, 4 children</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BedDouble className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Bedrooms:</span>
                        <span>4</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Bathrooms:</span>
                        <span>3.5</span>
                      </div>
                    </div>

                    <Separator />
                    
                    <div>
                      <h3 className="text-base font-medium mb-4">Bedroom Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="overflow-hidden">
                          <CardHeader className="bg-muted py-3">
                            <CardTitle className="text-base">Master Suite</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Beds:</span> 1 King-size bed
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">En-suite:</span> Yes
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Amenities:</span> Walk-in closet, Smart TV, Private balcony with ocean view
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="overflow-hidden">
                          <CardHeader className="bg-muted py-3">
                            <CardTitle className="text-base">Blue Room</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Beds:</span> 1 Queen-size bed
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">En-suite:</span> Yes
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Amenities:</span> Smart TV, Garden view, Reading nook
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-2">Floor Plan</h3>
                      <p className="text-sm whitespace-pre-line">
                        The villa has two floors. The ground floor features an open plan living, dining and kitchen area, half bathroom, garden suite bedroom, and children's room with shared bathroom. The upper floor contains the master suite and blue room, each with their own bathroom. Multiple terraces and balconies connect the indoor and outdoor spaces.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Select a property to view accommodation details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would follow the same pattern */}
          <TabsContent value="arrival">
            <Card>
              <CardHeader>
                <CardTitle>Arrival & Departure Information</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Arrival details for ${selectedProperty.name}` : "Select a property to manage arrival information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include check-in/check-out times, directions, and other arrival details for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view arrival information</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="amenities">
            <Card>
              <CardHeader>
                <CardTitle>Amenities & Facilities</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Amenities for ${selectedProperty.name}` : "Select a property to manage amenities"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include information about all amenities for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view amenities</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>House Rules & Policies</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Rules for ${selectedProperty.name}` : "Select a property to manage rules"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include all house rules and policies for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view rules</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Services & Support</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Services for ${selectedProperty.name}` : "Select a property to manage services"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include information about cleaning, linen changes, and other services for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view services</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="local">
            <Card>
              <CardHeader>
                <CardTitle>Local Area Information</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Local area around ${selectedProperty.name}` : "Select a property to manage local information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include information about nearby attractions, restaurants, and services around {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view local area information</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="seasonal">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Information</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Seasonal details for ${selectedProperty.name}` : "Select a property to manage seasonal information"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include climate information, seasonal amenities, and local events for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view seasonal information</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Property Photos</CardTitle>
                <CardDescription>
                  {selectedProperty ? `Photos of ${selectedProperty.name}` : "Select a property to manage photos"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedProperty ? (
                  <p>This section will include photos of each room and amenity for {selectedProperty.name}.</p>
                ) : (
                  <p className="text-muted-foreground">Select a property to view photos</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PropertyInfo;
