/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

const options = {
  genre: ['Pop', 'Indie', 'EDM', 'Dangdut', 'Lo-fi', 'Rock', 'Hip Hop', 'Orchestral', 'Trap', 'Dubstep', 'Fusion', '808 Bass', 'Future Bass', 'Afrobeats', 'Bassoon', 'TR-909', 'Megah', 'Pad', 'Synthesizer', 'Subito/Surprise', 'Bass Hits', 'Bass Kejut'],
  intro: ['Slow piano', 'Viral TikTok intro', 'Beat drop', 'Ambient pad', 'Cinematic opening', 'Phonk cowbell', 'Glitchy vocal chop', 'Lo-fi vinyl crackle', 'Bass-boosted riser', 'Sped-up chipmunk vocal', 'Minimalist trap hi-hats', 'Retro synthwave arpeggio', 'ASMR whisper start'],
  moods: ['Sad', 'Happy', 'Broken', 'Romantic', 'Chill', 'Energetic', 'Dark', 'Dreamy', 'Epik', 'Melankolis', 'Membangkitkan Semangat', 'Agresif', 'Bermimpi', 'Gelap', 'Enerjik', 'Sinematik', 'Santai', 'Menyeramkan', 'Nostalgia', 'Penuh Harapan', 'Marah', 'Tenang', 'Misterius', 'Ethereal', 'Trippy', 'AnehLounge', 'Megah', 'Itens', 'Peaceful', 'Seksi', 'Heroik', 'Gotik', 'Cemas', 'Psikedelik', 'Minimalis', 'Sensual', 'Canggih', 'Epic / Dramatic Instrumental', 'Modern Classical'],
  ekspresi: ['Emotional', 'Powerful', 'Soft', 'Whisper', 'Aggressive', 'Melancholic', 'Appassionato (Penuh Gairah)', 'Dolce (Manis & Lembut)', 'Lacrimoso (Penuh Air Mata)', 'Con Fuoco (Berapi-api)', 'Cantabile (Seperti Menyanyi)', 'Maestoso (Agung/Mulia)', 'Espressivo (Ekspresif)', 'Agitato (Gelisah/Cepat)', 'Sotto Voce (Berbisik)', 'Grave (Serius & Berat)', 'Leggiero (Ringan & Halus)', 'Doloroso (Pedih/Sedih)', 'Furioso (Sangat Marah)', 'Amoroso (Penuh Kasih)', 'Misterioso (Misterius)', 'Manja'],
  vocals: ['Male', 'Female', 'Duo', 'Choir', 'Auto-tune', 'Robotic', 'Indie voice', 'Helium', 'Anak-anak', 'Effect Glitch', 'Effect FX', 'Manja', 'Sensual', 'Berbisik', 'Berbicara', 'Menyanyi'],
  tempo: ['40-60 BPM', '60-80 BPM', '80-100 BPM', '100-120 BPM', 'Cepat (140+ BPM)', 'Sangat Cepat (180+ BPM)', 'Adagio (Sangat Lambat)', 'Andante (Kecepatan Jalan)', 'Moderato (Sedang)', 'Allegro (Cepat & Ceria)', 'Presto (Sangat Cepat)', 'Accelerando (Semakin Cepat)', 'Rubato (Tempo Ekspresif)', 'Staccato (Terputus-putus)', 'Legato (Mengalir)'],
};

export default function App() {
  const [lyrics, setLyrics] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [analysisResult, setAnalysisResult] = useState<Record<string, string[]> | null>(null);
  const [selections, setSelections] = useState<Record<string, string[]>>({
    genre: [], intro: [], moods: [], ekspresi: [], vocals: [], tempo: []
  });
  const [output, setOutput] = useState<{ style: string; lyrics: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const toggleSelection = (category: string, item: string) => {
    setSelections(prev => {
      const current = prev[category];
      return {
        ...prev,
        [category]: current.includes(item) ? current.filter(i => i !== item) : [...current, item]
      };
    });
  };

  const analyzeLink = async () => {
    if (!youtubeLink.trim()) {
      alert('Please enter a YouTube link!');
      return;
    }
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeLink }),
      });
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      const result = await response.json();
      setAnalysisResult(result);
      setSelections(result);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze link.';
      alert(errorMessage);
    } finally {
      setAnalyzing(false);
    }
  };

  const randomize = () => {
    const randomSelections: Record<string, string[]> = {};
    Object.keys(options).forEach(key => {
      const opts = options[key as keyof typeof options];
      randomSelections[key] = [opts[Math.floor(Math.random() * opts.length)]];
    });
    setSelections(randomSelections);
  };

  const generate = () => {
    if (!lyrics.trim()) {
      alert('Please enter lyrics first!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const stylePrompt = `Gen Z TikTok viral music, ${selections.genre.join(', ')}, ${selections.moods.join(', ')}, ${selections.ekspresi.join(', ')}, ${selections.vocals.join(', ')}, tempo ${selections.tempo.join(', ')}, with ${selections.intro.join(', ')}, emotional dynamic, catchy hook, modern production, high quality`;
      
      const instructions = `(${selections.genre.join(', ')}, ${selections.moods.join(', ')}, ${selections.ekspresi.join(', ')}, ${selections.vocals.join(', ')}, ${selections.tempo.join(', ')})`;
      
      let finalLyrics = lyrics;
      // Check if user already provided structure tags like [Intro], [Verse], [Chorus]
      const hasStructure = /\[(Intro|Verse|Chorus|Bridge|Outro|Final)/i.test(lyrics);
      
      if (!hasStructure) {
        finalLyrics = `[Intro]\n${instructions}\n\n[Verse 1]\n${instructions}\n${lyrics}\n\n[Chorus]\n${instructions}\n\n[Verse 2]\n${instructions}\n\n[Bridge]\n${instructions}\n\n[Final Chorus]\n${instructions}`;
      } else {
        // Inject instructions after every [Tag]
        finalLyrics = lyrics.replace(/(\[.*?\])/g, `$1\n${instructions}`);
      }
      
      setOutput({ style: stylePrompt, lyrics: finalLyrics });
      setLoading(false);
    }, 1500);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">VibeGen AI</h1>
        <p className="text-slate-400">TikTok Gen Z AI Music Style and Lyric Generator</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl space-y-4">
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Enter your lyrics here..."
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <div className="flex gap-4">
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Enter YouTube link to analyze..."
              className="flex-grow bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button onClick={analyzeLink} className="px-6 py-3 bg-purple-600 rounded-xl font-bold hover:bg-purple-700 transition">
              {analyzing ? 'Analyzing...' : 'Analisis'}
            </button>
          </div>
          {analysisResult && (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <h3 className="font-bold mb-2">Rekomendasi Pilihan Tag:</h3>
              <p className="text-sm text-slate-400">{JSON.stringify(analysisResult)}</p>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(options).map(([category, items]) => (
            <div key={category} className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
              <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleSelection(category, item)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${selections[category].includes(item) ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="flex gap-4 justify-center">
          <button onClick={randomize} className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full hover:bg-slate-700 transition">
            <RefreshCw size={18} /> Randomize
          </button>
          <button onClick={generate} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
            <Wand2 size={18} /> Generate Style Musik
          </button>
        </div>

        {loading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-purple-400">Generating vibe...</motion.div>}

        {output && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative">
              <h3 className="font-bold mb-2">Style Musik Prompt</h3>
              <textarea readOnly value={output.style} className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm font-mono" />
              <button onClick={() => copy(output.style)} className="absolute top-8 right-8 p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Copy size={16} /></button>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative">
              <h3 className="font-bold mb-2">Lirik Terstruktur</h3>
              <textarea readOnly value={output.lyrics} className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm font-mono" />
              <button onClick={() => copy(output.lyrics)} className="absolute top-8 right-8 p-2 bg-slate-800 rounded-lg hover:bg-slate-700"><Copy size={16} /></button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
