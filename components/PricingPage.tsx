import React, { useState } from 'react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: "Starter",
      monthly: 19,
      annual: 15,
      desc: "For solo creators testing the waters.",
      features: [
        { text: "15 strategy generations / month", active: true },
        { text: "3 platforms per run", active: true },
        { text: "Strategy Library (10 saved)", active: true },
        { text: "Reverse engineer prompt", active: true },
        { text: "Priority speed", active: false },
        { text: "All 6 platforms", active: false },
        { text: "Multiple workspaces", active: false },
      ],
      cta: "Start Free Trial",
      featured: false,
    },
    {
      name: "Pro",
      monthly: 49,
      annual: 39,
      desc: "For marketers and growing brands.",
      features: [
        { text: "Unlimited generations", active: true },
        { text: "All 6 platforms", active: true },
        { text: "Full Strategy Library", active: true },
        { text: "Reverse engineer prompt", active: true },
        { text: "Priority generation speed", active: true },
        { text: "Advanced analytics forecast", active: true },
        { text: "Multiple workspaces", active: false },
      ],
      cta: "Start Free Trial",
      featured: true,
    },
    {
      name: "Agency",
      monthly: 129,
      annual: 99,
      desc: "For agencies running multiple brands.",
      features: [
        { text: "Everything in Pro", active: true },
        { text: "5 brand workspaces", active: true },
        { text: "2–3 team seats", active: true },
        { text: "White-label (coming soon)", active: true },
        { text: "API access (roadmap)", active: true },
        { text: "Dedicated onboarding", active: true },
        { text: "Priority support", active: true },
      ],
      cta: "Contact Sales",
      featured: false,
    },
  ];

  return (
    <div className="font-[Georgia,serif] bg-[#0D0D0D] text-white min-h-screen pb-20">
      {/* PRICING HERO */}
      <div className="pt-[80px] px-6 md:px-12 pb-[60px] text-center">
        <div className="text-[10px] tracking-[0.28em] text-[#F5A623] font-mono uppercase mb-4">Pricing</div>
        <h1 className="text-4xl md:text-[44px] font-normal tracking-[-0.02em] mb-4">Simple, transparent pricing.</h1>
        <p className="text-sm text-[#888888] font-mono mb-2">Start free for 14 days. No credit card required. Cancel any time.</p>
        
        {/* Annual toggle */}
        <div className="flex justify-center my-8">
          <button
            className={`px-6 py-2.5 text-[11px] tracking-[0.12em] font-mono uppercase cursor-pointer border border-[#2A2A2A] transition-colors ${!annual ? 'bg-[#F5A623] text-[#0D0D0D] border-[#F5A623] font-bold' : 'bg-transparent text-[#888888] hover:bg-[#141414]'}`}
            onClick={() => setAnnual(false)}
          >Monthly</button>
          <button
            className={`px-6 py-2.5 text-[11px] tracking-[0.12em] font-mono uppercase cursor-pointer border border-[#2A2A2A] border-l-0 transition-colors ${annual ? 'bg-[#F5A623] text-[#0D0D0D] border-[#F5A623] font-bold' : 'bg-transparent text-[#888888] hover:bg-[#141414]'}`}
            onClick={() => setAnnual(true)}
          >Annual <span className={`ml-1 ${annual ? 'text-[#0D0D0D]' : 'text-[#F5A623]'}`}>Save ~20%</span></button>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] mx-6 md:mx-12 bg-[#2A2A2A]">
        {tiers.map((tier, i) => (
          <div key={i} className={`p-8 md:p-10 flex flex-col ${tier.featured ? 'bg-[#1C1600] outline outline-1 outline-[#F5A623] z-10' : 'bg-[#1A1A1A]'}`}>
            {tier.featured ? (
              <div className="text-[9px] tracking-[0.2em] text-[#0D0D0D] bg-[#F5A623] px-2.5 py-1 font-mono uppercase self-start mb-5">Most Popular</div>
            ) : (
              <div className="h-[29px] mb-5" />
            )}
            <div className="text-[11px] tracking-[0.2em] text-[#888888] font-mono uppercase mb-3">{tier.name}</div>
            <div className="text-[44px] font-normal mb-1">
              <span className="text-[20px] align-top leading-[2.4] text-[#888888]">$</span>
              {annual ? tier.annual : tier.monthly}
            </div>
            <div className="text-[13px] text-[#888888] font-mono mb-7">/ month{annual ? ", billed annually" : ""}</div>
            <div className="text-[12px] text-[#888888] font-mono mb-6">{tier.desc}</div>
            <div className="h-[1px] bg-[#2A2A2A] my-6" />
            <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3 flex-grow">
              {tier.features.map((f, j) => (
                <li key={j} className={`text-[12px] font-mono flex gap-2.5 items-start ${f.active ? 'text-[#CCCCCC]' : 'text-[#888888]'}`}>
                  <span className={`shrink-0 ${f.active ? 'text-[#F5A623]' : 'text-[#444444]'}`}>
                    {f.active ? "✓" : "—"}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
            <button className={`mt-auto py-[13px] text-[11px] tracking-[0.14em] font-mono uppercase cursor-pointer w-full transition-colors ${tier.featured ? 'bg-[#F5A623] text-[#0D0D0D] border-none font-bold hover:bg-[#e0961f]' : 'bg-transparent text-white border border-[#2A2A2A] hover:bg-[#2A2A2A]'}`}>
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      {/* GUARANTEE */}
      <div className="mx-6 md:mx-12 my-10 p-8 md:p-10 border border-[#2A2A2A] flex flex-col md:flex-row gap-6 items-start md:items-center bg-[#141414]">
        <div className="text-[32px] shrink-0">⚡</div>
        <div className="text-[13px] text-[#CCCCCC] font-mono leading-[1.7]">
          <strong className="text-white">14-day free trial on all plans.</strong> Full feature access from day one. 
          If you decide it's not for you, simply cancel before your trial ends — you won't be charged a cent. 
          No awkward emails, no cancellation fees. Just click and done.
        </div>
      </div>

      {/* FAQ */}
      <div className="py-[80px] px-6 md:px-12">
        <div className="text-[10px] tracking-[0.28em] text-[#F5A623] font-mono uppercase mb-4">FAQ</div>
        <h2 className="text-3xl md:text-[36px] font-normal tracking-[-0.01em] m-0">Questions worth answering upfront.</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#2A2A2A] mt-10">
          {[
            { q: "What counts as a 'generation'?", a: "Each time you click Generate Strategy, that counts as one generation. Regenerating a full strategy pack also counts as one. Copying or saving previously generated strategies does not." },
            { q: "Can I switch plans mid-month?", a: "Yes. Upgrades take effect immediately and are prorated. Downgrades apply at the start of your next billing cycle." },
            { q: "What platforms are supported?", a: "Currently: Instagram, Facebook, LinkedIn, TikTok, X (Twitter), and Pinterest. Starter tier includes 3 per run; Pro and Agency get all 6." },
            { q: "Is there a long-term contract?", a: "No. Monthly plans are month-to-month. Annual plans are paid upfront for the year at a ~20% discount and are non-refundable after 14 days." },
            { q: "What does 'Agency workspace' mean?", a: "Workspaces let you separate brand contexts — different industry settings, strategy libraries, and team access per workspace. Agency tier includes 5." },
            { q: "Do you offer refunds?", a: "We offer a full refund if you cancel within the first 14 days of a paid plan. After that, we don't issue partial refunds, but you keep access until the period ends." },
          ].map((faq, i) => (
            <div key={i} className="p-7 md:p-8 bg-[#1A1A1A]">
              <div className="text-[13px] font-semibold mb-2.5">{faq.q}</div>
              <div className="text-[12px] text-[#888888] font-mono leading-[1.7]">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
