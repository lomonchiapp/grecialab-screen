import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types/types';
import { ArrowRight, Repeat } from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

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
  const audioContext = useRef<AudioContext | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const lastNotification = useRef<Notification | null>(null);

  const { speak, cancel } = useSpeechSynthesis(audioContext);

  const initializeAudioContext = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext.current.state === 'suspended' ? audioContext.current.resume() : Promise.resolve();
  }, []);

  const playChime = useCallback(async () => {
    try {
      await initializeAudioContext();
      if (audioContext.current) {
        const oscillator = audioContext.current.createOscillator();
        const gainNode = audioContext.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.current.currentTime); // A5
        oscillator.frequency.setValueAtTime(1318.5, audioContext.current.currentTime + 0.1); // E6
        oscillator.frequency.setValueAtTime(1760, audioContext.current.currentTime + 0.2); // A6

        gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.current.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.current.currentTime + 0.5);
      }
    } catch (error) {
      console.error('Error playing chime:', error);
    }
  }, [initializeAudioContext]);

  const speakWithPause = useCallback((text: string, ticketCode: string) => {
    const parts = [
      { text: `Atención. Número de ticket ${ticketCode},`, pause: 1000 },
      { text: `Repito, ${ticketCode},`, pause: 300 },
      { text: text, pause: 0 }
    ];

    const speakPart = (index: number) => {
      if (index >= parts.length) {
        setIsSpeaking(false);
        retryCount.current = 0;
        onNotificationComplete();
        return;
      }

      const part = parts[index];
      speak(part.text, {
        onStart: () => {
          if (index === 0) setIsSpeaking(true);
        },
        onEnd: () => {
          if (index === parts.length - 1) {
            setIsSpeaking(false);
            retryCount.current = 0;
            onNotificationComplete();
          } else {
            setTimeout(() => speakPart(index + 1), part.pause);
          }
        },
        onError: (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
          onNotificationComplete();
        },
        onInterrupted: () => {
          if (retryCount.current < maxRetries) {
            retryCount.current++;
            console.log(`Speech interrupted. Retrying... (Attempt ${retryCount.current})`);
            setTimeout(() => speakPart(index), 1000);
          } else {
            console.error('Max retries reached. Stopping speech synthesis.');
            setIsSpeaking(false);
            retryCount.current = 0;
            onNotificationComplete();
          }
        }
      });
    };

    speakPart(0);
  }, [speak, onNotificationComplete]);

  const playNotification = useCallback(async (notif: Notification) => {
    await playChime();
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms pause
    const text = `${notif.ticket.patientName}, por favor diríjase a ${notif.service ? notif.service.name : notif.billingPosition?.name}`;
    speakWithPause(text, notif.ticket.ticketCode);
    lastNotification.current = notif;
  }, [playChime, speakWithPause]);

  useEffect(() => {
    if (isVisible && notification) {
      playNotification(notification);
    }
    return () => {
      cancel();
      setIsSpeaking(false);
    };
  }, [isVisible, notification, playNotification, cancel]);

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

