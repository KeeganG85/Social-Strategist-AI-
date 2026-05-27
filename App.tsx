import React, { useState, useEffect } from 'react';
import { StrategyInput, Platform, ContentGoal, BrandTone, HookStyle, GeneratedContent, SavedStrategy } from './types';
import FileUpload from './components/FileUpload';
import StrategyForm from './components/StrategyForm';
import ResultCard from './components/ResultCard';
import { generateSocialStrategy, generateImagePrompt } from './services/geminiService';
import { trackEvent } from './services/analyticsService';
import { 
  Camera, Layout as LayoutIcon, AlertCircle, Copy, Check, Wand2, 
  Loader2, X, ClipboardCheck, Save, Download, Library, Trash2, 
  FolderOpen, History, Instagram, Facebook, Linkedin, Twitter, 
  Music, Pin, Share2, Calendar, Grid, Clock
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';

const STORAGE_KEY = 'social_strategist_library';

const MainApp: React.FC = () => {
  const [input, setInput] = useState<StrategyInput>({
    platform: [Platform.Instagram],
    goal: ContentGoal.Awareness,
    tone: BrandTone.Professional,
    hookStyle: HookStyle.Statement,
    industry: '',
    exclusions: '',
    image: null
  });

  const [results, setResults] = useState<GeneratedContent[]>([]);
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [library, setLibrary] = useState<SavedStrategy[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Load library from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLibrary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse library", e);
      }
    }
  }, []);

  const [libraryView, setLibraryView] = useState<'grid' | 'timeline'>('grid');

  const handleUpdateScheduleDate = (id: string, dateStr: string) => {
    const updated = library.map(item => {
      if (item.id === id) {
        return { ...item, scheduledDate: dateStr };
      }
      return item;
    });
    setLibrary(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getEffectiveDate = (item: SavedStrategy) => {
    if (item.scheduledDate) return item.scheduledDate;
    const d = new Date(item.timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const quickReschedule = (item: SavedStrategy, days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentEst = getEffectiveDate(item);
    const currentEstDate = new Date(currentEst + 'T00:00:00');
    currentEstDate.setDate(currentEstDate.getDate() + days);
    
    const year = currentEstDate.getFullYear();
    const month = String(currentEstDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentEstDate.getDate()).padStart(2, '0');
    const nextDateStr = `${year}-${month}-${day}`;
    
    handleUpdateScheduleDate(item.id, nextDateStr);
  };

  const handleInputChange = (field: keyof StrategyInput, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
    if (field === 'image') {
      setImagePrompt(null);
    }
    setIsSaved(false);
  };

  const handleGenerate = async () => {
    if (!input.image || input.platform.length === 0) return;
    
    trackEvent('strategy_generated', { platform: input.platform, goal: input.goal });
    setLoading(true);
    setError(null);
    setResults([]);
    setCopiedAll(false);
    setIsSaved(false);

    try {
      const generatedContent = await generateSocialStrategy(input);
      setResults(generatedContent);
    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrompt = async () => {
    if (!input.image) return;
    trackEvent('prompt_created', { industry: input.industry });
    setPromptLoading(true);
    setError(null);
    try {
      const prompt = await generateImagePrompt(input.image);
      setImagePrompt(prompt);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image prompt.");
    } finally {
      setPromptLoading(false);
    }
  };

  const handleSaveStrategy = () => {
    if (results.length === 0) return;
    trackEvent('strategy_saved', { goal: input.goal });

    const { image, ...inputWithoutImage } = input;
    const newSave: SavedStrategy = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      input: inputWithoutImage,
      results,
      imagePrompt
    };

    const updatedLibrary = [newSave, ...library].slice(0, 50); // Keep last 50
    setLibrary(updatedLibrary);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLibrary));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportJSON = () => {
    if (results.length === 0) return;

    const { image, ...inputWithoutImage } = input;
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      strategy: {
        settings: inputWithoutImage,
        imagePrompt,
        results
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Social-Strategy-${input.industry || 'Campaign'}-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadSaved = (saved: SavedStrategy) => {
    trackEvent('strategy_loaded', { goal: saved.input.goal });
    setResults(saved.results);
    setImagePrompt(saved.imagePrompt);
    setInput(prev => ({
      ...prev,
      ...saved.input,
      // Note: We cannot recover the original File object from localStorage
      image: prev.image 
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('strategy_deleted');
    const updated = library.filter(item => item.id !== id);
    setLibrary(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCopyAll = () => {
    if (results.length === 0) return;
    trackEvent('content_copied_all');

    let allContent = `🚀 SOCIAL MEDIA CONTENT BRIEF\n`;
    allContent += `Generated: ${new Date().toLocaleString()}\n`;
    allContent += `Strategy: ${input.goal} | Tone: ${input.tone}\n`;
    
    if (imagePrompt) {
      allContent += `\n📸 REVERSE ENGINEERED IMAGE PROMPT:\n"${imagePrompt}"\n`;
    }

    allContent += `\n${'='.repeat(30)}\n\n`;

    const platformContent = results.map(res => {
      return `📱 ${res.platformName.toUpperCase()}\n` +
             `Hook: ${res.hook}\n\n` +
             `Caption:\n${res.caption}\n\n` +
             `Visual Overlay: ${res.overlayText || 'N/A'}\n` +
             `Hashtags: ${res.hashtags.join(' ')}\n` +
             `Engagement Forecast: ${res.engagementStrength} (${res.engagementReason})\n` +
             `\n${'-'.repeat(20)}`;
    }).join('\n\n');

    allContent += platformContent;
    allContent += `\n\nGenerated via Social Strategist AI & BuzzCraft (buzzcraft.co.za)`;

    navigator.clipboard.writeText(allContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyPrompt = () => {
    if (!imagePrompt) return;
    trackEvent('prompt_copied');
    navigator.clipboard.writeText(imagePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getPlatformMiniIcon = (name: string) => {
    const n = name.toLowerCase();
    const size = 12;
    if (n.includes('instagram')) return <Instagram size={size} className="text-[#E4405F]" />;
    if (n.includes('facebook')) return <Facebook size={size} className="text-[#1877F2]" />;
    if (n.includes('linkedin')) return <Linkedin size={size} className="text-[#0077B5]" />;
    if (n.includes('x')) return <Twitter size={size} className="text-black" />;
    if (n.includes('tiktok')) return <Music size={size} className="text-[#00F2EA]" />;
    if (n.includes('pinterest')) return <Pin size={size} className="text-[#BD081C]" />;
    return <Share2 size={size} />;
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-brand-black text-white sticky top-0 z-50 shadow-xl border-b-[6px] border-brand-amber">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="font-heading font-black text-2xl tracking-tighter leading-none uppercase italic text-white">
                Social Strategist <span className="text-brand-amber">AI</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.25em] uppercase mt-1">
                Visual-First Performance Marketing
              </p>
            </div>
          </div>
          {library.length > 0 && (
            <button 
              onClick={() => document.getElementById('library-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase hover:bg-white/10 transition-colors"
            >
              <Library size={14} className="text-brand-amber" />
              Library ({library.length})
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
               <h2 className="font-heading font-black text-sm uppercase tracking-[0.2em] mb-4 flex items-center justify-between text-brand-grey">
                 <div className="flex items-center gap-2">
                   <LayoutIcon size={18} className="text-brand-amber" />
                   Content Asset
                 </div>
               </h2>
               <FileUpload 
                selectedFile={input.image} 
                onFileSelect={(file) => handleInputChange('image', file)} 
              />
              
              {input.image && (
                <div className="mt-4 space-y-4">
                  <button
                    onClick={handleGeneratePrompt}
                    disabled={promptLoading}
                    className={`w-full bg-brand-amber hover:bg-brand-amberDark text-brand-black py-4 rounded-lg font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-amber/50 hover:scale-[1.02] active:scale-[0.98] ${!promptLoading && !imagePrompt ? 'animate-soft-pulse ring-4 ring-brand-amber/20' : ''}`}
                  >
                    {promptLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Wand2 size={18} />
                    )}
                    {promptLoading ? 'Decoding Image...' : 'Create prompt for this image'}
                  </button>

                  {imagePrompt && (
                    <div className="bg-white p-6 rounded-[32px] shadow-md border border-brand-amber/30 animate-fade-in relative group overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-brand-amber"></div>
                      <button 
                        onClick={() => setImagePrompt(null)}
                        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-black text-[10px] uppercase tracking-[0.3em] text-brand-amberDark">Gen-AI Script</h3>
                        <button 
                          onClick={handleCopyPrompt}
                          className="text-brand-black hover:text-brand-amber flex items-center gap-1.5 text-xs font-black transition-colors"
                        >
                          {copiedPrompt ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copiedPrompt ? 'COPIED' : 'COPY'}
                        </button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-[32px] border border-gray-100 italic text-xs text-gray-600 leading-relaxed font-sans">
                        "{imagePrompt}"
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <StrategyForm 
              input={input} 
              onChange={handleInputChange} 
              onSubmit={handleGenerate}
              isLoading={loading}
            />
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 text-red-700 mb-10 animate-fade-in shadow-sm">
                <AlertCircle className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase tracking-widest text-sm mb-1">Critical Error</h4>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {!loading && results.length === 0 && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-300 min-h-[500px] border-4 border-dashed border-gray-100 rounded-[40px] bg-white transition-colors hover:bg-gray-50/30">
                <div className="bg-gray-50 p-10 rounded-full mb-6">
                  <Camera size={64} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-heading font-black text-gray-400 uppercase tracking-widest">Awaiting Strategy</h3>
                <p className="max-w-xs mt-3 text-sm font-medium text-gray-400">Upload your visual media to activate the performance strategist.</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-10 animate-fade-in">
                {/* Refined Copy All / Summary Control Bar */}
                <div className="sticky top-24 z-40 bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl flex flex-col xl:flex-row xl:items-center justify-between gap-6 overflow-hidden">
                  <div className="absolute left-0 top-0 w-2 h-full bg-brand-amber"></div>
                  <div className="relative z-10">
                    <h2 className="font-heading font-black text-3xl text-brand-black tracking-tight uppercase italic">Strategy Pack</h2>
                    <p className="text-[10px] text-brand-grey font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      {results.length} Channels Multiplied & Optimised
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex flex-wrap items-center gap-3">
                    <button 
                      onClick={handleSaveStrategy}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black border transition-all duration-300 ${
                        isSaved 
                        ? 'bg-green-50 border-green-200 text-green-600' 
                        : 'bg-white border-gray-200 text-brand-black hover:border-brand-amber'
                      }`}
                    >
                      {isSaved ? <Check size={16} /> : <Save size={16} />}
                      {isSaved ? 'SAVED TO LIBRARY' : 'SAVE TO LIBRARY'}
                    </button>

                    <button 
                      onClick={handleExportJSON}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-[11px] font-black text-brand-black hover:border-brand-sky transition-all"
                    >
                      <Download size={16} className="text-brand-sky" />
                      EXPORT JSON
                    </button>

                    <button 
                      onClick={handleCopyAll}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black border-2 transition-all duration-500 shadow-lg active:scale-95 group ${
                        copiedAll 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'bg-brand-amber border-brand-amber text-brand-black hover:bg-brand-amberDark'
                      }`}
                    >
                      {copiedAll ? <ClipboardCheck size={18} /> : <Copy size={18} />}
                      {copiedAll ? 'BRIEF COPIED' : 'COPY FULL BRIEF'}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-10">
                  {results.map((content, index) => (
                    <ResultCard key={index} content={content} />
                  ))}
                </div>

                <div className="flex justify-center pt-10 pb-20">
                   <button 
                     onClick={handleGenerate}
                     className="bg-transparent border-[3px] border-brand-black text-brand-black px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase hover:bg-brand-black hover:text-white transition-all shadow-md hover:shadow-xl active:scale-95"
                   >
                     Regenerate Full Strategy
                   </button>
                </div>
              </div>
            )}
            
            {loading && (
              <div className="space-y-10">
                 <div className="h-28 bg-white rounded-[32px] w-full animate-pulse border border-gray-100 shadow-lg"></div>
                 <div className="grid gap-10">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-md space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse"></div>
                          <div className="space-y-2 flex-grow">
                             <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                             <div className="h-3 bg-gray-100 rounded w-1/4 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="h-24 bg-gray-50 rounded-2xl w-full animate-pulse"></div>
                          <div className="h-32 bg-gray-50 rounded-2xl w-full animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
                           <div className="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Library Section */}
        {library.length > 0 && (
          <div id="library-section" className="mt-20 pt-20 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-amber/10 rounded-2xl text-brand-amber">
                  <History size={24} />
                </div>
                <div>
                  <h2 className="font-heading font-black text-2xl uppercase tracking-tighter">Strategy Library</h2>
                  <p className="text-xs text-brand-grey font-bold uppercase tracking-widest">Your Persisted Performance History</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">
                {library.length} SAVED CAMPAIGNS
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-gray-100/65 p-2 rounded-2xl border border-gray-200/50">
              <div className="flex bg-white p-1 rounded-xl shadow-sm gap-1 w-fit border border-gray-200/50">
                <button
                  onClick={() => setLibraryView('grid')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 rounded-lg ${libraryView === 'grid' ? 'bg-brand-black text-[#F5A623] shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Grid size={14} /> Briefs Grid
                </button>
                <button
                  onClick={() => setLibraryView('timeline')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 rounded-lg ${libraryView === 'timeline' ? 'bg-brand-black text-[#F5A623] shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Calendar size={14} /> Content Calendar Timeline
                </button>
              </div>
              <div className="text-[10px] sm:text-xs text-brand-grey font-bold uppercase tracking-wider flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                <Clock size={14} className="text-brand-sky" /> Organise and schedule your performance strategies across dates
              </div>
            </div>

            {libraryView === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {library.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleLoadSaved(item)}
                    className="group relative bg-white rounded-2xl border border-gray-155 shadow-sm hover:shadow-2xl hover:border-brand-amber transition-all duration-300 cursor-pointer overflow-hidden p-6 active:scale-[0.98] flex flex-col justify-between"
                  >
                    <div>
                      <div className="absolute top-0 right-0 p-4">
                        <button 
                          onClick={(e) => handleDeleteSaved(item.id, e)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {item.results.map((res, i) => (
                          <div key={i} title={res.platformName}>
                            {getPlatformMiniIcon(res.platformName)}
                          </div>
                        ))}
                      </div>

                      <h3 className="font-heading font-black text-lg text-brand-black mb-1 truncate uppercase">
                        {item.input.industry || 'General Campaign'}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-[9px] font-black bg-brand-sky/10 text-brand-sky px-2 py-0.5 rounded uppercase tracking-tighter">
                          {item.input.goal}
                        </span>
                        <span className="text-[9px] font-black bg-brand-amber/10 text-brand-amberDark px-2 py-0.5 rounded uppercase tracking-tighter">
                          {item.input.tone}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-500 line-clamp-2 italic mb-6">
                        "{item.results[0]?.hook}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          Saved: {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1.5 text-brand-sky font-black text-[10px] uppercase group-hover:translate-x-1 transition-transform">
                          Restore Brief <FolderOpen size={12} />
                        </div>
                      </div>
                      
                      {/* Inline publishing planner */}
                      <div className="bg-brand-offWhite p-2.5 rounded-xl border border-gray-200 space-y-1.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1 font-sans">
                            <Calendar size={10} className="text-brand-sky" /> Schedule Publish:
                          </label>
                          {item.scheduledDate && (
                            <span className="text-[8px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase">
                              Planned
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="date" 
                            value={getEffectiveDate(item)}
                            onChange={(e) => handleUpdateScheduleDate(item.id, e.target.value)}
                            className="flex-grow text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand-sky outline-none font-sans font-black text-gray-700"
                          />
                          <button
                            onClick={(e) => quickReschedule(item, 1, e)}
                            title="Delay by 1 day"
                            className="bg-brand-amber text-brand-black hover:bg-brand-amberDark p-1.5 rounded-lg text-[9px] font-black transition-all shadow-sm active:scale-95"
                          >
                            +1d
                          </button>
                          <button
                            onClick={(e) => quickReschedule(item, 7, e)}
                            title="Delay by 1 week"
                            className="bg-brand-sky text-white hover:bg-brand-skyLight p-1.5 rounded-lg text-[9px] font-black transition-all shadow-sm active:scale-95"
                          >
                            +7d
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (() => {
              const grouped: { [key: string]: SavedStrategy[] } = {};
              library.forEach(item => {
                const dateStr = getEffectiveDate(item);
                if (!grouped[dateStr]) {
                  grouped[dateStr] = [];
                }
                grouped[dateStr].push(item);
              });
              const dates = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

              return (
                <div className="space-y-10">
                  {dates.map((dateStr) => {
                    const itemsOnDate = grouped[dateStr] || [];
                    const dateObj = new Date(dateStr + 'T00:00:00');
                    const dayNum = dateObj.getDate();
                    const monthName = dateObj.toLocaleDateString(undefined, { month: 'short' });
                    const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
                    const isToday = new Date().toLocaleDateString() === dateObj.toLocaleDateString();

                    return (
                      <div key={dateStr} className="relative pl-6 md:pl-12 border-l-2 border-brand-amber/30 py-2">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[11px] top-6 h-5 w-5 rounded-full border-4 bg-white transition-all ${isToday ? 'border-brand-amber ring-4 ring-brand-amber/20 animate-pulse' : 'border-gray-200'}`}></div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4 bg-[#f8f9fa] p-3 rounded-2xl w-fit border border-gray-200/50">
                            {/* Modern Date Badge */}
                            <div className="bg-brand-black text-[#F5A623] px-4 py-2 bg-brand-amber rounded-lg text-center flex flex-col items-center justify-center shadow-md min-w-[65px]">
                              <span className="text-[10px] font-black text-white uppercase tracking-wider leading-none">{monthName}</span>
                              <span className="text-xl font-heading font-black text-brand-black mt-0.5 leading-none">{dayNum}</span>
                            </div>
                            <div>
                              <h3 className="font-heading font-black text-lg text-brand-black flex items-center gap-2 leading-tight">
                                {weekday} {isToday && <span className="text-[9px] bg-brand-amber text-brand-black px-2 py-0.5 rounded font-black uppercase tracking-widest animate-pulse">TODAY</span>}
                              </h3>
                              <p className="text-xs text-brand-grey font-bold uppercase tracking-wider">
                                {itemsOnDate.length} {itemsOnDate.length === 1 ? 'CAMPAIGN / BRIEF' : 'CAMPAIGNS / BRIEFS'} PLANNED
                              </p>
                            </div>
                          </div>

                          {/* Quick Day Shift / Action Group */}
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reschedule whole Day:</span>
                            <button
                              onClick={() => {
                                itemsOnDate.forEach(item => {
                                  const currentEstDate = new Date(dateStr + 'T00:00:00');
                                  currentEstDate.setDate(currentEstDate.getDate() + 1);
                                  const year = currentEstDate.getFullYear();
                                  const month = String(currentEstDate.getMonth() + 1).padStart(2, '0');
                                  const day = String(currentEstDate.getDate()).padStart(2, '0');
                                  handleUpdateScheduleDate(item.id, `${year}-${month}-${day}`);
                                });
                              }}
                              className="bg-brand-offWhite hover:bg-gray-200 border border-gray-200 py-1.5 px-3 rounded-xl text-[10px] font-black text-gray-650 transition-all active:scale-95"
                            >
                              +1 Day
                            </button>
                            <button
                              onClick={() => {
                                itemsOnDate.forEach(item => {
                                  const currentEstDate = new Date(dateStr + 'T00:00:00');
                                  currentEstDate.setDate(currentEstDate.getDate() + 7);
                                  const year = currentEstDate.getFullYear();
                                  const month = String(currentEstDate.getMonth() + 1).padStart(2, '0');
                                  const day = String(currentEstDate.getDate()).padStart(2, '0');
                                  handleUpdateScheduleDate(item.id, `${year}-${month}-${day}`);
                                });
                              }}
                              className="bg-brand-offWhite hover:bg-gray-200 border border-gray-200 py-1.5 px-3 rounded-xl text-[10px] font-black text-gray-650 transition-all active:scale-95"
                            >
                              +1 Week
                            </button>
                          </div>
                        </div>

                        {/* Day's Grid Planner */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {itemsOnDate.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => handleLoadSaved(item)}
                              className="group relative bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-xl hover:border-brand-sky transition-all duration-300 cursor-pointer overflow-hidden p-5 active:scale-[0.98] border-l-4 border-l-brand-sky flex flex-col justify-between"
                            >
                              <div>
                                {/* Delete Button */}
                                <div className="absolute top-0 right-0 p-4">
                                  <button 
                                    onClick={(e) => handleDeleteSaved(item.id, e)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>

                                {/* Scheduled Platform Icons */}
                                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                                  {item.results.map((res, i) => (
                                    <div key={i} title={res.platformName} className="p-1 px-1.5 bg-gray-50 rounded-lg flex items-center gap-1 border border-gray-150">
                                      {getPlatformMiniIcon(res.platformName)}
                                      <span className="text-[8px] font-black text-gray-500 uppercase">{res.platformName}</span>
                                    </div>
                                  ))}
                                </div>

                                <h3 className="font-heading font-black text-base text-brand-black mb-1 truncate uppercase">
                                  {item.input.industry || 'General Campaign'}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="text-[8px] font-black bg-brand-sky/10 text-brand-sky px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                    {item.input.goal}
                                  </span>
                                  <span className="text-[8px] font-black bg-brand-amber/10 text-brand-amberDark px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                    {item.input.tone}
                                  </span>
                                </div>

                                <p className="text-[10px] text-gray-400 italic mb-4 line-clamp-1">
                                  "{item.results[0]?.hook}"
                                </p>
                              </div>

                              {/* Timeline-specific Inline rescheduling */}
                              <div className="pt-3 border-t border-gray-100 space-y-3 mt-4" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] text-gray-400 font-bold uppercase">
                                    Saved {new Date(item.timestamp).toLocaleDateString()}
                                  </span>
                                  <div className="text-brand-sky font-black text-[9px] uppercase flex items-center gap-1 group-hover:translate-x-1 transition-all">
                                    Restore <FolderOpen size={10} />
                                  </div>
                                </div>

                                <div className="bg-brand-offWhite p-2.5 rounded-xl border border-gray-200/50 space-y-1.5">
                                  <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1 font-sans">
                                    <Calendar size={10} className="text-brand-sky" /> Move Scheduled Date
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <input 
                                      type="date" 
                                      value={getEffectiveDate(item)}
                                      onChange={(e) => handleUpdateScheduleDate(item.id, e.target.value)}
                                      className="flex-grow text-[9px] bg-white border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand-sky outline-none font-sans font-black text-gray-700"
                                    />
                                    <button
                                      onClick={(e) => quickReschedule(item, 1, e)}
                                      title="Delay by 1 day"
                                      className="bg-brand-amber text-brand-black hover:bg-brand-amberDark p-1 rounded-lg text-[8px] font-black transition-all shadow-sm active:scale-95"
                                    >
                                      +1d
                                    </button>
                                    <button
                                      onClick={(e) => quickReschedule(item, 7, e)}
                                      title="Delay by 1 week"
                                      className="bg-brand-sky text-white hover:bg-brand-skyLight p-1 rounded-lg text-[8px] font-black transition-all shadow-sm active:scale-95"
                                    >
                                      +7d
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-white py-12 mt-auto border-t-[4px] border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-8">
          
          <div className="flex flex-col items-center gap-4">
            <a href="https://buzzcraft.co.za" target="_blank" rel="noopener noreferrer" className="group transform transition-transform hover:scale-110 duration-500">
              <img 
                src="https://i.postimg.cc/DwbM1CwR/BuzzCraft_B_logo.png" 
                alt="BuzzCraft" 
                className="h-24 md:h-32 opacity-95 group-hover:opacity-100 transition-all duration-500" 
              />
            </a>
            <p className="text-[10px] md:text-[11px] text-gray-500 font-black tracking-[0.4em] uppercase italic mt-2">Visual Excellence in Marketing</p>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-8 w-full max-sm:max-w-xs">
            <p className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase">&copy; {new Date().getFullYear()} Social Strategist AI</p>
            <p className="text-[9px] text-gray-600 font-bold">
              Developed & Optimised by <a href="https://buzzcraft.co.za" target="_blank" rel="noopener noreferrer" className="text-brand-amber hover:text-brand-amberDark transition-colors">BuzzCraft</a>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="font-[Georgia,serif] bg-[#0D0D0D] text-white min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-[#2A2A2A] sticky top-0 bg-[#0D0D0D]/95 z-[100] backdrop-blur-md">
        <div className="flex flex-col gap-0 cursor-pointer" onClick={() => setPage("landing")}>
          <span className="text-[15px] font-bold tracking-[0.18em] font-mono text-white">SOCIAL STRATEGIST<span className="text-[#F5A623]">AI</span></span>
          <span className="text-[9px] tracking-[0.28em] text-[#F5A623] font-mono uppercase">Visual-First Performance Marketing</span>
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          <span className="text-[12px] tracking-[0.12em] text-[#888888] cursor-pointer uppercase font-mono hover:text-white transition-colors" onClick={() => setPage("landing")}>Product</span>
          <span className="text-[12px] tracking-[0.12em] text-[#888888] cursor-pointer uppercase font-mono hover:text-white transition-colors" onClick={() => setPage("pricing")}>Pricing</span>
          <span className="text-[12px] tracking-[0.12em] text-[#888888] cursor-pointer uppercase font-mono hover:text-white transition-colors">Sign In</span>
          <button className="text-[11px] tracking-[0.14em] text-[#0D0D0D] bg-[#F5A623] px-5 py-2 font-mono font-bold cursor-pointer border-none hover:bg-[#e0961f] transition-colors" onClick={() => setPage("app")}>Start Free</button>
        </div>
        
        <div className="md:hidden">
          <button className="text-[11px] tracking-[0.14em] text-[#0D0D0D] bg-[#F5A623] px-4 py-2 font-mono font-bold cursor-pointer border-none" onClick={() => setPage("app")}>Start</button>
        </div>
      </nav>

      {/* PAGE TABS (for mockup navigation) */}
      <div className="flex gap-0 border-b border-[#2A2A2A] px-6 md:px-12 bg-[#141414] overflow-x-auto">
        <button
          className={`text-[11px] tracking-[0.14em] px-6 py-3.5 cursor-pointer font-mono uppercase border-none bg-transparent whitespace-nowrap transition-colors ${page === "landing" ? 'text-[#F5A623] border-b-2 border-[#F5A623]' : 'text-[#888888] hover:text-white'}`}
          onClick={() => setPage("landing")}
        >Home</button>
        <button
          className={`text-[11px] tracking-[0.14em] px-6 py-3.5 cursor-pointer font-mono uppercase border-none bg-transparent whitespace-nowrap transition-colors ${page === "pricing" ? 'text-[#F5A623] border-b-2 border-[#F5A623]' : 'text-[#888888] hover:text-white'}`}
          onClick={() => setPage("pricing")}
        >Pricing</button>
        <button
          className={`text-[11px] tracking-[0.14em] px-6 py-3.5 cursor-pointer font-mono uppercase border-none bg-transparent whitespace-nowrap transition-colors ${page === "app" ? 'text-[#F5A623] border-b-2 border-[#F5A623]' : 'text-[#888888] hover:text-white'}`}
          onClick={() => setPage("app")}
        >App</button>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-grow">
        {page === "landing" && <LandingPage onGoToPricing={() => setPage("pricing")} onStartFree={() => setPage("app")} />}
        {page === "pricing" && <PricingPage />}
        {page === "app" && <MainApp />}
      </div>
      
      {/* Footer only for marketing pages */}
      {page !== "app" && (
        <footer className="px-6 md:px-12 py-8 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0D0D0D]">
          <div className="text-[10px] tracking-[0.14em] text-[#888888] font-mono">&copy; {new Date().getFullYear()} SOCIAL STRATEGIST AI</div>
          <div className="text-[10px] tracking-[0.14em] text-[#888888] font-mono">DEVELOPED BY BUZZCRAFT</div>
        </footer>
      )}
    </div>
  );
}