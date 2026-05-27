import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { 
  Copy, Hash, Zap, Type, MessageSquare, BarChart, Check, Info,
  Instagram, Facebook, Linkedin, Twitter, Music, Pin, Share2,
  TrendingUp, MousePointer2, Heart, Share, Bookmark, PlayCircle,
  Eye, ZapOff, Target
} from 'lucide-react';

interface ResultCardProps {
  content: GeneratedContent;
}

interface Benchmark {
  label: string;
  metric: string;
  outcome: string;
  color: string;
  icon: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ content }) => {
  const [copiedState, setCopiedState] = useState<string | null>(null);

  const getPlatformData = (name: string) => {
    const n = name.toLowerCase();
    const iconSize = 28;
    const benchmarkIconSize = 12;

    const commonBenchmarks: Record<string, Benchmark[]> = {
      instagram: [
        { label: 'Saveability', metric: 'Target > 3%', outcome: 'High save rates signal high-value content to the algorithm, prioritizing your post in the Explore Page and Home Feed. Focus on educational or highly relatable content.', color: 'bg-pink-500', icon: <Bookmark size={benchmarkIconSize} /> },
        { label: 'Story Velocity', metric: 'Target > 1% of reach', outcome: 'Shares to Stories provide immediate social proof, signaling to the algorithm that your content is worth amplifying. Use CTA stickers to encourage sharing.', color: 'bg-purple-500', icon: <Share size={benchmarkIconSize} /> },
        { label: 'Dwell Time', metric: 'Target > 5s average', outcome: 'Optimized for long-form captions and carousel engagement, increasing time-on-post to boost feed ranking. Use swipe-through carousels to keep users engaged.', color: 'bg-orange-500', icon: <Eye size={benchmarkIconSize} /> }
      ],
      facebook: [
        { label: 'MSI Score', metric: 'Target > 2% interaction rate', outcome: 'Meaningful Social Interactions (comments, long-form replies) are the primary driver for Feed ranking. Focus on content that sparks genuine conversation.', color: 'bg-blue-600', icon: <MessageSquare size={benchmarkIconSize} /> },
        { label: 'Group Virality', metric: 'Target > 5 shares/post', outcome: 'Content designed for shareability into niche interest groups. Leverage community trust to expand reach beyond your Page followers.', color: 'bg-blue-400', icon: <Share size={benchmarkIconSize} /> },
        { label: 'Relatability Reach', metric: 'Target > 1.5% engagement', outcome: 'Optimized for personal-feeling content that triggers engagement from friends and family, prioritizing placement in the personal feed.', color: 'bg-blue-800', icon: <Heart size={benchmarkIconSize} /> }
      ],
      linkedin: [
        { label: 'Professional Authority', metric: 'Target > 3% engagement', outcome: 'Content structured to build thought leadership, increasing visibility in professional feeds and earning "Top Voice" badges.', color: 'bg-blue-700', icon: <Target size={benchmarkIconSize} /> },
        { label: 'Networking Lift', metric: 'Target > 10% reach from non-followers', outcome: 'Engagement triggers notifications to 2nd and 3rd-degree connections, expanding reach within professional networks.', color: 'bg-cyan-600', icon: <TrendingUp size={benchmarkIconSize} /> },
        { label: 'Dwell & Depth', metric: 'Target > 8s average', outcome: 'Insightful, long-form copy increases Dwell Time, signaling high-value content for premium distribution to professional audiences.', color: 'bg-blue-900', icon: <MousePointer2 size={benchmarkIconSize} /> }
      ],
      x: [
        { label: 'Viral Spark', metric: 'Target > 0.5% of reach', outcome: 'High quote-repost potential driven by conversational tension or timely commentary, designed to trigger rapid engagement.', color: 'bg-gray-400', icon: <Zap size={benchmarkIconSize} /> },
        { label: 'Real-time Pulse', metric: 'Target > 1% engagement in 30 mins', outcome: 'Optimized for the "For You" tab through rapid initial engagement, leveraging trending topics and real-time relevance.', color: 'bg-gray-600', icon: <Eye size={benchmarkIconSize} /> },
        { label: 'Threadability', metric: 'Target > 20% click-through', outcome: 'Hooks designed to pull users into deeper conversational threads, increasing total interaction time and visibility.', color: 'bg-gray-800', icon: <MessageSquare size={benchmarkIconSize} /> }
      ],
      tiktok: [
        { label: 'Watch-Time Loop', metric: 'Target > 60% retention', outcome: 'Visual hooks and fast-paced editing designed to hit the critical 3-second retention mark, signaling content quality to the algorithm.', color: 'bg-[#FE2C55]', icon: <PlayCircle size={benchmarkIconSize} /> },
        { label: 'FYP Velocity', metric: 'Target > 5% interaction rate', outcome: 'High interaction rate (likes, comments, shares) in the first hour triggers "batch-testing" by the algorithm for potential viral reach.', color: 'bg-[#25F4EE]', icon: <TrendingUp size={benchmarkIconSize} /> },
        { label: 'Sound Mapping', metric: 'Target > 15% audio usage', outcome: 'Contextually ready for trending audio integration, leveraging the platform\'s sound-first discovery mechanism.', color: 'bg-black', icon: <Music size={benchmarkIconSize} /> }
      ],
      pinterest: [
        { label: 'Search Intent', metric: 'Target > 50% traffic from search', outcome: 'SEO-rich tags and descriptions for long-tail discovery, driving traffic over months rather than days.', color: 'bg-[#BD081C]', icon: <Target size={benchmarkIconSize} /> },
        { label: 'Visual Curation', metric: 'Target > 2% save rate', outcome: 'High aesthetic "Save" potential for inclusion in user moodboards, signaling long-term relevance to the algorithm.', color: 'bg-[#E60023]', icon: <Bookmark size={benchmarkIconSize} /> },
        { label: 'Outbound Flow', metric: 'Target > 1% click-through rate', outcome: 'Clear visual path and call-to-action designed to drive direct website/landing page clicks, converting discovery into traffic.', color: 'bg-[#8E0000]', icon: <MousePointer2 size={benchmarkIconSize} /> }
      ]
    };

    if (n.includes('instagram')) return { 
      icon: <Instagram size={iconSize} className="text-[#E4405F]" />, 
      accent: 'bg-[#E4405F]',
      primaryMetric: 'Saves & Shares',
      metricIcon: <Bookmark size={14} />,
      benchmarks: commonBenchmarks.instagram
    };
    if (n.includes('facebook')) return { 
      icon: <Facebook size={iconSize} className="text-[#1877F2]" />, 
      accent: 'bg-[#1877F2]',
      primaryMetric: 'Group Shares',
      metricIcon: <Share size={14} />,
      benchmarks: commonBenchmarks.facebook
    };
    if (n.includes('linkedin')) return { 
      icon: <Linkedin size={iconSize} className="text-[#0077B5]" />, 
      accent: 'bg-[#0077B5]',
      primaryMetric: 'Link Clicks',
      metricIcon: <MousePointer2 size={14} />,
      benchmarks: commonBenchmarks.linkedin
    };
    if (n.includes('x')) return { 
      icon: <Twitter size={iconSize} className="text-white" />, 
      accent: 'bg-white',
      primaryMetric: 'Reposts',
      metricIcon: <TrendingUp size={14} />,
      benchmarks: commonBenchmarks.x
    };
    if (n.includes('tiktok')) return { 
      icon: <Music size={iconSize} className="text-[#00F2EA]" />, 
      accent: 'bg-[#00F2EA]',
      primaryMetric: 'Watch Time',
      metricIcon: <PlayCircle size={14} />,
      benchmarks: commonBenchmarks.tiktok
    };
    if (n.includes('pinterest')) return { 
      icon: <Pin size={iconSize} className="text-[#BD081C]" />, 
      accent: 'bg-[#BD081C]',
      primaryMetric: 'Outbound Clicks',
      metricIcon: <MousePointer2 size={14} />,
      benchmarks: commonBenchmarks.pinterest
    };
    
    return { 
      icon: <Share2 size={iconSize} className="text-brand-amber" />, 
      accent: 'bg-brand-amber',
      primaryMetric: 'General Engagement',
      metricIcon: <Heart size={14} />,
      benchmarks: [
        { label: 'Attention', description: 'Generic attention capture across visual feeds.', color: 'bg-brand-amber', icon: <Eye size={benchmarkIconSize} /> },
        { label: 'Resonance', description: 'General sentiment alignment with the target audience.', color: 'bg-brand-amberDark', icon: <Heart size={benchmarkIconSize} /> }
      ]
    };
  };

  const platformInfo = getPlatformData(content.platformName);

  const getEngagementStyles = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200 ring-green-500/20';
      case 'medium': return 'text-brand-amberDark bg-yellow-50 border-yellow-200 ring-yellow-500/20';
      case 'low': return 'text-red-500 bg-red-50 border-red-200 ring-red-500/20';
      default: return 'text-gray-500 bg-gray-50 border-gray-200 ring-gray-500/20';
    }
  };

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(sectionKey);
    setTimeout(() => setCopiedState(null), 2000);
  };

  const fullCopy = `${content.hook}\n\n${content.caption}\n\n${content.hashtags.join(' ')}`;

  const CopyButton = ({ text, sectionKey, className, iconSize = 14 }: { text: string, sectionKey: string, className?: string, iconSize?: number }) => {
    const isCopied = copiedState === sectionKey;
    return (
      <button 
        onClick={() => copyToClipboard(text, sectionKey)}
        className={`transition-all duration-200 flex items-center gap-1.5 text-xs font-bold ${className} ${isCopied ? '!text-green-500' : ''}`}
        title="Copy to clipboard"
      >
        {isCopied ? <Check size={iconSize} /> : <Copy size={iconSize} />}
        <span>{isCopied ? 'Copied' : 'Copy'}</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative">
      {/* Brand Accent Top Strip */}
      <div className={`h-1.5 w-full ${platformInfo.accent}`}></div>

      <div className="bg-brand-black text-white px-8 py-6 flex justify-between items-center relative overflow-hidden">
        {/* Decorative Background Icon */}
        <div className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12 scale-[3]">
          {platformInfo.icon}
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
            {platformInfo.icon}
          </div>
          <div>
            <h3 className="font-heading font-black text-2xl md:text-3xl tracking-tight uppercase">
              {content.platformName}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Performance Variant</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => copyToClipboard(fullCopy, "full")}
          className={`relative z-10 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black border transition-all duration-500 shadow-md ${
            copiedState === "full" 
            ? 'bg-green-500 border-green-500 text-white scale-105' 
            : 'bg-white/5 border-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95'
          }`}
        >
          {copiedState === "full" ? <Check size={16} /> : <Copy size={16} />}
          {copiedState === "full" ? 'COPIED ALL' : 'COPY ALL'}
        </button>
      </div>
      
      <div className="p-8 space-y-8">
        
        {/* Hook */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-brand-sky font-black text-xs uppercase tracking-[0.15em]">
              <Zap size={16} fill="currentColor" /> <span>The Hook</span>
            </div>
            <CopyButton 
              text={content.hook} 
              sectionKey="hook" 
              className="bg-white/80 p-2 rounded-full shadow-sm border border-gray-100 text-gray-400 hover:text-brand-sky hover:border-brand-sky transition-all"
            />
          </div>
          <div className="p-8 bg-brand-offWhite rounded-[32px] border-l-[8px] border-brand-sky font-heading font-black text-brand-black text-2xl md:text-4xl leading-tight shadow-md hover:shadow-lg transition-shadow">
            "{content.hook}"
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-3">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2.5 text-brand-grey font-black text-xs uppercase tracking-[0.15em]">
              <MessageSquare size={16} /> <span>Caption Copy</span>
            </div>
            <CopyButton 
              text={content.caption} 
              sectionKey="caption" 
              className="text-gray-400 hover:text-brand-grey"
            />
          </div>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-sans text-[16px] bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 italic md:not-italic">
            {content.caption}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Visual Overlay */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-brand-grey font-black text-xs uppercase tracking-[0.15em]">
              <Type size={16} /> <span>Overlay Text</span>
            </div>
            <div className="p-5 border-2 border-dashed border-gray-200 rounded-[32px] text-center text-brand-black font-black uppercase text-2xl bg-white shadow-inner flex items-center justify-center min-h-[120px] hover:border-brand-amber transition-colors">
              {content.overlayText || "NO OVERLAY"}
            </div>
          </div>

          {/* Performance Forecast - NUANCED & DYNAMIC */}
          <div className="space-y-4 relative group/tooltip">
            <div className="flex items-center gap-2.5 text-brand-grey font-black text-xs uppercase tracking-[0.15em] cursor-help">
              <BarChart size={16} /> 
              <span>Strategic Forecast</span>
              <div className="animate-bounce-slow">
                <Info size={14} className="text-brand-amber" />
              </div>
            </div>
            
            <div className={`relative p-5 border-2 rounded-2xl flex flex-col items-center justify-center text-center min-h-[120px] transition-all duration-500 shadow-sm ring-1 group-hover/tooltip:scale-[1.02] ${getEngagementStyles(content.engagementStrength)}`}>
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-tighter">
                {platformInfo.metricIcon}
                Focus: {platformInfo.primaryMetric}
              </div>
              <span className="font-black uppercase tracking-widest text-sm mb-2 mt-8">{content.engagementStrength} Engagement</span>
              <span className="text-[12px] opacity-90 leading-tight font-bold italic px-2">"{content.engagementReason}"</span>
            </div>

            {/* Hover Tooltip - Strategic Definitions - HIGHLY DYNAMIC */}
            <div className="absolute bottom-full left-0 mb-4 w-full p-8 bg-gray-900 text-white rounded-[32px] shadow-2xl opacity-0 translate-y-4 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0 transition-all duration-500 pointer-events-none z-50 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <h4 className="font-black uppercase tracking-[0.3em] text-brand-amber text-[10px]">Algorithm Benchmarks ({content.platformName})</h4>
                <div className="px-2 py-1 bg-white/5 rounded-md text-[8px] font-bold text-gray-400 tracking-widest">v3.1 ANALYTICS</div>
              </div>
              
              <div className="space-y-8">
                {platformInfo.benchmarks.map((bm, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${bm.color} shadow-lg shadow-black/20`}>
                          {bm.icon}
                        </div>
                        <span className="font-black text-white uppercase tracking-widest text-[10px]">{bm.label}</span>
                      </div>
                      <span className="font-bold text-brand-amber text-[10px] bg-white/10 px-2 py-0.5 rounded">{bm.metric}</span>
                    </div>
                    <span className="text-gray-400 leading-normal text-[11px] pl-8">{bm.outcome}</span>
                  </div>
                ))}
              </div>

              {/* Strategy Footnote */}
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2">
                <Target size={12} className="text-brand-amber" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Optimised for current feed trends</span>
              </div>

              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-[10px] border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Hashtags Section */}
        {content.hashtags && content.hashtags.length > 0 && (
          <div className="pt-8 border-t border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5 text-gray-400 font-black text-xs uppercase tracking-[0.15em]">
                  <Hash size={16} /> <span>SEO Context Tags</span>
                </div>
                <CopyButton 
                  text={content.hashtags.join(' ')} 
                  sectionKey="hashtags" 
                  className="text-gray-400 hover:text-brand-sky"
                />
            </div>
            <div className="flex flex-wrap gap-3">
              {content.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-brand-sky/5 text-brand-sky hover:bg-brand-sky/10 border border-brand-sky/10 px-3 py-1.5 rounded-full transition-all hover:scale-105 cursor-pointer text-[13px] font-black tracking-wide">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ResultCard;