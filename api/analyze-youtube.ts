import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not set or is using placeholder");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze this YouTube video URL: ${url}. 
      Suggest music tags based on its content (genre, intro, moods, ekspresi, vocals, tempo).
      Return the result as a JSON object with keys: genre, intro, moods, ekspresi, vocals, tempo.
      Each key should have an array of strings.
      Only use the following options:
      genre: ['Pop', 'Indie', 'EDM', 'Dangdut', 'Lo-fi', 'Rock', 'Hip Hop', 'Orchestral', 'Trap', 'Dubstep', 'Fusion', '808 Bass', 'Future Bass', 'Afrobeats', 'Bassoon', 'TR-909', 'Megah', 'Pad', 'Synthesizer', 'Subito/Surprise', 'Bass Hits', 'Bass Kejut'],
      intro: ['Slow piano', 'Viral TikTok intro', 'Beat drop', 'Ambient pad', 'Cinematic opening', 'Phonk cowbell', 'Glitchy vocal chop', 'Lo-fi vinyl crackle', 'Bass-boosted riser', 'Sped-up chipmunk vocal', 'Minimalist trap hi-hats', 'Retro synthwave arpeggio', 'ASMR whisper start'],
      moods: ['Sad', 'Happy', 'Broken', 'Romantic', 'Chill', 'Energetic', 'Dark', 'Dreamy', 'Epik', 'Melankolis', 'Membangkitkan Semangat', 'Agresif', 'Bermimpi', 'Gelap', 'Enerjik', 'Sinematik', 'Santai', 'Menyeramkan', 'Nostalgia', 'Penuh Harapan', 'Marah', 'Tenang', 'Misterius', 'Ethereal', 'Trippy', 'AnehLounge', 'Megah', 'Itens', 'Peaceful', 'Seksi', 'Heroik', 'Gotik', 'Cemas', 'Psikedelik', 'Minimalis', 'Sensual', 'Canggih', 'Epic / Dramatic Instrumental', 'Modern Classical'],
      ekspresi: ['Emotional', 'Powerful', 'Soft', 'Whisper', 'Aggressive', 'Melancholic', 'Appassionato (Penuh Gairah)', 'Dolce (Manis & Lembut)', 'Lacrimoso (Penuh Air Mata)', 'Con Fuoco (Berapi-api)', 'Cantabile (Seperti Menyanyi)', 'Maestoso (Agung/Mulia)', 'Espressivo (Ekspresif)', 'Agitato (Gelisah/Cepat)', 'Sotto Voce (Berbisik)', 'Grave (Serius & Berat)', 'Leggiero (Ringan & Halus)', 'Doloroso (Pedih/Sedih)', 'Furioso (Sangat Marah)', 'Amoroso (Penuh Kasih)', 'Misterioso (Misterius)', 'Manja'],
      vocals: ['Male', 'Female', 'Duo', 'Choir', 'Auto-tune', 'Robotic', 'Indie voice', 'Helium', 'Anak-anak', 'Effect Glitch', 'Effect FX', 'Manja', 'Sensual', 'Berbisik', 'Berbicara', 'Menyanyi'],
      tempo: ['40-60 BPM', '60-80 BPM', '80-100 BPM', '100-120 BPM', 'Cepat (140+ BPM)', 'Sangat Cepat (180+ BPM)', 'Adagio (Sangat Lambat)', 'Andante (Kecepatan Jalan)', 'Moderato (Sedang)', 'Allegro (Cepat & Ceria)', 'Presto (Sangat Cepat)', 'Accelerando (Semakin Cepat)', 'Rubato (Tempo Ekspresif)', 'Staccato (Terputus-putus)', 'Legato (Mengalir)'],
      `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const text = result.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      res.status(200).json(JSON.parse(jsonMatch[0]));
    } else {
      res.status(500).json({ error: "Failed to parse analysis" });
    }
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Analysis failed" });
  }
}
