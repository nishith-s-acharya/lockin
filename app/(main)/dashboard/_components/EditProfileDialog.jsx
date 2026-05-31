"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CATEGORIES, YEARS_OPTIONS } from "@/lib/data";
import { updateInterviewerProfile } from "@/actions/profile";
import useFetch from "@/hooks/use-fetch";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function EditProfileDialog({ profile }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    yearsExp: "",
    bio: "",
    categories: [],
    creditRate: "",
  });

  // Seed form when dialog opens
  useEffect(() => {
    if (open && profile) {
      setForm({
        title: profile.title ?? "",
        company: profile.company ?? "",
        yearsExp: profile.yearsExp ? String(profile.yearsExp) : "",
        bio: profile.bio ?? "",
        categories: profile.categories ?? [],
        creditRate: profile.creditRate ? String(profile.creditRate) : "1",
      });
    }
  }, [open, profile]);

  const { loading, fn: updateFn } = useFetch(updateInterviewerProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (val) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(val)
        ? prev.categories.filter((c) => c !== val)
        : [...prev.categories, val],
    }));
  };

  const isValid =
    form.title.trim() &&
    form.company.trim() &&
    form.yearsExp &&
    form.bio.trim() &&
    form.categories.length > 0 &&
    Number(form.creditRate) >= 1;

  const handleSubmit = async () => {
    if (!isValid) return;
    await updateFn({
      title: form.title,
      company: form.company,
      yearsExp: Number(form.yearsExp),
      bio: form.bio,
      categories: form.categories,
      creditRate: Number(form.creditRate),
    });
    toast.success("Profile updated");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 text-stone-300 hover:border-amber-400/30 hover:text-amber-400 transition-all duration-300 cursor-pointer"
        >
          <Pencil size={14} />
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-[#0f0f11] border border-white/10 text-stone-200 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-stone-100 font-serif text-xl">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-stone-500">
            Update your interviewer details. Changes are visible to
            interviewees immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-title" className="text-stone-300 text-sm font-medium">
                Current title
              </Label>
              <Input
                id="edit-title"
                name="title"
                placeholder="Senior Software Engineer"
                value={form.title}
                onChange={handleChange}
                className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50 text-stone-100"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-company" className="text-stone-300 text-sm font-medium">
                Company
              </Label>
              <Input
                id="edit-company"
                name="company"
                placeholder="Google, Meta, Startup…"
                value={form.company}
                onChange={handleChange}
                className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50 text-stone-100"
              />
            </div>
          </div>

          {/* Years of experience */}
          <div className="space-y-2">
            <Label className="text-stone-300 text-sm font-medium">
              Years of Experience
            </Label>
            <div className="flex flex-wrap gap-2">
              {YEARS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      yearsExp: String(opt.value),
                    }))
                  }
                  className={`text-xs px-4 py-2 rounded-lg border transition duration-200 cursor-pointer ${
                    form.yearsExp === String(opt.value)
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                      : "border-white/10 text-stone-500 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label className="text-stone-300 text-sm font-medium">
              Interview categories
            </Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                if (!cat?.value) return null;
                const active = form.categories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={`text-xs px-4 py-2 rounded-lg border transition duration-200 cursor-pointer ${
                      active
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

          {/* Credit Rate */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-creditRate" className="text-stone-300 text-sm font-medium">
              Credits per session
            </Label>
            <Input
              id="edit-creditRate"
              name="creditRate"
              type="number"
              min={1}
              max={100}
              placeholder="1"
              value={form.creditRate}
              onChange={handleChange}
              className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50 text-stone-100 w-32"
            />
            <p className="text-xs text-stone-600">
              How many credits an interviewee pays to book a session with you.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="edit-bio" className="text-stone-300 text-sm font-medium">
              Bio
            </Label>
            <Textarea
              id="edit-bio"
              name="bio"
              rows={4}
              maxLength={300}
              placeholder="Tell interviewees about your background…"
              value={form.bio}
              onChange={handleChange}
              className="rounded-xl border-white/10 bg-white/5 focus:border-amber-400/50 text-stone-100"
            />
            <p className="text-xs text-stone-600 text-right">
              {form.bio.length}/300
            </p>
          </div>
        </div>

        <DialogFooter className="bg-transparent border-white/5">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-white/10 text-stone-400 hover:text-stone-200 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="bg-amber-500 hover:bg-amber-400 text-black font-semibold cursor-pointer"
          >
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
