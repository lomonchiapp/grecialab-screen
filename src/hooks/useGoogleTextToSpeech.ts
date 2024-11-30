import { useState, useCallback, MutableRefObject } from 'react';

interface TextToSpeechOptions {
  languageCode?: string;
  name?: string;
  ssmlGender?: 'NEUTRAL' | 'MALE' | 'FEMALE';
}

interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

export function useGoogleTextToSpeech(audioContextRef: MutableRefObject<AudioContext | null>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error('Failed to generate speech');
      }

      const audioContent = await response.arrayBuffer();
      
      if (audioContextRef.current) {
        const context = audioContextRef.current;
        
        if (context.state === 'suspended') {
          await context.resume();
        }

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
      } else {
        throw new Error('AudioContext not available');
      }
    } catch (err) {
      console.error('Error in text-to-speech:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      options?.onError?.(err);
      setLoading(false);
    }
  }, [audioContextRef]);

  return { speak, loading, error };
}
