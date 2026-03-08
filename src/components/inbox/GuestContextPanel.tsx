import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar, MapPin, Users, DollarSign, Phone, Mail,
  Clock, CheckCircle, Hash, Building2, Star, Globe, MessageSquare
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface GuestContextPanelProps {
  guest: {
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    totalStays: number;
    totalSpent: number;
    memberSince: string;
    preferredLanguage: string;
    vipStatus: string;
  };
  booking?: {
    reservationCode: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    status: string;
    platform: string;
    totalAmount: number;
    currency: string;
  };
  propertyName?: string;
}

export function GuestContextPanel({ guest, booking, propertyName }: GuestContextPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "current": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "past": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-[360px] shrink-0 border-l border-border bg-muted/20 overflow-y-auto">
      {/* Guest Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            {guest.avatarUrl ? (
              <img src={guest.avatarUrl} alt={guest.name} />
            ) : (
              <div className="bg-primary/10 h-full w-full flex items-center justify-center text-primary text-lg font-semibold">
                {guest.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{guest.name}</h3>
            <p className="text-xs text-muted-foreground">{guest.email}</p>
            {guest.vipStatus !== "none" && (
              <Badge variant="default" className="mt-1 text-[10px] h-4">
                <Star className="h-2.5 w-2.5 mr-0.5" />
                {guest.vipStatus.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{guest.email}</span>
            </div>
            {guest.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{guest.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{guest.preferredLanguage === "en" ? "English" : guest.preferredLanguage}</span>
            </div>
          </CardContent>
        </Card>

        {/* Guest Stats */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Guest History</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <div className="text-lg font-semibold text-foreground">{guest.totalStays}</div>
                <div className="text-[10px] text-muted-foreground">Total Stays</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-md">
                <div className="text-lg font-semibold text-foreground">${guest.totalSpent.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Total Spent</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Member since {guest.memberSince}
            </div>
          </CardContent>
        </Card>

        {/* Active Booking */}
        {booking && (
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Booking</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">{booking.reservationCode}</span>
                <Badge className={`text-[10px] ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{booking.propertyName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {format(parseISO(booking.checkIn), "MMM d")} – {format(parseISO(booking.checkOut), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">
                    {booking.currency} {booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                via {booking.platform}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Property */}
        {propertyName && (
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Property</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{propertyName}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
