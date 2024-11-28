import { Ticket } from "@/types/types"
import { Timestamp } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Clock, Receipt } from 'lucide-react'
import { cn } from "@/lib/utils"

export const BillingTicket = ({ ticket }: { ticket: Ticket }) => {
  const timeSince = (date: Timestamp | string | Date) => {
    const now = new Date()
    const past = date instanceof Timestamp ? date.toDate() : new Date(date)
    const diff = now.getTime() - past.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    return `${minutes}m`
  }

  return (
    <Card className={cn(
      "relative transition-all hover:shadow-md overflow-hidden mb-4 bg-white last:mb-3",
      ticket.status === "billing" && "bg-blue-50 border-blue-200"
    )}>
      <div className="p-3 space-y-1">
        <div className="flex justify-between items-center">
          <span className={cn(
            "text-4xl font-bold text-primary rounded-xl",
            ticket.status === "billing" && "text-6xl"
          )}>
            {ticket.ticketCode}
          </span>
          {ticket.status === "billing" && (
            <Badge variant="outline" className="font-semibold absolute right-0 bottom-10 whitespace-nowrap">
              <Receipt className="mr-1 h-3 w-3" />
              Facturando
            </Badge>
          )}
        </div>

        {ticket.patientName && (
          <p className="text-lg font-medium text-gray-700">
            {ticket.patientName}
          </p>
        )}

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            hace {timeSince(ticket.createdAt)}
          </div>
          {ticket.status === "billing" && ticket.billingPosition?.name && (
            <Badge variant="outline" className="border-green-500 text-green-700">
              {ticket.billingPosition.name}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  )
}

