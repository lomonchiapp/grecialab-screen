import { Ticket } from "@/types/types";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface QueueItemProps {
  ticket: Ticket;
  index: number;
}

export const QueueItem = ({ ticket, index }: QueueItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full bg-secondary hover:bg-primary/10 transition-colors duration-300 border border-primary/20">
        <CardContent className="p-1 flex items-center justify-center h-full">
          <motion.span 
            className="text-md font-bold"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {ticket.ticketCode}
          </motion.span>
        </CardContent>
      </Card>
    </motion.div>
  );
};

