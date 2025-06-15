
import { Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ExtendedContact } from "@/hooks/useContacts";

interface ContactDetailsProps {
  contact: ExtendedContact;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  return (
    <div className="mt-3 pl-12 pr-2 pb-2">
      {contact.preferences && (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Preferences</h4>
          <p className="text-sm">{contact.preferences}</p>
        </div>
      )}
      
      {contact.previousStays.length > 0 ? (
        <div className="mb-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Previous Stays</h4>
          {contact.previousStays.map((stay, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(stay.date), "MMM d, yyyy")}</span>
              </Badge>
              <span>{stay.propertyName}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground mb-3">No previous stays</div>
      )}
      
      {contact.notes && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Notes</h4>
          <Textarea 
            className="min-h-[80px] text-sm"
            value={contact.notes}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
