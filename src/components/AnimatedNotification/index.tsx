import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types/types';
import { ChevronRightIcon as CaretRight } from 'lucide-react';
import { useScreenState } from '@/global/useScreenState';

interface AnimatedNotificationProps {
  notification: Notification | null;
  isVisible: boolean;
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({ notification, isVisible }) => {
  if (!notification) return null;
  const { tickets } = useScreenState();

  const ticket = tickets.find(ticket => ticket.id === notification.ticketId);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.5 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl p-6 flex items-center space-x-4 w-4/5 max-w-3xl"
        >
          <div className="bg-primary rounded-lg p-4 text-white">
            <p className="text-sm">Ticket #</p>
            <p className="text-3xl font-bold">{ticket?.ticketCode}</p>
            <p className="text-sm mt-2">{ticket?.patientName}</p>
          </div>
          
          <motion.div 
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <img src="/walking.png" alt="walking" className="w-16 h-auto" />
          </motion.div>

          <div className="flex items-center space-x-2">
            <CaretRight size={40} className="text-primary" />
            <CaretRight size={35} className="text-secondary" />
          </div>

          <div className="bg-secondary rounded-lg p-4 text-white flex-grow">
            <p className="text-sm">
              {notification.service ? "A puesto de servicio" : "A puesto de facturación"}
            </p>
            <p className="text-2xl font-bold mt-2">
              {notification.service
                ? notification.service.name
                : ticket?.billingPosition?.name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

