import { Property } from "@/types/property";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

const img = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=70`;

const standardAmenities = (overrides: Record<string, boolean> = {}): Property["amenities"] => {
  const make = (label: string, available = true, note?: string) => ({
    id: label.toLowerCase().replace(/[^a-z]/g, "-"),
    label,
    available: overrides[label] ?? available,
    note,
  });
  return [
    {
      category: "Essentials",
      items: [
        make("WiFi", true, "Fibre 500 Mbps"),
        make("Air Conditioning"),
        make("Heating"),
        make("Washer"),
        make("Dryer"),
        make("Iron"),
        make("Hair Dryer"),
      ],
    },
    {
      category: "Kitchen",
      items: [
        make("Full Kitchen"),
        make("Oven"),
        make("Microwave"),
        make("Dishwasher"),
        make("Coffee Machine", true, "Nespresso"),
        make("Toaster"),
      ],
    },
    {
      category: "Entertainment",
      items: [
        make("TV"),
        make("Netflix"),
        make("Smart TV"),
        make("Board Games", false),
        make("Books"),
        make("Sound System", false),
      ],
    },
    {
      category: "Outdoor",
      items: [
        make("Pool", true, "Heated, available May–October"),
        make("BBQ"),
        make("Garden"),
        make("Terrace"),
        make("Balcony", false),
        make("Outdoor Dining"),
      ],
    },
    {
      category: "Safety",
      items: [
        make("Smoke Detector"),
        make("Carbon Monoxide Detector"),
        make("Fire Extinguisher"),
        make("First Aid Kit"),
        make("Safe"),
      ],
    },
    {
      category: "Parking",
      items: [make("Free Parking"), make("Garage", false), make("Street Parking")],
    },
    {
      category: "Family",
      items: [
        make("Crib"),
        make("High Chair"),
        make("Baby Monitor", false),
        make("Childproofing", false),
      ],
    },
    {
      category: "Accessibility",
      items: [
        make("Wheelchair Access", false),
        make("Elevator", false),
        make("Ground Floor"),
        make("Step-free Access", false),
      ],
    },
  ];
};

export const mockProperties: Property[] = [
  {
    id: "p1",
    name: "Villa Serenity",
    type: "villa",
    isDefault: true,
    syncProvider: "BookingSync",
    lastSyncedAt: hoursAgo(2),
    city: "Cascais",
    country: "Portugal",
    fullAddress: "123 Ocean View Drive, 2750-642 Cascais, Portugal",
    size: "325 m²",
    coordinates: { lat: 38.6979, lng: -9.4215 },
    marketingDescription:
      "A luxurious oceanfront villa with a private pool, stunning views and modern amenities.",
    fullDescription:
      "Villa Serenity is an exquisite luxury retreat with thoughtfully designed spaces and modern amenities. The property combines elegant architecture with comfortable living to create the perfect vacation home.\n\nIt features spacious rooms, modern bathrooms, a gourmet kitchen and multiple entertainment areas. Large windows throughout maximise natural light and ocean views, while smart-home technology ensures convenience at your fingertips.\n\nLocated minutes from the beach, the villa offers the perfect balance of privacy and convenience.",
    keyFeatures: ["Ocean View", "Private Pool", "Garden", "Terrace", "Smart Home", "Parking"],
    externalIds: [
      { channel: "Airbnb", id: "AB-123456" },
      { channel: "Booking", id: "BK-789012" },
      { channel: "VRBO", id: "VR-345678" },
    ],
    owner: { name: "Maria Fernandes", contact: "+351 912 000 111", notes: "Prefers WhatsApp contact." },
    coverImage: img("photo-1613490493576-7fde63acd811"),
    arrival: {
      checkInTime: "15:00",
      accessMethod: "Smart Lock",
      accessCode: "4827",
      arrivalInstructions:
        "Enter through the main gate using the access code. The smart lock on the front door uses the same code. Keys for the pool gate are in the entrance drawer.",
      checkOutTime: "11:00",
      checkOutInstructions:
        "Please leave used towels in the bathroom, load and start the dishwasher, and close all windows. Leave the keys in the entrance drawer.",
      directions:
        "From Lisbon, take the A5 towards Cascais, exit at Birre and follow signs to Guincho. The villa is the second house on the right after the roundabout.",
      publicTransport: "Cascais train station (15 min by car). Bus 405 stops 300 m away.",
      parking: { available: true, type: "Private", cost: "Free", notes: "Space for 2 cars in the driveway." },
      localContacts: {
        emergency: { name: "João Silva", phone: "+351 919 111 222", role: "Property manager" },
        cleaning: { name: "CleanCo Lda.", phone: "+351 912 345 678", role: "Cleaning" },
        maintenance: { name: "FixIt Serviços", phone: "+351 913 444 555", role: "Maintenance" },
      },
    },
    accommodation: {
      maxGuests: 8,
      bedrooms: 4,
      beds: "2 double, 1 king, 1 single, 1 sofa bed",
      bathrooms: "3 (2 with bathtub, 1 with shower)",
      rooms: [
        { id: "r1", name: "Master Bedroom", bed: "King Size", ensuite: true, notes: "Ocean view, private balcony, walk-in closet" },
        { id: "r2", name: "Blue Room", bed: "Queen Size", ensuite: true, notes: "Garden view, reading nook" },
        { id: "r3", name: "Twin Room", bed: "2 Single beds", ensuite: false, notes: "Ideal for children" },
        { id: "r4", name: "Garden Suite", bed: "Double", ensuite: true, notes: "Direct garden access" },
      ],
      commonAreas: [
        { id: "c1", name: "Living Room", note: "Smart TV, fireplace" },
        { id: "c2", name: "Gourmet Kitchen", note: "Fully equipped, island" },
        { id: "c3", name: "Terrace", note: "Outdoor dining for 8" },
        { id: "c4", name: "Pool Area", note: "Heated pool, sun loungers" },
      ],
    },
    amenities: standardAmenities(),
    rules: {
      pets: "On request",
      petsFee: "€40 per stay",
      smoking: "Outdoor only",
      events: "Not permitted",
      quietHours: "22:00 – 08:00",
      maxOccupancy: 8,
      additionalRules: "No unregistered guests. Pool use at own risk; children must be supervised.",
      minAge: "25",
    },
    services: [
      { id: "s1", name: "Cleaning Service", icon: "🧹", included: "Mid-stay clean (weekly)", extra: "€50/clean", provider: "CleanCo Lda.", contact: "+351 912 345 678" },
      { id: "s2", name: "Pool Maintenance", icon: "🏊", included: "Weekly", provider: "AquaCare", contact: "+351 914 222 333" },
      { id: "s3", name: "Airport Transfer", icon: "🚐", extra: "€60 each way", provider: "Cascais Transfers", contact: "+351 915 666 777" },
    ],
    localArea: {
      syncedDescription:
        "Cascais is an elegant coastal town west of Lisbon, known for its beaches, marina and charming old town full of restaurants and shops.",
      categories: [
        {
          id: "rest",
          label: "Restaurants",
          icon: "🍽",
          items: [
            { id: "re1", name: "Marisco na Praça", detail: "Seafood", distance: "1.2 km", note: "Team favourite — book ahead" },
            { id: "re2", name: "Casa da Guia", detail: "Mediterranean", distance: "3 km", note: "Great sunset views" },
          ],
        },
        {
          id: "beach",
          label: "Beaches",
          icon: "🏖",
          items: [
            { id: "b1", name: "Praia do Guincho", distance: "4 km", note: "Surf & wind — bring a jacket" },
            { id: "b2", name: "Praia da Rainha", distance: "2 km", note: "Small, sheltered cove" },
          ],
        },
        {
          id: "super",
          label: "Supermarkets",
          icon: "🛒",
          items: [{ id: "su1", name: "Continente Modelo", distance: "1.5 km" }],
        },
        {
          id: "health",
          label: "Hospital / Pharmacy",
          icon: "🏥",
          items: [{ id: "h1", name: "Hospital de Cascais", distance: "6 km", contact: "+351 214 653 000" }],
        },
        {
          id: "act",
          label: "Activities",
          icon: "🎭",
          items: [{ id: "a1", name: "Boca do Inferno", note: "Dramatic coastal rock formation, 10 min walk" }],
        },
      ],
    },
    photos: [
      { id: "ph1", url: img("photo-1613490493576-7fde63acd811"), caption: "Exterior & pool", source: "synced" },
      { id: "ph2", url: img("photo-1502672260266-1c1ef2d93688"), caption: "Living room", source: "synced" },
      { id: "ph3", url: img("photo-1560448204-e02f11c3d0e2"), caption: "Master bedroom", source: "synced" },
      { id: "ph4", url: img("photo-1556911220-bff31c812dba"), caption: "Kitchen", source: "internal" },
      { id: "ph5", url: img("photo-1584622650111-993a426fbf0a"), caption: "Bathroom", source: "synced" },
      { id: "ph6", url: img("photo-1505691938895-1758d7feb511"), caption: "Terrace at sunset", source: "internal" },
    ],
    channels: [
      { channel: "Airbnb", status: "active", listingId: "123456", lastSynced: hoursAgo(2), url: "https://airbnb.com" },
      { channel: "Booking", status: "active", listingId: "789012", lastSynced: hoursAgo(2), url: "https://booking.com" },
      { channel: "VRBO", status: "paused", listingId: "345678", lastSynced: daysAgo(1), url: "https://vrbo.com" },
      { channel: "Expedia", status: "not-listed" },
    ],
  },
  {
    id: "p2",
    name: "Downtown Apartment",
    type: "apartment",
    syncProvider: "BookingSync",
    lastSyncedAt: hoursAgo(5),
    syncFailed: true,
    city: "Lisboa",
    country: "Portugal",
    fullAddress: "456 Rua Augusta, 1100-053 Lisboa, Portugal",
    size: "95 m²",
    coordinates: { lat: 38.7108, lng: -9.1366 },
    marketingDescription:
      "A bright, modern 2-bedroom apartment in the heart of Lisbon's historic centre.",
    fullDescription:
      "Downtown Apartment sits in the lively Baixa district, steps from restaurants, shops and the riverfront. Recently renovated, it blends classic Portuguese tiles with contemporary comfort.\n\nIdeal for couples or small families exploring the city on foot.",
    keyFeatures: ["City Centre", "Balcony", "Smart Home", "Air Conditioning"],
    externalIds: [
      { channel: "Airbnb", id: "AB-552211" },
      { channel: "Booking", id: "BK-334455" },
    ],
    owner: { name: "Pedro Ramos", contact: "+351 967 333 222" },
    coverImage: img("photo-1502672260266-1c1ef2d93688"),
    arrival: {
      checkInTime: "16:00",
      accessMethod: "Lockbox",
      accessCode: "9301",
      arrivalInstructions:
        "The lockbox is to the right of the building entrance. Apartment is on the 3rd floor — there is an elevator.",
      checkOutTime: "11:00",
      checkOutInstructions: "Return keys to the lockbox and scramble the code.",
      directions: "From the airport, take the metro (red line) to Baixa-Chiado, 8 min walk from there.",
      publicTransport: "Metro Baixa-Chiado 400 m. Multiple bus and tram lines nearby.",
      parking: { available: false, notes: "Paid public garage 200 m away (~€18/day)." },
      localContacts: {
        emergency: { name: "Ana Lopes", phone: "+351 961 222 333", role: "Property manager" },
        cleaning: { name: "Lisbon Clean", phone: "+351 962 444 555", role: "Cleaning" },
      },
    },
    accommodation: {
      maxGuests: 4,
      bedrooms: 2,
      beds: "1 double, 2 single",
      bathrooms: "1 (with shower)",
      rooms: [
        { id: "r1", name: "Main Bedroom", bed: "Double", ensuite: false, notes: "Street-facing, blackout blinds" },
        { id: "r2", name: "Second Bedroom", bed: "2 Single beds", ensuite: false },
      ],
      commonAreas: [
        { id: "c1", name: "Open-plan Living/Kitchen", note: "Dining table for 4" },
        { id: "c2", name: "Balcony", note: "Morning sun" },
      ],
    },
    amenities: standardAmenities({ Pool: false, BBQ: false, Garden: false, "Free Parking": false, Elevator: true }),
    rules: {
      pets: "Not permitted",
      smoking: "Not permitted",
      events: "Not permitted",
      quietHours: "23:00 – 08:00",
      maxOccupancy: 4,
      additionalRules: "Building has noise-sensitive neighbours — please keep volume low after 22:00.",
    },
    services: [
      { id: "s1", name: "Cleaning Service", icon: "🧹", included: "Departure clean", extra: "€35/clean", provider: "Lisbon Clean", contact: "+351 962 444 555" },
      { id: "s2", name: "Grocery Delivery", icon: "🛒", extra: "On request", provider: "Continente Online" },
    ],
    localArea: {
      syncedDescription:
        "Baixa is Lisbon's downtown, a grid of elegant 18th-century streets between the castle and the river, packed with shops, cafés and landmarks.",
      categories: [
        {
          id: "rest",
          label: "Restaurants",
          icon: "🍽",
          items: [
            { id: "re1", name: "Time Out Market", detail: "Food hall", distance: "600 m", note: "Great for groups" },
            { id: "re2", name: "Solar dos Presuntos", detail: "Portuguese", distance: "450 m" },
          ],
        },
        {
          id: "super",
          label: "Supermarkets",
          icon: "🛒",
          items: [{ id: "su1", name: "Pingo Doce Baixa", distance: "200 m" }],
        },
        {
          id: "health",
          label: "Hospital / Pharmacy",
          icon: "🏥",
          items: [{ id: "h1", name: "Farmácia Estácio", distance: "150 m", contact: "+351 213 211 390" }],
        },
        {
          id: "act",
          label: "Activities",
          icon: "🎭",
          items: [{ id: "a1", name: "Santa Justa Lift", note: "Iconic viewpoint, 5 min walk" }],
        },
      ],
    },
    photos: [
      { id: "ph1", url: img("photo-1502672260266-1c1ef2d93688"), caption: "Living area", source: "synced" },
      { id: "ph2", url: img("photo-1560185007-cde436f6a4d0"), caption: "Bedroom", source: "synced" },
      { id: "ph3", url: img("photo-1556909114-f6e7ad7d3136"), caption: "Balcony", source: "internal" },
    ],
    channels: [
      { channel: "Airbnb", status: "active", listingId: "552211", lastSynced: hoursAgo(5), url: "https://airbnb.com" },
      { channel: "Booking", status: "active", listingId: "334455", lastSynced: hoursAgo(5), url: "https://booking.com" },
      { channel: "VRBO", status: "not-listed" },
      { channel: "Expedia", status: "not-listed" },
    ],
  },
  {
    id: "p3",
    name: "Mountain Cabin",
    type: "cabin",
    syncProvider: "Smily",
    lastSyncedAt: hoursAgo(8),
    city: "Serra da Estrela",
    country: "Portugal",
    fullAddress: "Estrada da Torre, 6260 Manteigas, Portugal",
    size: "140 m²",
    coordinates: { lat: 40.3811, lng: -7.5378 },
    marketingDescription:
      "A cosy wooden cabin with a fireplace and mountain views, perfect for a winter getaway.",
    fullDescription:
      "Mountain Cabin is a rustic-yet-comfortable retreat in the Serra da Estrela natural park. Wrap up by the wood-burning fireplace after a day on the trails or slopes.\n\nThree bedrooms, a fully equipped kitchen and a hot tub on the deck make it ideal for families and groups of friends.",
    keyFeatures: ["Mountain View", "Fireplace", "Hot Tub", "Pet Friendly"],
    externalIds: [{ channel: "Airbnb", id: "AB-998877" }],
    owner: { name: "Carlos Mendes", contact: "+351 938 111 000", notes: "Owner lives nearby, can help with firewood." },
    coverImage: img("photo-1449158743715-0a90ebb6d2d8"),
    arrival: {
      checkInTime: "15:00",
      accessMethod: "Presencial",
      arrivalInstructions:
        "The owner or manager will meet you at the cabin to hand over the keys and show you the fireplace and hot tub.",
      checkOutTime: "10:00",
      checkOutInstructions: "Extinguish the fireplace fully and leave keys on the kitchen table.",
      directions:
        "From Manteigas, follow the Estrada da Torre uphill for 6 km. The cabin is signposted on the left.",
      publicTransport: "No public transport nearby — a car is essential.",
      parking: { available: true, type: "Private", cost: "Free", notes: "Off-road parking for 3 cars." },
      localContacts: {
        emergency: { name: "Carlos Mendes", phone: "+351 938 111 000", role: "Owner" },
        cleaning: { name: "Serra Limpa", phone: "+351 939 555 444", role: "Cleaning" },
      },
    },
    accommodation: {
      maxGuests: 6,
      bedrooms: 3,
      beds: "2 double, 2 single",
      bathrooms: "2 (1 with bathtub, 1 with shower)",
      rooms: [
        { id: "r1", name: "Master Bedroom", bed: "Double", ensuite: true, notes: "Mountain view" },
        { id: "r2", name: "Loft Room", bed: "Double", ensuite: false, notes: "Sloped ceilings" },
        { id: "r3", name: "Kids Room", bed: "2 Single beds", ensuite: false },
      ],
      commonAreas: [
        { id: "c1", name: "Living Room", note: "Wood-burning fireplace" },
        { id: "c2", name: "Kitchen", note: "Fully equipped" },
        { id: "c3", name: "Deck", note: "Hot tub with mountain view" },
      ],
    },
    amenities: standardAmenities({ Pool: false, "Air Conditioning": false, Balcony: false, Elevator: false }),
    rules: {
      pets: "Allowed",
      petsFee: "Free",
      smoking: "Outdoor only",
      events: "On request",
      quietHours: "22:00 – 08:00",
      maxOccupancy: 6,
      additionalRules: "Please use the fireplace responsibly. Firewood provided for the first night.",
    },
    services: [
      { id: "s1", name: "Cleaning Service", icon: "🧹", included: "Departure clean", extra: "€45/clean", provider: "Serra Limpa", contact: "+351 939 555 444" },
      { id: "s2", name: "Firewood Delivery", icon: "🪵", extra: "€15/bundle", provider: "Local" },
    ],
    localArea: {
      syncedDescription:
        "Serra da Estrela is mainland Portugal's highest mountain range, offering hiking, skiing in winter, and famous cheese and sausages.",
      categories: [
        {
          id: "rest",
          label: "Restaurants",
          icon: "🍽",
          items: [{ id: "re1", name: "Restaurante Cerro da Correia", detail: "Mountain cuisine", distance: "6 km", note: "Try the local cheese" }],
        },
        {
          id: "super",
          label: "Supermarkets",
          icon: "🛒",
          items: [{ id: "su1", name: "Mini-mercado Manteigas", distance: "6 km" }],
        },
        {
          id: "health",
          label: "Hospital / Pharmacy",
          icon: "🏥",
          items: [{ id: "h1", name: "Centro de Saúde de Manteigas", distance: "6 km", contact: "+351 275 980 060" }],
        },
        {
          id: "act",
          label: "Activities",
          icon: "🎭",
          items: [
            { id: "a1", name: "Torre (highest point)", note: "Skiing in winter, 12 km" },
            { id: "a2", name: "Poço do Inferno waterfall", note: "Scenic hike, 8 km" },
          ],
        },
      ],
    },
    photos: [
      { id: "ph1", url: img("photo-1449158743715-0a90ebb6d2d8"), caption: "Cabin exterior", source: "synced" },
      { id: "ph2", url: img("photo-1505693416388-ac5ce068fe85"), caption: "Living room & fireplace", source: "synced" },
      { id: "ph3", url: img("photo-1518791841217-8f162f1e1131"), caption: "Hot tub deck", source: "internal" },
    ],
    channels: [
      { channel: "Airbnb", status: "active", listingId: "998877", lastSynced: hoursAgo(8), url: "https://airbnb.com" },
      { channel: "Booking", status: "not-listed" },
      { channel: "VRBO", status: "not-listed" },
      { channel: "Expedia", status: "not-listed" },
    ],
  },
];
