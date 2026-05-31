"use client"
import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight,Bot,Check,Wallet,Clock,MessageCircle,Lock,BarChart3,Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AI_TAGS, AVATARS, LOGOS, ROLES } from "@/lib/data";
import { GrayTitle,GoldTitle,SectionLabel,SectionHeading } from "@/components/reuseables";
import { CodeDemo } from "@/components/demo-component-code";
import { PricingTable } from "@clerk/nextjs";
import { BentoCard } from "@/components/ui/bentoCard";



export default function Home() {
  return (
    <div className="bg-black">

      {/* Hero section */}

      <section className="pt-28 sm:pt-32 relative min-h-screen grid grid-cols-1 lg:grid-cols-5 px-4 sm:px-8 pb-20 overflow-hidden">
        <GravityStarsBackground className={"absolute z-10"} />
        {/* <GrayTitle>Welcome to Path</GrayTitle>
        <GoldTitle>Welcome to Path</GoldTitle>
        <SectionLabel>Welcome to Path</SectionLabel> */}
        <div className="relative z-10 col-span-full lg:col-span-3 flex flex-col items-center justify-center text-center lg:-rotate-2 pointer-events-none" >
          <Badge variant="gold">LockIn is now live</Badge>
          <h1 className="font-serif relative text-5xl sm:text-6xl lg:text-7xl tracking-tighter max-w-4xl">
            <GrayTitle>Interview on your schedule</GrayTitle>
            <GoldTitle>with industry experts</GoldTitle>
          </h1>
         <p className="relative text-sm sm:text-base md:text-lg text-stone-400 max-w-xl mt-6 leading-relaxed pointer-events-none">
            Wish you could get AI-powered feedback with specific questions from a senior engineer at top companies in 21 more countries, and have the conference land you a dream job.
          </p> 

          <div className="relative flex justify-center gap-2 sm:gap-4 mt-10 sm:w-auto pointer-events-auto">
            <Link href="/onboarding">
            <Button variant="gold" size="hero">Get Started</Button>
            </Link>
            <Link href="/explore">
            <Button variant="outline" size="hero">Browse Interviews </Button>
            </Link>
          </div>
          <div className="relative flex items-center justify-center gap-3 sm:gap-5 mt-8 sm:mt-16  ">
{/* icons  */}  <div className="flex" >
  {AVATARS.map((av,i)=>(
    <div key={i} className="rounded-full overflow-hidden h-8 w-8 border border-white/10 -ml-3 first:ml-0" >
        <Image src={av.src} alt="Avatar" width={50} height={50} className="w-full h-full object-cover" />
      </div>
  ))}
</div>
            <p className="text-sm text-stone-500 text-center sm:text-left">
              <strong className="text-stone-400 font-medium">100+</strong>
              {" "}
              cracked interviews at top companies and counting

            </p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-2 flex items-center justify-center lg:justify-start mt-2 lg:mt-0 lg:rotate-3">
          <CodeDemo />
            
        </div>

      </section>

      <section className="relative z-10 border-y border-white/10 py-14 flex flex-col items-center justify-center gap-5" >
      <p className="text-center text-xs font-medium tracking-widest text-stone-400 ">Companies trust LockIn to shape the future of recruitment.</p>
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 sm:gap-23 pt-2" >
       {LOGOS.map((logo, index)=>(
        <Image
        key={logo.alt || index}
        src={logo.src}
        alt={logo.alt}
        width={50}
        height={50}
        className="h-6 w-auto opacity-60 grayscale"
        />
       ))}
      </div>

     

      
      </section>

      <section className="relative z-10 py-28 max-w-5xl mx-auto px-6">


        <div className="text-center mb-16">
            <SectionLabel>Core Features</SectionLabel>
            <SectionHeading gray="Everything you need " gold="to crack the interview" />
        </div>

         <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <BentoCard
            icon={<Bot size={20} className="text-amber-400"></Bot>}
            title={<GrayTitle>AI Question Generator</GrayTitle>}
            desc="AI-generated questions with guidance and difficulty scaling tailored to your level."
            >
              <div className="flex flex-wrap gap-2 mt-5">
                  {AI_TAGS.map((t) => (
                      <Badge key={t.label} variant={t.active ? "gold" : "outline"}>
                          {t.label}
                      </Badge>
                  ))}
              </div>
            </BentoCard>
          </div>
        
          <div className="col-span-12 md:col-span-5">
              <BentoCard
                icon={<Wallet size={16} className="text-amber-400" />}
                title={<GrayTitle>Credit System</GrayTitle>}
                desc="Subscribe for monthly credits. Book sessions. Interviewers earn and withdraw any time."
              >
                <div className="mt-5 rounded-xl bg-[#141417] border border-white/10 p-5 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-stone-600 mb-1">Your balance</p>
                    <p className="font-serif text-4xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
                      28
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      credits remaining
                    </p>
                  </div>

                  <Badge variant="secondary">+10 this month</Badge>
                </div>
              </BentoCard>
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon={<span className="text-xl">📹</span>}
              title="HD Video Calls"
              desc="Powered by Stream. Screen sharing, recording, and instant playback links — all built in."
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon={<span className="text-xl">💬</span>}
              title="Persistent Chat"
              desc="Message your interviewer before and after the call. Share resources, prep notes, and follow-ups in one thread."
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <BentoCard
              icon={<span className="text-xl">🔒</span>}
              title="Security by Arcjet"
              desc="Bot protection, rate limiting, and abuse prevention baked into every API route."
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <BentoCard
              icon={<span className="text-xl">📊</span>}
              title={<GrayTitle>AI Feedback Reports</GrayTitle>}
              desc="Post-interview analysis by Gemini with actionable insights."
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <BentoCard
              icon={<span className="text-xl">🗓️</span>}
              title={<GoldTitle>Slot-based Scheduling</GoldTitle>}
              desc="Interviewers set availability once. Interviewees pick from open slots and confirm with one click — no back-and-forth needed."
            />
          </div>
        </div>
         <div className="text-center mb-16 mt-10">
            <SectionLabel>who it&apos;s for</SectionLabel>
            <SectionHeading gray="build for both sides " gold="of the table " />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
         {ROLES.map((role)=>(
          <div
            key = {role.label}
            className="relative bg-[#0f0f11] border border-white/10 hover:border-amber-400/20 rounded-2xl p-12 h-full transition duration-300 overflow-hidden"
          >
            <span
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 tracking-widest uppercase border border-amber-200/20 bg-amber-400/10 rounded-full px-3 py-1.5 mb-5 "
            >
              <ArrowRight></ArrowRight>
              {role.label}</span>
            <h3 className="font-serif font-medium text-xl text-stone-200 mb-3" >{role.title}</h3>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">{role.desc}</p>

            <ul className="space-y-4 mt-8">
              {role.perks.map(p=>(
               <li key={p} className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>{p}</span>
               </li>
              ))}
            </ul>

          </div>
         ))}
        </div>
      </section>


      <section>

      </section>

      <section className="relative pb-28 max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <SectionLabel>Pricing</SectionLabel>
          <SectionHeading gray="Simple, transparent" gold="credit-based plans" />
          <p className="text-stone-400 mt-3 text-sm" >Each credit = one session. Unused credits roll over, no hidden fees.</p>
        </div>
        <div className="w-full mt-10">
          <PricingTable
            appearance={{
              variables: {
                colorPrimary: "#f59e0b",
                colorBackground: "#0f0f11",
                colorForeground: "#e7e5e4",
                colorMutedForeground: "#a8a29e",
                colorMuted: "#1c1c1f",
                colorNeutral: "#292524",
                colorBorder: "rgba(255, 255, 255, 0.10)",
                colorInput: "#141417",
                colorInputForeground: "#e7e5e4",
                colorShadow: "rgba(0, 0, 0, 0.4)",
                colorRing: "#f59e0b",
                borderRadius: "0.75rem",
                fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
              },
            }}
          />
        </div>
        

      </section>
      {/* price cardss */}
     
    
    </div>
  );
}
