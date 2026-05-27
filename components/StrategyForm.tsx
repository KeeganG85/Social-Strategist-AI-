import React from 'react';
import { StrategyInput, Platform, ContentGoal, BrandTone, HookStyle } from '../types';
import { PLATFORMS, GOALS, TONES, HOOK_STYLES } from '../constants';
import { 
  Sparkles, Loader2, Check, Instagram, Facebook, Linkedin, 
  Twitter, Music, Pin, Share2, Wand2, X
} from 'lucide-react';

interface StrategyFormProps {
  input: StrategyInput;
  onChange: (field: keyof StrategyInput, value: any) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const StrategyForm: React.FC<StrategyFormProps> = ({ 
  input, 
  onChange, 
  onSubmit, 
  isLoading
}) => {
  
  const isValid = input.image !== null && input.platform.length > 0;

  const togglePlatform = (p: Platform) => {
    const current = [...input.platform];
    const index = current.indexOf(p);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(p);
    }
    onChange('platform', current);
  };

  const selectAllPlatforms = () => {
    if (input.platform.length === PLATFORMS.length) {
      onChange('platform', []);
    } else {
      onChange('platform', [...PLATFORMS]);
    }
  };

  const getPlatformIcon = (platform: Platform, isActive: boolean) => {
    const size = 16;
    const baseClass = isActive ? "" : "text-gray-400";
    
    switch (platform) {
      case Platform.Instagram: return <Instagram size={size} className={isActive ? "text-[#E4405F]" : baseClass} />;
      case Platform.Facebook: return <Facebook size={size} className={isActive ? "text-[#1877F2]" : baseClass} />;
      case Platform.LinkedIn: return <Linkedin size={size} className={isActive ? "text-[#0077B5]" : baseClass} />;
      case Platform.X: return <Twitter size={size} className={isActive ? "text-brand-black" : baseClass} />;
      case Platform.TikTok: return <Music size={size} className={isActive ? "text-[#00F2EA]" : baseClass} />;
      case Platform.Pinterest: return <Pin size={size} className={isActive ? "text-[#BD081C]" : baseClass} />;
      default: return <Share2 size={size} className={baseClass} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="border-b border-gray-100 pb-4 mb-4">
         <h2 className="font-heading font-bold text-xl text-brand-black">Strategy Setup</h2>
         <p className="text-sm text-brand-grey mt-1">Define your campaign parameters.</p>
      </div>

      <div className="space-y-4">
        {/* Multi-Platform Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Target Platforms</label>
            <button 
              onClick={selectAllPlatforms}
              className="text-[10px] font-bold uppercase text-brand-sky hover:text-brand-skyLight transition-colors"
            >
              {input.platform.length === PLATFORMS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map(p => {
              const isActive = input.platform.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-bold transition-all
                    ${isActive 
                      ? 'bg-brand-amber/10 border-brand-amber text-black shadow-sm' 
                      : 'bg-brand-offWhite border-gray-200 text-gray-700 hover:border-gray-300'}
                  `}
                >
                  <div className="shrink-0">{getPlatformIcon(p, isActive)}</div>
                  <span className="flex-grow text-left">{p}</span>
                  {isActive && <Check size={14} className="text-brand-amberDark" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Goal Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Goal</label>
            <select 
               value={input.goal}
               onChange={(e) => onChange('goal', e.target.value)}
               className="w-full p-3 rounded-full border border-gray-200 bg-brand-offWhite text-black focus:ring-2 focus:ring-brand-amber focus:border-transparent outline-none transition-all font-sans"
            >
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Tone</label>
            <select 
               value={input.tone}
               onChange={(e) => onChange('tone', e.target.value)}
               className="w-full p-3 rounded-full border border-gray-200 bg-brand-offWhite text-black focus:ring-2 focus:ring-brand-amber focus:border-transparent outline-none transition-all font-sans"
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Hook Style Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Hook Style</label>
          <select 
             value={input.hookStyle}
             onChange={(e) => onChange('hookStyle', e.target.value)}
             className="w-full p-3 rounded-full border border-gray-200 bg-brand-offWhite text-black focus:ring-2 focus:ring-brand-amber focus:border-transparent outline-none transition-all font-sans"
          >
            {HOOK_STYLES.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Free Text Fields */}
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Industry / Context (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. Sustainable Fashion, SaaS, Coffee Shop..."
            value={input.industry || ''}
            onChange={(e) => onChange('industry', e.target.value)}
            className="w-full p-3 rounded-full border border-gray-200 bg-brand-offWhite text-black placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Exclusions (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. No emojis, no salesy jargon..."
            value={input.exclusions || ''}
            onChange={(e) => onChange('exclusions', e.target.value)}
            className="w-full p-3 rounded-full border border-gray-200 bg-brand-offWhite text-black placeholder-gray-400 focus:ring-2 focus:ring-brand-amber focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className={`
            w-full py-4 px-6 rounded-lg font-heading font-bold text-lg tracking-wide flex items-center justify-center space-x-2 shadow-lg transition-all transform active:scale-[0.99]
            ${!isValid 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-amber hover:bg-brand-amberDark text-brand-black hover:shadow-xl'}
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Analysing Media...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Strategy</span>
            </>
          )}
        </button>
        {!isValid && !isLoading && input.image && (
          <p className="text-[10px] text-red-400 text-center mt-2 font-bold uppercase tracking-tighter animate-pulse">Select at least one platform to proceed</p>
        )}
      </div>
    </div>
  );
};

export default StrategyForm;