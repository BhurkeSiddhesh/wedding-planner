import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { marathiUkhaneList } from '../../data/defaultData';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  BookOpen, 
  Heart 
} from 'lucide-react';

export const TraditionsUkhane: React.FC = () => {
  const { profile } = useWedding();
  const [activeCategory, setActiveCategory] = useState<'all' | 'bride' | 'groom' | 'parents'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const filteredUkhane = marathiUkhaneList.filter((u) => {
    if (activeCategory === 'all') return true;
    return u.category === activeCategory;
  });

  const handleCopy = (id: string, text: string) => {
    const customized = text
      .replace(/\.\.\.रावांचे/g, `${profile.groomName}रावांचे`)
      .replace(/\.\.\.चे/g, `${profile.brideName}चे`);

    navigator.clipboard.writeText(customized);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const customized = text
        .replace(/\.\.\.रावांचे/g, `${profile.groomName}रावांचे`)
        .replace(/\.\.\.चे/g, `${profile.brideName}चे`);

      const utterance = new SpeechSynthesisUtterance(customized);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.9;
      
      utterance.onstart = () => setSpeakingId(id);
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const traditions = [
    {
      title: 'अंतरपाट आणि मंगलाष्टके (Antarpat & Mangalashtaka)',
      desc: 'A sacred silk cloth held between Bride & Groom. Upon chanting the final "शुभमंगल सावधान", yellow Akshata is showered, the cloth lowers, and the couple exchanges garlands (Varmala).',
      symbol: '📜',
    },
    {
      title: 'मुंडावळ्या (Mundavalya)',
      desc: 'Ornate pearl strings tied horizontally across the forehead of both bride and groom, symbolizing royalty, grace, and concentration on the sacred vows.',
      symbol: '👑',
    },
    {
      title: 'सप्तपदी व लाजा होम (Saptapadi & Laja Homa)',
      desc: 'The seven sacred vows walked together around the holy Agni. In Laja Homa, the brother of the bride pours puffed rice (Laja) into the couple hands to offer into the sacred fire.',
      symbol: '🔥',
    },
    {
      title: 'कानपिळी (Kaan Pili)',
      desc: 'The bride’s brother playfully twists the groom’s ear to remind him to protect and cherish his sister forever. The groom then presents a silver betel nut or gift.',
      symbol: '👂',
    },
    {
      title: 'सूनमुख (Sunmukh)',
      desc: 'The mother-in-law presents a mirror to the new bride to gaze at her reflection together, welcoming her with a gold ornament and blessing her into the new family.',
      symbol: '🪞',
    },
    {
      title: 'गृहप्रवेश व माप ओलांडणे (Gruhapravesh)',
      desc: 'The bride gently pushes a silver or brass Kalash filled with rice using her right toe at the threshold, stepping inside as the embodiment of Goddess Lakshmi.',
      symbol: '🌾',
    },
  ];

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header Banner - High Density */}
      <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] rounded-xl p-4 sm:p-5 text-[#faecd0] shadow-md border border-[#d4af37]/35">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>महाराष्ट्रीयन विवाह संस्कृती व उखाणे संग्रह</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold font-serif-marathi text-white mt-0.5">
          Marathi Traditions & Interactive Ukhane Hub
        </h2>
        <p className="text-xs text-amber-200/80 mt-0.5 max-w-2xl">
          Explore the cultural significance of Maharashtrian rituals, and customize authentic poetic Ukhane with couple names ready for Gruhapravesh and Lagna Muhurta.
        </p>
      </div>

      {/* Interactive Ukhane Generator & Reader */}
      <div className="bg-[#ffffff] rounded-lg p-4 sm:p-5 border border-[#e8e1d5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e1d5]">
          <div>
            <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-[#1f1f1f] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-700 fill-rose-600" />
              <span>Marathi Ukhane Collection (उखाणे संग्रह)</span>
            </h3>
            <p className="text-[11px] text-[#7d7063] mt-0.5">
              Customized automatically with <strong className="text-[#2d2d2d]">{profile.brideName}</strong> & <strong className="text-[#2d2d2d]">{profile.groomName}</strong>
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'bride', 'groom', 'parents'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition capitalize ${
                  activeCategory === cat
                    ? 'bg-[#6b1d1d] text-white shadow-xs'
                    : 'bg-[#f4ede1] text-[#2d2d2d] hover:bg-[#e8e1d5]'
                }`}
              >
                {cat === 'all' ? 'All Ukhane' : `${cat} Special`}
              </button>
            ))}
          </div>
        </div>

        {/* Ukhane Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredUkhane.map((ukhane) => {
            const isCopied = copiedId === ukhane.id;
            const isSpeaking = speakingId === ukhane.id;
            
            // Format text with bride/groom name placeholder
            const renderedMarathi = ukhane.marathi
              .replace(/\.\.\.रावांचे/g, `${profile.groomName}रावांचे`)
              .replace(/\.\.\.चे/g, `${profile.brideName}चे`)
              .replace(/\.\.\.रावांनी/g, `${profile.groomName}रावांनी`);

            return (
              <div
                key={ukhane.id}
                className="p-3.5 rounded-lg bg-[#faecd0]/20 border border-[#d4af37]/35 hover:border-[#d4af37] transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#7d7063] mb-1.5">
                    <span className="font-semibold px-1.5 py-0.2 rounded bg-white border border-[#d4af37]/30 text-[#6b1d1d] text-[9px] uppercase">
                      {ukhane.category === 'bride' ? '👰 वधू उखाणा' : ukhane.category === 'groom' ? '🤵 वर उखाणा' : '👨‍👩‍👦 पालक आशीर्वाद'}
                    </span>
                    <span className="text-[10px] text-[#8f8173]">{ukhane.author}</span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-[#3d0b0b] font-serif-marathi whitespace-pre-line leading-relaxed">
                    "{renderedMarathi}"
                  </p>

                  <p className="text-[11px] text-[#7d7063] italic mt-1.5">
                    Meaning: {ukhane.englishMeaning}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e8e1d5] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleSpeak(ukhane.id, ukhane.marathi)}
                    className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition ${
                      isSpeaking
                        ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                        : 'bg-white hover:bg-[#f4ede1] text-[#2d2d2d] border-[#e8e1d5]'
                    }`}
                    title="Audio Pronunciation"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(ukhane.id, ukhane.marathi)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#6b1d1d] hover:bg-[#521414] text-white text-[11px] font-semibold transition"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#d4af37]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied!' : 'Copy Ukhana'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traditional Customs & Vedic Symbolism Guide */}
      <div className="bg-[#ffffff] rounded-lg p-4 sm:p-5 border border-[#e8e1d5] shadow-xs space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-[#1f1f1f] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#6b1d1d]" />
            <span>Guide to Essential Marathi Wedding Customs (विधी व परंपरा परिचय)</span>
          </h3>
          <p className="text-[11px] text-[#7d7063] mt-0.5">
            Key rituals and their deep cultural significance passed down through generations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {traditions.map((trad, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#fcf9f2] border border-[#e8e1d5] hover:border-[#d4af37]/60 transition space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">{trad.symbol}</span>
                <h4 className="font-bold text-xs text-[#1f1f1f] font-serif-marathi">
                  {trad.title}
                </h4>
              </div>
              <p className="text-[11px] text-[#7d7063] leading-relaxed">
                {trad.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
