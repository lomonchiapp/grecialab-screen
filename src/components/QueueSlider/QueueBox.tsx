import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScreenState } from "@/global/useScreenState";
import { QueueItem } from "./QueueItem";
import { Queue, Ticket } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const QueueBox = ({ queue }: { queue: Queue }) => {
  const { tickets, subscribeToTickets, services } = useScreenState();
  const [ticketsInQueue, setTicketsInQueue] = useState<Ticket[]>([]);
  const [ticketInProcess, setTicketInProcess] = useState<Ticket | null>(null);
  const [nextTicket, setNextTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToTickets();
    return () => unsubscribe();
  }, [subscribeToTickets]);

  useEffect(() => {
    const inQueue = tickets.filter(ticket =>
      ticket.status === "inQueue" &&
      ticket.services.some(service =>
        service.id === queue.serviceId && service.status !== "finished"
      )
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const processing = tickets.find(ticket =>
      ticket.queues?.some(queueItem =>
        queueItem.serviceId === queue.serviceId &&
        ticket.services?.some(service =>
          service.status === "processing" && service.id === queueItem.serviceId
        )
      )
    ) || null;

    setTicketInProcess(processing);
    
    if (inQueue.length > 0) {
      setNextTicket(inQueue[0]);
      setTicketsInQueue(inQueue.slice(1));
    } else {
      setNextTicket(null);
      setTicketsInQueue([]);
    }
  }, [tickets, queue.serviceId]);

  const serviceName = (serviceId: string) => {
    const service = services.find((service) => service.id === serviceId);
    return service ? service.name : "Servicio desconocido";
  };

  const totalTickets = ticketsInQueue.length + (nextTicket ? 1 : 0) + (ticketInProcess ? 1 : 0);

  if (totalTickets === 0) {
    return null;
  }

  return (
    <Card className="h-[300px] flex flex-col bg-card shadow-lg transition-all duration-300">
      <CardHeader className="bg-primary text-primary-foreground py-2 rounded-t-lg">
        <CardTitle className="text-sm font-bold flex justify-between items-center">
          <span className="truncate">{serviceName(queue.serviceId)}</span>
          <Badge variant="secondary" className="ml-2 text-xs bg-secondary text-secondary-foreground">
            <Users className="w-3 h-3 mr-1" />
            {totalTickets}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={ticketInProcess ? "processing" : "idle"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-2 mb-2"
          >
            <div className={`p-1 rounded-lg text-center ${ticketInProcess ? "bg-green-700 dark:bg-green-900" : "bg-muted"}`}>
              <Badge variant="secondary" className="text-xs mb-1">
                {ticketInProcess ? "Atendiendo" : "Libre"}
              </Badge>
              {ticketInProcess && (
                <div className="text-2xl font-bold text-white dark:text-green-300">
                  {ticketInProcess.ticketCode}
                </div>
              )}
            </div>
            {nextTicket && (
              <div className="bg-gray-600 dark:bg-blue-900 p-1 rounded-lg text-center">
                <Badge variant="secondary" className="text-xs mb-1">Siguiente</Badge>
                <div className="text-2xl font-bold text-white dark:text-blue-300">
                  {nextTicket.ticketCode}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex-grow overflow-hidden">
          <Carousel className="w-full h-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="h-full">
              {Array.from({ length: Math.ceil(ticketsInQueue.length / 6) }).map((_, index) => (
                <CarouselItem key={index} className="h-full basis-full">
                  <div className="grid grid-cols-3 gap-1 h-full">
                    {ticketsInQueue.slice(index * 6, (index + 1) * 6).map((ticket, ticketIndex) => (
                      <QueueItem key={ticket.id} ticket={ticket} index={ticketIndex} />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {ticketsInQueue.length > 6 && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};

