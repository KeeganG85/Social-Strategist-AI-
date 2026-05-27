import React from 'react';

interface LandingPageProps {
  onGoToPricing: () => void;
  onStartFree: () => void;
}

export default function LandingPage({ onGoToPricing, onStartFree }: LandingPageProps) {
  return (
    <div className="font-[Georgia,serif] bg-[#0D0D0D] text-white min-h-screen">
      {/* HERO */}
      <div className="pt-[100px] px-6 md:px-12 pb-[80px] flex flex-col items-start max-w-[700px] gap-6">
        <span className="text-[10px] tracking-[0.28em] text-[#F5A623] font-mono uppercase">AI-Powered Content Strategy</span>
        <h1 className="text-4xl md:text-[52px] font-normal leading-[1.1] m-0 tracking-[-0.02em]">
          Turn one image into a<br />
          <span className="text-[#F5A623] italic">full campaign strategy.</span>
        </h1>
        <p className="text-base text-[#888888] leading-[1.7] max-w-[520px] m-0 font-mono">
          Upload your visual asset. Social Strategist AI analyses it, reverse-engineers a prompt,
          and generates platform-specific hooks, copy, and forecasts — in seconds.
        </p>
        <div className="flex flex-wrap gap-4 items-center mt-2">
          <button className="bg-[#F5A623] text-[#0D0D0D] text-[11px] tracking-[0.14em] px-7 py-[13px] font-mono font-bold cursor-pointer border-none hover:bg-[#e0961f] transition-colors" onClick={onStartFree}>Start Free — 14 Days</button>
          <button className="bg-transparent text-white text-[11px] tracking-[0.14em] px-7 py-[13px] font-mono cursor-pointer border border-[#2A2A2A] hover:bg-[#141414] transition-colors" onClick={onGoToPricing}>View Pricing →</button>
        </div>
      </div>

      {/* STAT STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-[#2A2A2A]">
        {[
          { num: "6", label: "Platforms", desc: "Instagram, Facebook, LinkedIn, TikTok, X, Pinterest — one upload, all covered." },
          { num: "∞", label: "Strategies", desc: "Pro and Agency users generate unlimited campaign packs with zero throttling." },
          { num: "14", label: "Days Free", desc: "Full feature access. No credit card required to experience what it can do." },
        ].map((f, i) => (
          <div key={i} className={`p-8 md:p-10 flex flex-col gap-3 ${i !== 2 ? 'md:border-r border-[#2A2A2A]' : ''} ${i !== 2 ? 'border-b md:border-b-0 border-[#2A2A2A]' : ''}`}>
            <div className="text-[32px] text-[#F5A623] font-mono font-bold">{f.num}</div>
            <div className="text-[11px] tracking-[0.18em] text-[#888888] uppercase font-mono">{f.label}</div>
            <div className="text-[13px] text-[#AAAAAA] leading-[1.6] font-mono">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div className="py-[80px] px-6 md:px-12 max-w-[900px]">
        <div className="text-[10px] tracking-[0.28em] text-[#F5A623] font-mono uppercase mb-4">Process</div>
        <h2 className="text-3xl md:text-[36px] font-normal tracking-[-0.01em] m-0 mb-12">Three steps from asset to strategy.</h2>
        <div className="flex flex-col gap-0">
          {[
            { n: "01", title: "Upload Your Visual Asset", desc: "Drop in any high-res image — product shot, lifestyle photo, campaign creative. PNG, JPG, or WEBP." },
            { n: "02", title: "Configure Your Parameters", desc: "Select target platforms, set your goal (Awareness, Leads, Sales), choose tone and hook style." },
            { n: "03", title: "Receive Your Strategy Pack", desc: "Get platform-specific hooks, caption copy, display text, hashtags, and an engagement forecast. Save to your Strategy Library." },
          ].map((s, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-7 border-b border-[#2A2A2A] items-start">
              <span className="text-[11px] text-[#F5A623] font-mono w-8 pt-1 shrink-0">{s.n}</span>
              <div>
                <div className="text-base font-semibold mb-1.5">{s.title}</div>
                <div className="text-[13px] text-[#888888] leading-[1.6] font-mono">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="py-[80px] px-6 md:px-12 bg-[#141414] border-t border-[#2A2A2A]">
        <div className="text-[10px] tracking-[0.28em] text-[#F5A623] font-mono uppercase mb-4">Results</div>
        <h2 className="text-3xl md:text-[36px] font-normal tracking-[-0.01em] m-0">Built for marketers who don't guess.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { quote: "We cut our content planning time by two thirds. It's like having a senior strategist on call at 2am.", meta: "Agency Owner, Cape Town" },
            { quote: "The engagement forecasts are eerily accurate. I stopped second-guessing my hooks.", meta: "Freelance Content Strategist" },
            { quote: "Finally a tool that gets that LinkedIn and TikTok need completely different angles on the same product.", meta: "Head of Marketing, E-commerce" },
          ].map((p, i) => (
            <div key={i} className="p-7 border border-[#2A2A2A] bg-[#1A1A1A]">
              <p className="text-sm leading-[1.7] mb-5 text-[#CCCCCC]">"{p.quote}"</p>
              <div className="text-[11px] tracking-[0.1em] text-[#F5A623] font-mono uppercase">— {p.meta}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="py-[80px] px-6 md:px-12 border-t border-[#2A2A2A] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="text-2xl md:text-[28px] font-normal max-w-[480px] leading-[1.3]">Ready to stop guessing what content will perform?</div>
        <button className="bg-[#F5A623] text-[#0D0D0D] text-[12px] tracking-[0.14em] px-9 py-[15px] font-mono font-bold cursor-pointer border-none hover:bg-[#e0961f] transition-colors" onClick={onGoToPricing}>
          See Pricing & Start Free →
        </button>
      </div>
    </div>
  );
}
