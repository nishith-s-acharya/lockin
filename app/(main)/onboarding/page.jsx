"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/reuseables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/actions/onboarding";
import { CATEGORIES, ONBOARDING_ROLES, YEARS_OPTIONS } from "@/lib/data";
import useFetch from "@/hooks/use-fetch";

export default function OnboardingPage() {
  const router = useRouter();
  const { data, loading, fn: onboardingFn } = useFetch(completeOnboarding);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    yearsExp: "",
    bio: "",
    categories: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data?.success && !loading) {
      // Full page reload to ensure Header re-fetches the updated role
      window.location.href = role === "INTERVIEWER" ? "/dashboard" : "/explore";
    }
  }, [data, loading]);

  const toggleCategory = (val) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(val)
        ? prev.categories.filter((c) => c !== val)
        : [...prev.categories, val],
    }));
  };

  const isInterviewerValid =
    form.title.trim() &&
    form.company.trim() &&
    form.yearsExp &&
    form.bio.trim() &&
    form.categories.length > 0;

  const canSubmit =
    role === "INTERVIEWEE" || (role === "INTERVIEWER" && isInterviewerValid);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    onboardingFn({
      role,
      ...(role === "INTERVIEWER" && {
        title: form.title,
        company: form.company,
        yearsExp: Number(form.yearsExp),
        bio: form.bio,
        categories: form.categories,
      }),
    });


  };

  return (
    <main className="min-h-screen bg-black px-6 py-24 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-xl text-center relative z-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <SectionLabel>Welcome</SectionLabel>
          <h1 className="font-serif text-5xl leading-tight tracking-tighter mt-1">
            <GrayTitle>How will you be</GrayTitle>
            <br />
            <GoldTitle>using LockIn?</GoldTitle>
          </h1>
          <p className="text-sm text-stone-500 font-light mt-4 leading-relaxed max-w-md mx-auto">
            This helps us personalise your experience. You can&apos;t change this later.
          </p>
        </div>

        {/* Step 1: Role selection */}
        {!role && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full animate-in fade-in duration-300">
            {ONBOARDING_ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className="text-left rounded-2xl p-6 border border-white/5 bg-[#0f0f11] hover:border-amber-400/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-start cursor-pointer group"
              >
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 border transition duration-300 ${r.value === 'INTERVIEWEE'
                    ? 'bg-pink-500/10 border-pink-500/20 text-pink-400 group-hover:bg-pink-500/20 group-hover:border-pink-500/35'
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/35'
                  }`}>
                  {r.icon}
                </span>
                <h3 className="font-serif text-xl tracking-tight text-stone-200 group-hover:text-amber-400 transition duration-300">
                  {r.title}
                </h3>
                <p className="text-xs text-stone-500 font-light mt-2 leading-relaxed">
                  {r.desc}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Selected Role State */}
        {role && (
          <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-[#0f0f11] backdrop-blur-md transition duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border ${role === 'INTERVIEWEE'
                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 shadow-lg shadow-pink-500/5'
                    : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-lg shadow-indigo-500/5'
                  }`}>
                  {role === 'INTERVIEWEE' ? '🎯' : '🧑‍💼'}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-stone-200 text-base leading-tight">
                    {role === 'INTERVIEWEE' ? 'I want to practice' : 'I want to interview'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">Selected role</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRole(null)}
                className="border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/20 text-stone-200 text-xs py-2 px-4 rounded-xl transition duration-200 cursor-pointer font-medium"
              >
                Change
              </button>
            </div>

            {/* Step 2: Interviewee direct submit / button */}
            {role === "INTERVIEWEE" && (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#f59e0b] hover:bg-amber-500 text-black font-semibold rounded-2xl h-14 text-base shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition duration-300 cursor-pointer"
              >
                {loading ? "Saving..." : "Go to dashboard →"}
              </Button>
            )}

            {/* Step 2: Interviewer details form */}
            {role === "INTERVIEWER" && (
              <div className="space-y-6 p-6 rounded-3xl border border-white/5 bg-[#0a0a0c]/85 backdrop-blur-lg text-left shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="title" className="text-stone-300 text-sm font-medium">Current title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Senior Software Engineer"
                      value={form.title}
                      onChange={handleChange}
                      className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="company" className="text-stone-300 text-sm font-medium">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Google, Meta, Startup…"
                      value={form.company}
                      onChange={handleChange}
                      className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-300 text-sm font-medium">Years of Experience</Label>
                  <div className="flex flex-wrap gap-2">
                    {YEARS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, yearsExp: String(opt.value) }))
                        }
                        className={`text-xs px-4 py-2 rounded-lg border transition duration-200 cursor-pointer ${form.yearsExp === String(opt.value)
                            ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                            : "border-white/10 text-stone-500 hover:border-white/20"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-300 text-sm font-medium">Categories you can interview for</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      if (!cat?.value) return null;
                      const active = form.categories.includes(cat.value);
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => toggleCategory(cat.value)}
                          className={`text-xs px-4 py-2 rounded-lg border transition duration-200 cursor-pointer ${active
                              ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                              : "border-white/10 text-stone-500 hover:border-white/20"
                            }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-stone-300 text-sm font-medium">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    maxLength={300}
                    placeholder="Tell interviewees about your background, what you specialise in, and what they can expect from a session with you."
                    value={form.bio}
                    onChange={handleChange}
                    className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50"
                  />
                </div>

                <Button
                  variant="gold"
                  onClick={handleSubmit}
                  disabled={!canSubmit || loading}
                  className="w-full bg-[#f59e0b] hover:bg-amber-500 text-black font-semibold rounded-2xl h-14 text-base shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 transition duration-300 cursor-pointer"
                >
                  {loading
                    ? "Setting up your account…"
                    : role === "INTERVIEWER"
                      ?
                      "Create interviewer profile →" : "Go To Explore"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}