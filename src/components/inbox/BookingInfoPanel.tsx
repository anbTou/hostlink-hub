
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Phone, 
  Mail, 
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Hash,
  Building2
} from 'lucide-react';
import { Booking, Guest } from '@/types/inbox';
import { format, parseISO } from 'date-fns';

interface BookingInfoPanelProps {
  booking: Booking | null;
  guest: Guest;
  onViewFullBooking?: () => void;
}

export function BookingInfoPanel({ booking, guest, onViewFullBooking }: BookingInfoPanelProps) {
  if (!booking) {
    return (
      <div className="w-80 border-l border-border bg-muted/20 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Booking Information</h3>
        </div>
        <div className="text-center text-muted-foreground py-8">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No booking information available for this conversation.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'past': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <CheckCircle className="h-3 w-3" />;
      case 'upcoming': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <AlertCircle className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  return (
    <div className="w-80 border-l border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-medium">Booking Details</h3>
        </div>
        {onViewFullBooking && (
          <Button variant="ghost" size="sm" onClick={onViewFullBooking}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Booking Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Booking Status</span>
            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
              {getStatusIcon(booking.status)}
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Booking ID: {booking.id}
          </div>
        </CardContent>
      </Card>

      {/* Stay Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Stay Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-in:</span>
              <span className="font-medium">
                {format(parseISO(booking.checkIn), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Check-out:</span>
              <span className="font-medium">
                {format(parseISO(booking.checkOut), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nights:</span>
              <span className="font-medium">
                {Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Reservation Code:
              </span>
              <span className="font-medium font-mono text-xs">
                {booking.reservationCode}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Origin:
              </span>
              <Badge variant="outline" className="text-xs capitalize">
                {booking.platform}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Property
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm font-medium">Property ID: {booking.propertyId}</div>
        </CardContent>
      </Card>

      {/* Guest Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guest Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm">
              <div className="font-medium">{guest.name}</div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {guest.email}
              </div>
              {guest.phone && (
                <div className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {guest.phone}
                </div>
              )}
            </div>
            <Separator />
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Stays:</span>
                <span className="font-medium">{guest.totalStays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VIP Status:</span>
                <Badge variant={guest.vipStatus === 'none' ? 'outline' : 'default'} className="text-xs">
                  {guest.vipStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Booking Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-semibold text-lg">
              {booking.currency} {booking.totalAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
