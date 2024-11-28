import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types/types';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

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
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const [speechDuration, setSpeechDuration] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        speechSynthesis.current = window.speechSynthesis;
      }
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playChime = () => {
    if (audioContext.current) {
      audioContext.current.resume().then(() => {
        const oscillator = audioContext.current!.createOscillator();
        const gainNode = audioContext.current!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.current!.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.current!.currentTime); // A5
        oscillator.frequency.setValueAtTime(1318.5, audioContext.current!.currentTime + 0.1); // E6
        oscillator.frequency.setValueAtTime(1760, audioContext.current!.currentTime + 0.2); // A6

        gainNode.gain.setValueAtTime(0, audioContext.current!.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.current!.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.current!.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.current!.currentTime + 0.5);
      });
    }
  };

  const speakWithPause = (text: string, ticketCode: string) => {
    if (speechSynthesis.current) {
      const parts = [
        { text: `Atención. Ticket número ${ticketCode}.`, pause: 1000 },
        { text: `Repito, ${ticketCode}.`, pause: 500 },
        { text: text, pause: 0 }
      ];

      let totalDuration = 0;
      parts.forEach(part => {
        const utterance = new SpeechSynthesisUtterance(part.text);
        totalDuration += utterance.text.length * 50 + part.pause; // Estimate 50ms per character
      });

      setSpeechDuration(totalDuration);

      let totalDelay = 0;
      parts.forEach((part, index) => {
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(part.text);
          utterance.lang = 'es-MX';
          
          const voices = speechSynthesis.current!.getVoices();
          const spanishFemaleVoice = voices.find(voice => 
            voice.lang.startsWith('es-MX') && voice.name.includes('female')
          );
          
          if (spanishFemaleVoice) {
            utterance.voice = spanishFemaleVoice;
          }

          utterance.rate = 1.0;
          utterance.pitch = 0.9;

          if (index === 0) utterance.onstart = () => setIsSpeaking(true);
          if (index === parts.length - 1) utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);

          speechSynthesis.current!.speak(utterance);
        }, totalDelay);

        totalDelay += part.pause;
      });
    }
  };

  useEffect(() => {
    if (isVisible && notification && speechSynthesis.current) {
      playChime();
      const text = `${notification.ticket.patientName}, por favor diríjase a ${notification.service ? notification.service.name : notification.billingPosition?.name}.`;
      speakWithPause(text, notification.ticket.ticketCode);
    }

    return () => {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [isVisible, notification]);

  useEffect(() => {
    if (isVisible && speechDuration > 0) {
      const timer = setTimeout(() => {
        onNotificationComplete();
      }, speechDuration + 2000); // Add 2 seconds buffer

      return () => clearTimeout(timer);
    }
  }, [isVisible, speechDuration, onNotificationComplete]);

  const toggleSpeech = () => {
    if (speechSynthesis.current) {
      if (isSpeaking) {
        speechSynthesis.current.cancel();
        setIsSpeaking(false);
      } else if (notification) {
        playChime();
        const text = `${notification.ticket.patientName}, por favor diríjase a ${notification.service ? notification.service.name : notification.billingPosition?.name}.`;
        speakWithPause(text, notification.ticket.ticketCode);
      }
    }
  };

  if (!notification) return null;

  return (
    <AnimatePresence onExitComplete={onExited}>
      {isVisible && (
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
              

              <button
                onClick={toggleSpeech}
                className="mt-4 p-2 absolute bottom-1 right-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200"
                aria-label={isSpeaking ? "Detener audio" : "Reproducir audio"}
              >
                {isSpeaking ? (
                  <VolumeX size={24} className="text-white" />
                ) : (
                  <Volume2 size={24} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

