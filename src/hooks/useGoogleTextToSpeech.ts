import { useState, useCallback, useRef, useEffect } from 'react';

interface TextToSpeechOptions {
  languageCode?: string;
  name?: string;
  ssmlGender?: 'NEUTRAL' | 'MALE' | 'FEMALE';
}

interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export function useGoogleTextToSpeech() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silentAudioRef = useRef<HTMLAudioElement | null>(null);

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (!silentAudioRef.current) {
      silentAudioRef.current = new Audio();
      silentAudioRef.current.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      silentAudioRef.current.loop = true;
      silentAudioRef.current.play().catch(error => console.error('Silent audio play failed:', error));
    }
  }, []);

  useEffect(() => {
    initializeAudio();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (silentAudioRef.current) {
        silentAudioRef.current.pause();
        silentAudioRef.current.src = '';
      }
    };
  }, [initializeAudio]);

  const speak = useCallback(async (text: string, options?: SpeechOptions, ttsOptions?: TextToSpeechOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          languageCode: ttsOptions?.languageCode || 'es-ES',
          name: ttsOptions?.name || 'es-ES-Standard-A',
          ssmlGender: ttsOptions?.ssmlGender || 'FEMALE',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate speech');
      }

      const audioContent = await response.arrayBuffer();
      
      if (!audioContextRef.current) {
        throw new Error('AudioContext not available');
      }

      const context = audioContextRef.current;
      
      options?.onStart?.();

      const audioBuffer = await context.decodeAudioData(audioContent);
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      
      source.onended = () => {
        options?.onEnd?.();
        setLoading(false);
      };

      source.start(0);
    } catch (err) {
      console.error('Error in text-to-speech:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      options?.onError?.(error);
      setLoading(false);
    }
  }, []);

  return { speak, loading, error };
}

