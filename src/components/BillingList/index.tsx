import { useEffect, useState } from "react"
import { useScreenState } from "@/global/useScreenState"
import { BillingTicket } from "./BillingTicket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Ticket } from "@/types/types"
import { EmptyBillingQueue } from "./EmptyBillingQueue"

export const BillingList: React.FC = () => {
  const { tickets } = useScreenState()
  const [pendingTickets, setPendingTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const filtered = tickets.filter(
      (ticket) => ticket.status === "pending" || ticket.status === "billing"
    )
    const sorted = filtered.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    setPendingTickets(sorted)
  }, [tickets])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground py-4">
        <CardTitle className="text-center text-xl font-bold">
          Esperando Facturación
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-hidden">
        {pendingTickets.length === 0 ? (
          <EmptyBillingQueue />
        ) : (
          <ScrollArea className="h-full pr-4">
            <AnimatePresence>
              {pendingTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BillingTicket ticket={ticket} />
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

