'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, RefreshCw, ArrowLeft, BookOpen, Star, X, Feather, Zap, MoveRight, 
  Moon, Sun, Crown, Heart, Swords, Scale, Anchor, Skull, Droplets, Ghost, Globe,
  Flower2, Key, Mountain, RefreshCcw, Bell, Palette, Eye, Lightbulb, Compass
} from 'lucide-react';

// --- 1. 数据常量与图标映射 ---
const ICON_MAP = {
  0: Feather,       1: Sparkles,      2: Moon,          3: Flower2,
  4: Crown,         5: BookOpen,      6: Heart,         7: Swords,
  8: Sun,           9: Mountain,      10: RefreshCcw,   11: Scale,
  12: Anchor,       13: Skull,        14: Droplets,     15: Ghost,
  16: Zap,          17: Star,         18: Eye,          19: Sun,
  20: Bell,         21: Globe
};

const MAJOR_ARCANA = [
  { id: 0, name: "愚者 (The Fool)", nameEn: "The Fool", meaning: "新的开始，冒险，天真，自发性" },
  { id: 1, name: "魔术师 (The Magician)", nameEn: "The Magician", meaning: "意志力，欲望，创造力，显化" },
  { id: 2, name: "女祭司 (The High Priestess)", nameEn: "The High Priestess", meaning: "直觉，潜意识，神秘，内在声音" },
  { id: 3, name: "皇后 (The Empress)", nameEn: "The Empress", meaning: "丰饶，自然，母性，感官享受" },
  { id: 4, name: "皇帝 (The Emperor)", nameEn: "The Emperor", meaning: "权威，结构，控制，父性" },
  { id: 5, name: "教皇 (The Hierophant)", nameEn: "The Hierophant", meaning: "传统，信仰，精神指引，从众" },
  { id: 6, name: "恋人 (The Lovers)", nameEn: "The Lovers", meaning: "爱，和谐，关系，价值观选择" },
  { id: 7, name: "战车 (The Chariot)", nameEn: "The Chariot", meaning: "控制，意志力，胜利，决心" },
  { id: 8, name: "力量 (Strength)", nameEn: "Strength", meaning: "勇气，说服力，影响力，同情心" },
  { id: 9, name: "隐士 (The Hermit)", nameEn: "The Hermit", meaning: "内省，寻找真理，孤独，指引" },
  { id: 10, name: "命运之轮 (Wheel of Fortune)", nameEn: "Wheel of Fortune", meaning: "业力，命运，生命周期，转折点" },
  { id: 11, name: "正义 (Justice)", nameEn: "Justice", meaning: "公平，真理，因果，法律" },
  { id: 12, name: "倒吊人 (The Hanged Man)", nameEn: "The Hanged Man", meaning: "牺牲，释放，新视角，等待" },
  { id: 13, name: "死神 (Death)", nameEn: "Death", meaning: "结束，转变，过渡，消除" },
  { id: 14, name: "节制 (Temperance)", nameEn: "Temperance", meaning: "平衡，适度，耐心，目的" },
  { id: 15, name: "恶魔 (The Devil)", nameEn: "The Devil", meaning: "束缚，上瘾，物质主义，性" },
  { id: 16, name: "高塔 (The Tower)", nameEn: "The Tower", meaning: "突然的灾难，剧变，启示，觉醒" },
  { id: 17, name: "星星 (The Star)", nameEn: "The Star", meaning: "希望，信仰，目的，更新" },
  { id: 18, name: "月亮 (The Moon)", nameEn: "The Moon", meaning: "幻觉，恐惧，焦虑，潜意识" },
  { id: 19, name: "太阳 (The Sun)", nameEn: "The Sun", meaning: "积极，温暖，成功，活力" },
  { id: 20, name: "审判 (Judgment)", nameEn: "Judgment", meaning: "审判，重生，内心召唤，宽恕" },
  { id: 21, name: "世界 (The World)", nameEn: "The World", meaning: "完成，整合，成就，旅行" },
];

const toRoman = (num) => {
  const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let str = '', i;
  if (num === 0) return "0";
  for (i in roman) {
    while (num >= roman[i]) { str += i; num -= roman[i]; }
  }
  return str;
};

// --- 2. 样式注入 ---
const GlobalStyles = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap');
    
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .perspective-1000 { perspective: 1000px; }
    .backface-hidden { backface-visibility: hidden; }
    .transform-style-3d { transform-style: preserve-3d; }
    
    /* 隐藏滚动条但保留功能 */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* 解读面板专用滚动条 */
    .styled-scrollbar::-webkit-scrollbar { width: 4px; }
    .styled-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
    .styled-scrollbar::-webkit-scrollbar-thumb { background: rgba(217, 119, 6, 0.3); border-radius: 10px; }
    .styled-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(217, 119, 6, 0.5); }
    
    .glass-panel {
      background: rgba(10, 10, 12, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin-slow 30s linear infinite; }
    .animate-spin-slower { animation: spin-slow 45s linear infinite; }
    .animate-spin-reverse { animation: spin-slow 35s linear infinite reverse; }
  `}</style>
);

// --- 修复版 Markdown 渲染器 ---
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const cleanContent = content.replace(/^```markdown\s*/g, '').replace(/^```\s*/g, '').replace(/```$/g, '').trim();
  const lines = cleanContent.split('\n');

  return (
    <div className="space-y-6 text-slate-200 pb-10">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2"></div>;

        if (trimmed.startsWith('###')) return <h3 key={index} className="text-lg font-cinzel font-bold text-amber-500 mt-6 mb-2 pb-2 border-b border-amber-500/20 tracking-widest uppercase">{trimmed.replace(/^###\s+/, '')}</h3>;
        if (trimmed.startsWith('##')) return <h2 key={index} className="text-xl md:text-2xl font-cinzel text-amber-200 mt-8 mb-4 flex items-center gap-3 tracking-widest"><span className="text-amber-600 text-sm">✦</span> {trimmed.replace(/^##\s+/, '')}</h2>;
        if (trimmed.startsWith('#')) return <h1 key={index} className="text-2xl md:text-3xl font-cinzel font-bold text-amber-100 mt-8 mb-6 text-center border-b-2 border-amber-900/20 pb-4">{trimmed.replace(/^#\s+/, '')}</h1>;
        
        if (trimmed.match(/^[-*]\s/)) {
            return (
                <div key={index} className="flex gap-3 ml-1 pl-4 border-l border-amber-500/20 hover:border-amber-500/50 transition-colors py-1">
                    <p className="font-cormorant text-lg md:text-xl leading-relaxed text-slate-300" dangerouslySetInnerHTML={{ __html: parseBold(trimmed.replace(/^[-*]\s/, '')) }}></p>
                </div>
            );
        }

        if (trimmed.startsWith('>')) {
            return (
                <div key={index} className="my-4 p-4 bg-amber-500/5 border-l-2 border-amber-500 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                        <p className="font-cormorant text-lg md:text-xl italic text-amber-100/90 leading-relaxed">
                            {trimmed.replace(/^>\s*/, '')}
                        </p>
                    </div>
                </div>
            );
        }

        return <p key={index} className="font-cormorant text-lg md:text-xl leading-8 text-slate-300/90 tracking-wide" dangerouslySetInnerHTML={{ __html: parseBold(line) }}></p>;
      })}
    </div>
  );
};
const parseBold = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-200 font-semibold">$1</strong>');

// --- 3. 符号风格 ---
const AlchemySymbol = ({ Icon, id }) => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #451a03 0%, #1a1008 50%, transparent 80%)' }}></div>
         <div className="absolute w-[85%] h-[85%] border border-amber-500/20 rounded-full animate-spin-slower">
            {[0, 90, 180, 270].map(deg => (
                <div key={deg} className="absolute w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]" 
                     style={{ top: '50%', left: '50%', transform: `rotate(${deg}deg) translate(500%)` }} />
            ))}
         </div>
         <div className="absolute w-[72%] h-[72%] border-[1px] border-dashed border-amber-600/30 rounded-full animate-spin-reverse"></div>
         <div className="absolute w-[58%] h-[58%] border border-amber-500/30 rotate-45 transition-all duration-1000 shadow-[0_0_15px_rgba(245,158,11,0.1)]"></div>
         <div className="absolute w-[58%] h-[58%] border border-amber-500/20 transition-all duration-1000"></div>
         <div className="absolute w-24 h-24 bg-amber-500/10 blur-2xl rounded-full animate-pulse"></div>
         <div className="relative z-10 p-3 md:p-4 rounded-full bg-gradient-to-br from-[#2a1c15] to-[#0f0a08] border border-amber-500/50 shadow-[0_0_25px_rgba(217,119,6,0.25)] ring-1 ring-inset ring-amber-500/10 group-hover:scale-105 transition-transform duration-500">
            <Icon className="w-8 h-8 md:w-12 md:h-12 text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" strokeWidth={1.2} />
         </div>
         <div className="absolute bottom-4 md:bottom-5 flex flex-col items-center gap-1 opacity-80">
            <div className="flex items-center gap-2">
                <div className="w-6 md:w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60"></div>
                <div className="w-1 h-1 rotate-45 bg-amber-500"></div>
                <div className="w-6 md:w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60"></div>
            </div>
            <div className="text-[10px] md:text-xs font-cinzel font-bold text-amber-400 tracking-[0.3em] drop-shadow-md mt-1">{toRoman(id)}</div>
         </div>
    </div>
);

const NebulaSymbol = ({ Icon }) => <div className="flex items-center justify-center h-full text-white"><Icon size={36} className="md:w-12 md:h-12" /></div>;
const GlitchSymbol = ({ Icon }) => <div className="flex items-center justify-center h-full text-cyan-400"><Icon size={36} className="md:w-12 md:h-12" /></div>;

const SymbolRenderer = ({ id, style }) => {
    const Icon = ICON_MAP[id] || Sparkles;
    switch (style) {
        case 'nebula': return <NebulaSymbol Icon={Icon} id={id} />;
        case 'glitch': return <GlitchSymbol Icon={Icon} id={id} />;
        case 'alchemy': default: return <AlchemySymbol Icon={Icon} id={id} />;
    }
};

// --- 4. 卡牌组件 ---
const TarotCard = React.memo(({ card, isRevealed, onClick, positionLabel, size = "md", className = "", interactable = false, artStyle = 'alchemy' }) => {
  const [visualFlip, setVisualFlip] = useState(false);

  useEffect(() => {
    if (isRevealed) setTimeout(() => setVisualFlip(true), 50);
    else setVisualFlip(false);
  }, [isRevealed]);

  const sizeClasses = {
    sm: "w-16 h-24 md:w-20 md:h-32", // 移动端更小
    md: "w-24 h-40 md:w-32 md:h-52", 
    lg: "w-32 h-52 md:w-48 md:h-80",
    full: "w-full h-full"
  };

  return (
    <div onClick={onClick} className={`relative ${sizeClasses[size] === "full" ? "" : sizeClasses[size]} ${className} perspective-1000 group select-none`}>
      <div className={`relative w-full h-full transition-all duration-700 ease-out-cubic transform-style-3d`} style={{ transform: visualFlip ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        {/* 牌背 */}
        <div className={`absolute inset-0 w-full h-full rounded-lg border border-white/10 shadow-xl backface-hidden overflow-hidden bg-[#121215] ${interactable ? 'group-hover:border-amber-500/40 transition-colors' : ''}`}>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <div className="absolute inset-1.5 border border-amber-500/20 rounded opacity-60 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 border border-amber-500/20 rotate-45 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 border border-amber-500/30 rotate-45"></div>
                </div>
            </div>
        </div>
        {/* 牌面 */}
        <div className="absolute inset-0 w-full h-full rounded-lg bg-[#08080a] border border-amber-500/20 shadow-2xl overflow-hidden backface-hidden flex flex-col" style={{ transform: 'rotateY(180deg)' }}>
           <div className="flex-1 relative w-full h-full">
              <SymbolRenderer id={card?.id} style={artStyle} />
           </div>
           <div className="h-8 md:h-11 bg-gradient-to-t from-[#050302] via-[#0a0806] to-transparent absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-1 md:pb-1.5 z-20">
             <div className="text-amber-100 font-cinzel text-[9px] md:text-[10px] font-bold tracking-widest drop-shadow-md px-1 text-center truncate w-full">{card?.nameEn}</div>
             <div className={`text-[7px] md:text-[8px] uppercase font-mono tracking-widest mt-0.5 px-1.5 py-[1px] rounded-full bg-black/40 ${card?.isReversed ? 'text-red-400/80' : 'text-emerald-400/80'}`}>
               {card?.isReversed ? "Rev." : "Upr."}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
});

// --- 5. 主程序 ---
export default function TarotApp() {
  const [step, setStep] = useState('intro'); 
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]); 
  const [drawnCards, setDrawnCards] = useState([]); 
  const [analysis, setAnalysis] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [artStyle, setArtStyle] = useState('alchemy'); 
  const analysisScrollRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const startProcess = () => {
    if (!question.trim()) return;
    setStep('shuffling');
    setTimeout(() => {
      const shuffled = [...MAJOR_ARCANA]
        .sort(() => Math.random() - 0.5)
        .map(card => ({ ...card, isReversed: Math.random() > 0.5 }));
      setDeck(shuffled);
      setStep('drawing');
    }, 2500);
  };

  const handleSelect = (index) => {
    if (selectedIndices.length >= 3 || selectedIndices.includes(index)) return;
    const newIndices = [...selectedIndices, index];
    setSelectedIndices(newIndices);
    setDrawnCards([...drawnCards, deck[index]]);
    if (newIndices.length === 3) setTimeout(() => setStep('reading'), 1000);
  };

  const startAnalysis = async () => {
    setIsAnalysing(true);
    setAnalysis(''); 
    try {
      const enhancedQuestion = `${question} (请用直白、通俗易懂的语言进行解读，直接给出明确的行动建议，避免使用过于晦涩或模棱两可的词汇。)`;
      const response = await fetch('/api/tarot', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            question: enhancedQuestion, 
            cards: drawnCards.map(c => ({ name: c.name, position: c.isReversed ? '逆位' : '正位', meaning: c.meaning })) 
        })
      });
      if (!response.ok) throw new Error('API Error');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        lines.forEach(line => {
          if (line.trim().startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', '').trim());
              setAnalysis(prev => prev + data.text);
              if(analysisScrollRef.current) analysisScrollRef.current.scrollTop = analysisScrollRef.current.scrollHeight;
            } catch(e) {}
          }
        });
      }
    } catch (err) {
      setAnalysis("### 连接中断\n\n星辰连接受阻。\n\n> 请尝试检查网络连接，或稍后重新提问。");
    } finally {
      setIsAnalysing(false);
    }
  };

  const reset = () => { setStep('intro'); setQuestion(''); setDeck([]); setSelectedIndices([]); setDrawnCards([]); setAnalysis(''); };
  const backToQuestion = () => { setStep('intro'); setDeck([]); setSelectedIndices([]); setDrawnCards([]); setAnalysis(''); };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-200 font-sans overflow-hidden flex flex-col relative selection:bg-amber-900/50 selection:text-amber-100">
      <GlobalStyles />
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c15] via-[#050508] to-black"></div>
         <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-amber-900/5 blur-[150px] opacity-40 animate-pulse"></div>
      </div>

      <header className="relative z-50 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-[#050508]/80 backdrop-blur-md h-[60px] md:h-[70px] flex-none">
        <div onClick={reset} className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity">
          <Sparkles className="text-amber-500 w-4 h-4 md:w-5 md:h-5" />
          <span className="font-cinzel font-bold text-base md:text-lg tracking-widest text-amber-100">DEEP TAROT</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10 overflow-x-auto max-w-[180px] md:max-w-none no-scrollbar">
                <button onClick={() => setArtStyle('alchemy')} className={`flex-shrink-0 px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-mono rounded-full transition-all ${artStyle === 'alchemy' ? 'bg-amber-700 text-amber-100 shadow-lg' : 'text-slate-500 hover:text-white'}`}>ALCHEMY</button>
                <button onClick={() => setArtStyle('nebula')} className={`flex-shrink-0 px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-mono rounded-full transition-all ${artStyle === 'nebula' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}>NEBULA</button>
                <button onClick={() => setArtStyle('glitch')} className={`flex-shrink-0 px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-mono rounded-full transition-all ${artStyle === 'glitch' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:text-white'}`}>GLITCH</button>
            </div>
            {step !== 'intro' && (
                <button onClick={backToQuestion} className="flex-shrink-0 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 md:px-4 rounded-full">
                    <ArrowLeft size={14} />
                </button>
            )}
        </div>
      </header>

      {/* 核心容器：适配 100dvh */}
      <main className="flex-1 relative z-10 flex flex-col max-w-7xl mx-auto w-full h-[calc(100dvh-60px)] md:h-[calc(100dvh-70px)] overflow-hidden">
        
        {step === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-700 overflow-y-auto">
             <div className="text-center space-y-6 md:space-y-8 max-w-2xl w-full">
                <h1 className="text-3xl md:text-6xl font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-200/80 to-slate-600 drop-shadow-2xl py-2">向 命 运 提 问</h1>
                <div className="h-32 w-20 md:h-40 md:w-24 mx-auto perspective-1000">
                    <div className="relative w-full h-full animate-[float_5s_ease-in-out_infinite]">
                        <TarotCard card={MAJOR_ARCANA[10]} isRevealed={true} size="full" artStyle={artStyle} />
                    </div>
                </div>
                <div className="relative group">
                   <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600/20 to-purple-600/20 rounded-xl blur transition duration-1000"></div>
                   <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="在心中默念你的问题..." className="relative w-full bg-[#0e0e12] p-6 md:p-8 rounded-xl border border-white/10 focus:border-amber-500/30 outline-none resize-none h-32 md:h-40 text-lg md:text-xl font-cormorant text-center placeholder:text-slate-700 placeholder:italic transition-all shadow-xl" />
                </div>
                <button onClick={startProcess} disabled={!question.trim()} className="px-12 md:px-16 py-3 md:py-4 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-white font-cinzel font-bold tracking-[0.2em] rounded shadow-[0_0_40px_rgba(180,83,9,0.3)] transition-all disabled:opacity-30 text-sm md:text-base">启 示</button>
             </div>
             <style jsx>{`@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }`}</style>
          </div>
        )}

        {step === 'shuffling' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 md:gap-12 animate-in fade-in duration-1000">
             <div className="relative w-24 h-36 md:w-32 md:h-48 perspective-1000">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="absolute inset-0 border border-amber-500/20 bg-[#1a1825] rounded-lg shadow-xl" style={{ animation: `shuffle 1.5s infinite ease-in-out`, animationDelay: `${i * 0.1}s`, zIndex: 5-i }} />
                ))}
                <style jsx>{`@keyframes shuffle { 0% { transform: translate(0,0) rotate(0); } 50% { transform: translate(30px, 0) rotate(12deg); } 100% { transform: translate(0,0) rotate(0); } }`}</style>
             </div>
             <p className="font-cinzel text-amber-200/50 tracking-[0.3em] animate-pulse">DIVINING...</p>
          </div>
        )}

        {step === 'drawing' && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-700">
             <div className="flex-none py-4 md:py-8 text-center z-20 space-y-1 md:space-y-2">
                <h2 className="text-xl md:text-2xl font-cinzel text-amber-100">选择 <span className="text-amber-500 text-2xl md:text-3xl mx-2">{3 - selectedIndices.length}</span> 张牌</h2>
             </div>
             
             {/* 抽牌区：优化移动端显示 */}
             <div className="flex-1 w-full flex flex-col justify-center relative group">
                <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 text-white/10 animate-pulse"><ArrowLeft size={20}/></div>
                <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 text-white/10 animate-pulse"><MoveRight size={20}/></div>
                <div className="w-full overflow-x-auto no-scrollbar flex items-center justify-start md:justify-center px-8 md:px-0 py-6 md:py-10">
                   <div className="flex items-center gap-[-15px]"> 
                     {deck.map((card, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        return (
                            <div key={idx} onClick={() => handleSelect(idx)} className={`relative flex-shrink-0 w-20 h-32 md:w-32 md:h-52 rounded-lg border border-white/10 bg-[#151520] shadow-2xl transition-all duration-300 ease-out cursor-pointer hover:z-50 hover:-translate-y-6 md:hover:-translate-y-10 hover:scale-105 hover:border-amber-500/50 hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] ${isSelected ? 'opacity-0 -translate-y-20 pointer-events-none w-0 m-0 border-0' : ''}`} style={{ marginLeft: '-35px' }}>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800 to-[#0a0a0e]"></div>
                                <div className="absolute inset-1 border border-white/5 rounded opacity-50"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-30"><div className="w-6 h-6 md:w-8 md:h-8 border border-amber-500/50 rotate-45"></div></div>
                            </div>
                        );
                     })}
                   </div>
                </div>
             </div>

             {/* 底部结果槽：缩小尺寸以适配小屏 */}
             <div className="flex-none h-48 md:h-56 bg-gradient-to-t from-black via-[#0a0a0e] to-transparent flex items-center justify-center gap-3 md:gap-16 pb-6 md:pb-8 px-2 z-20">
                {['过去', '现在', '未来'].map((pos, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-2 md:gap-3">
                      <div className={`relative w-20 h-32 md:w-28 md:h-48 rounded-lg border-2 border-dashed border-white/5 flex items-center justify-center transition-all duration-700 ${drawnCards[idx] ? 'border-none shadow-[0_0_60px_rgba(217,119,6,0.25)]' : 'bg-white/5'}`}>
                         {drawnCards[idx] ? <TarotCard card={drawnCards[idx]} isRevealed={true} size="full" className="w-full h-full" artStyle={artStyle} /> : <span className="text-xl md:text-2xl font-cinzel text-white/5">{idx + 1}</span>}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-slate-600">{pos}</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {step === 'reading' && (
           <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 p-3 md:p-6 h-full overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-700">
              
              {/* 左侧：牌阵 (移动端缩小高度，横向滚动) */}
              <div className="flex-none lg:w-[320px] flex flex-col gap-4 max-h-[160px] lg:max-h-full">
                 <div className="glass-panel rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col gap-2 md:gap-4 h-full">
                    <div className="text-[10px] md:text-xs text-amber-500/60 font-mono uppercase tracking-widest border-b border-white/5 pb-2 flex-none">Your Spread</div>
                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden pb-2 lg:pb-0 styled-scrollbar flex-1 items-center lg:items-stretch">
                        {drawnCards.map((card, i) => (
                           <div key={i} className="flex-shrink-0 flex flex-col lg:flex-row items-center gap-2 md:gap-4 p-2 md:p-3 rounded-lg bg-white/5 border border-white/5 w-20 lg:w-full">
                              <TarotCard card={card} isRevealed={true} size="sm" className="w-12 h-20 md:w-16 md:h-24 shadow-md flex-shrink-0" artStyle={artStyle} />
                              <div className="flex flex-col min-w-0 text-center lg:text-left hidden lg:block">
                                  <div className="text-[10px] text-amber-500 uppercase tracking-wider mb-0.5">{['Past', 'Present', 'Future'][i]}</div>
                                  <div className="text-sm font-cinzel text-slate-200 truncate">{card.nameEn}</div>
                              </div>
                           </div>
                        ))}
                    </div>
                    
                    {/* 仅在桌面端显示的左侧按钮 (移动端放下面) */}
                    {!analysis && !isAnalysing && (
                        <div className="hidden lg:block mt-auto pt-4 flex-none">
                            <button onClick={startAnalysis} className="w-full py-4 bg-amber-700 hover:bg-amber-600 text-white font-cinzel font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"><Sparkles size={18} /> 揭示命运</button>
                        </div>
                    )}
                 </div>
              </div>
              
              {/* 移动端专属：揭示按钮 (为了不占据上方牌阵空间) */}
              {!analysis && !isAnalysing && (
                 <div className="lg:hidden flex-none">
                     <button onClick={startAnalysis} className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-cinzel font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"><Sparkles size={18} /> 揭示命运</button>
                 </div>
              )}

              {/* 右侧：解读面板 */}
              <div className="flex-1 glass-panel rounded-xl md:rounded-2xl flex flex-col overflow-hidden relative h-full">
                 <div className="flex-none h-12 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-white/5">
                    <span className="font-cinzel font-bold text-sm md:text-base text-amber-100 tracking-wider flex items-center gap-2 md:gap-3">{isAnalysing ? <RefreshCw className="animate-spin w-4 h-4 text-amber-500" /> : <BookOpen className="w-4 h-4 text-amber-500" />} ORACLE READING</span>
                    {analysis && <button onClick={reset} className="text-[10px] md:text-xs text-slate-500 hover:text-white flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-white/5 hover:border-white/20 transition-all"><X size={14} /> 结束</button>}
                 </div>
                 
                 <div ref={analysisScrollRef} className="flex-1 overflow-y-auto styled-scrollbar p-4 md:p-12 relative scroll-smooth">
                    {analysis ? <MarkdownRenderer content={analysis} /> : <div className="h-full flex flex-col items-center justify-center text-slate-700/50 gap-4 md:gap-6"><div className="relative"><div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div><Eye size={48} strokeWidth={1} className="relative z-10" /></div><p className="font-cinzel text-xs md:text-sm tracking-[0.2em]">Waiting to Reveal</p></div>}
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}