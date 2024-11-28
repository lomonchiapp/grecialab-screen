import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechOptions {
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
  onInterrupted?: () => void;
}

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.current!.getVoices();
        setVoices(availableVoices);
      };

      speechSynthesis.current.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  const getLatinVoice = useCallback(() => {
    const latinVoices = voices.filter(voice => 
      voice.lang.startsWith('es') || voice.lang.startsWith('pt') || voice.lang.startsWith('it')
    );
    
    // Prefer Spanish voices, then Portuguese, then Italian
    const preferredVoice = latinVoices.find(voice => voice.lang.startsWith('es')) ||
                           latinVoices.find(voice => voice.lang.startsWith('pt')) ||
                           latinVoices.find(voice => voice.lang.startsWith('it'));
    
    return preferredVoice || voices.find(voice => voice.lang.startsWith('es'));
  }, [voices]);

  const preprocessText = (text: string): string => {
    // Add appropriate punctuation and pacing
    text = text.replace(/(\d+)/g, '$1. '); // Add pause after numbers
    text = text.replace(/([.!?])(\s|$)/g, '$1. '); // Ensure proper sentence breaks
    return text;
  };

  const speak = useCallback((text: string, options?: SpeechOptions) => {
    if (speechSynthesis.current) {
      cancel();

      const processedText = preprocessText(text);
      const sentences = processedText.match(/[^.!?]+[.!?]+/g) || [processedText];

      sentences.forEach((sentence, index) => {
        const utterance = new SpeechSynthesisUtterance(sentence);
        const latinVoice = getLatinVoice();
        
        if (latinVoice) {
          utterance.voice = latinVoice;
          utterance.lang = latinVoice.lang;
        } else {
          console.warn('No suitable Latin voice found. Using default voice.');
          utterance.lang = 'es-ES'; // Fallback to Spanish
        }

        // Dynamic rate and pitch for more natural-sounding speech
        utterance.rate = 0.9 + (Math.random() * 0.2 - 0.1); // 0.8 to 1.0
        utterance.pitch = 1.0 + (Math.random() * 0.2 - 0.1); // 0.9 to 1.1

        if (index === 0) utterance.onstart = () => setSpeaking(true);
        if (index === sentences.length - 1) {
          utterance.onend = () => {
            setSpeaking(false);
            options?.onEnd?.();
          };
        }
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setSpeaking(false);
          if (event.error === 'interrupted') {
            options?.onInterrupted?.();
          } else {
            options?.onError?.(event);
          }
        };

        currentUtterance.current = utterance;
        speechSynthesis.current!.speak(utterance);
      });
    } else {
      console.error('Speech synthesis not available');
    }
  }, [getLatinVoice]);

  const cancel = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setSpeaking(false);
      currentUtterance.current = null;
    }
  }, []);

  return { speak, cancel, speaking };
}

