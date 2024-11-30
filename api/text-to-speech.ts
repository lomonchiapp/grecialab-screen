import { VercelRequest, VercelResponse } from '@vercel/node';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
});

interface TTSRequest {
  text: string;
  languageCode: string;
  name: string;
  ssmlGender: 'NEUTRAL' | 'MALE' | 'FEMALE';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Received request:', req.body);

    const { text, languageCode, name, ssmlGender } = req.body as TTSRequest;

    if (!text || !languageCode || !name || !ssmlGender) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Calling Google TTS API with params:', { text, languageCode, name, ssmlGender });

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name, ssmlGender },
      audioConfig: { audioEncoding: 'MP3' },
    });

    console.log('Received response from Google TTS API');

    const audioContent = response.audioContent;

    if (!audioContent) {
      throw new Error('No audio content received from Google TTS');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioContent));
  } catch (error) {
    console.error('Error in text-to-speech API:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech', 
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}

