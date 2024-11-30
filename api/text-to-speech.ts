import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { text, languageCode, name, ssmlGender } = req.body;

      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: { languageCode, name, ssmlGender },
        audioConfig: { audioEncoding: 'MP3' },
      });

      const audioContent = response.audioContent;

      if (!audioContent) {
        throw new Error('No audio content received from Google TTS');
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioContent));
    } catch (error) {
      console.error('Error in text-to-speech API:', error);
      res.status(500).json({ error: 'Failed to generate speech' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

