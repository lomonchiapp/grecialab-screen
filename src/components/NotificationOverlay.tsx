import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types/types';
import { ArrowRight, Repeat } from 'lucide-react';

interface NotificationOverlayProps {
  notification: Notification | null;
  isVisible: boolean;
  onNotificationComplete: () => void;
  onExited: () => void;
}

export const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ 
  notification, 
  isVisible, 
  onNotificationComplete,
  onExited
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastNotification = useRef<Notification | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playChime = useCallback(() => {
    const context = initAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5
    oscillator.frequency.setValueAtTime(1318.5, context.currentTime + 0.1); // E6
    oscillator.frequency.setValueAtTime(1760, context.currentTime + 0.2); // A6

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.5);

    return new Promise<void>((resolve) => {
      setTimeout(resolve, 500);
    });
  }, [initAudioContext]);

  const speakText = useCallback((text: string) => {
    const context = initAudioContext();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Create a MediaStreamDestination to capture the speech audio
    const destination = context.createMediaStreamDestination();

    // Create an HTMLAudioElement to play the captured audio
    const audio = new Audio();
    audio.srcObject = destination.stream;

    utterance.onstart = () => {
      setIsSpeaking(true);
      audio.play();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      audio.pause();
      onNotificationComplete();
    };

    // Use the Web Speech API to generate speech
    window.speechSynthesis.speak(utterance);

    // Connect the speech to the AudioContext
    const source = context.createMediaStreamSource(destination.stream);
    source.connect(context.destination);

  }, [initAudioContext, onNotificationComplete]);

  const playNotification = useCallback(async (notif: Notification) => {
    try {
      await playChime();
      const text = `Atención. Número de ticket ${notif.ticket.ticketCode}. ${notif.ticket.patientName}, por favor diríjase a ${notif.service ? notif.service.name : notif.billingPosition?.name}`;
      speakText(text);
    } catch (error) {
      console.error('Error playing notification:', error);
    }
    lastNotification.current = notif;
  }, [playChime, speakText]);

  useEffect(() => {
    if (isVisible && notification) {
      playNotification(notification);
    }
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [isVisible, notification, playNotification]);

  const repeatLastNotification = useCallback(() => {
    if (lastNotification.current && !isSpeaking) {
      playNotification(lastNotification.current);
    }
  }, [isSpeaking, playNotification]);

  if (!notification && !lastNotification.current) return null;

  return (
    <>
      <AnimatePresence onExitComplete={onExited}>
        {isVisible && notification && (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.19, 1.0, 0.22, 1.0],
              scale: { type: "spring", stiffness: 200, damping: 20 }
            }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
              animate={{
                background: [
                  'linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e40af)',
                  'linear-gradient(to bottom right, #1d4ed8, #1e40af, #1e3a8a)',
                  'linear-gradient(to bottom right, #1e40af, #1e3a8a, #172554)',
                  'linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e40af)',
                ],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative w-full max-w-4xl bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-2xl overflow-hidden p-8">
              <div className="flex flex-col items-center justify-center space-y-6">
                <motion.h2 
                  className="text-5xl md:text-6xl font-bold text-white text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ¡Atención!
                </motion.h2>
                
                <motion.div 
                  className="text-6xl md:text-7xl font-bold text-white"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {notification.ticket.ticketCode}
                </motion.div>
                
                <motion.p 
                  className="text-3xl md:text-4xl text-blue-200 text-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {notification.ticket.patientName}
                </motion.p>
                
                <div className="flex items-center justify-center text-2xl md:text-3xl text-white space-x-4">
                  <span>Por favor, diríjase a</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <ArrowRight className="text-blue-300" size={36} />
                  </motion.div>
                  <span className="font-bold text-blue-300">
                    {notification.service
                      ? notification.service.name
                      : notification.billingPosition?.name}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={repeatLastNotification}
          className="p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200"
          aria-label="Repetir última notificación"
          disabled={isSpeaking}
        >
          <Repeat size={24} />
        </button>
      </div>
    </>
  );
};

