"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, CalendarClock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallTimeGuard({ type, startTime, endTime, callId }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [canJoin, setCanJoin] = useState(false);

  const start = new Date(startTime);
  const end = new Date(endTime);

  useEffect(() => {
    if (type !== "early") return;

    const earlyJoinMs = 10 * 60 * 1000; // 10 min early buffer
    const windowStart = new Date(start.getTime() - earlyJoinMs);

    const tick = () => {
      const now = new Date();
      const diff = windowStart.getTime() - now.getTime();

      if (diff <= 0) {
        setCanJoin(true);
        setTimeLeft("You can join now!");
        clearInterval(interval);
        // Auto-reload after a brief pause
        setTimeout(() => router.refresh(), 1000);
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      } else if (mins > 0) {
        setTimeLeft(`${mins}m ${secs}s`);
      } else {
        setTimeLeft(`${secs}s`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [type, start, router]);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date) =>
    date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div
          className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center border ${
            type === "early"
              ? "bg-amber-400/10 border-amber-400/20"
              : "bg-red-400/10 border-red-400/20"
          }`}
        >
          {type === "early" ? (
            <CalendarClock
              size={32}
              className="text-amber-400"
            />
          ) : (
            <Clock size={32} className="text-red-400" />
          )}
        </div>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-stone-100">
            {type === "early"
              ? "Call hasn't started yet"
              : "This call has ended"}
          </h1>
          <p className="text-stone-500 text-sm mt-2 leading-relaxed">
            {type === "early"
              ? "Your interview session hasn't started yet. You can join 10 minutes before the scheduled time."
              : "This interview session has concluded. Check your appointments for upcoming sessions."}
          </p>
        </div>

        {/* Schedule details */}
        <div className="rounded-2xl border border-white/10 bg-[#0f0f11] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-600 uppercase tracking-wider">
              Scheduled
            </span>
            <span className="text-xs text-stone-500">
              {formatDate(start)}
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-400">Start</span>
            <span className="text-sm text-stone-200 font-medium">
              {formatTime(start)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-400">End</span>
            <span className="text-sm text-stone-200 font-medium">
              {formatTime(end)}
            </span>
          </div>
        </div>

        {/* Countdown (early only) */}
        {type === "early" && (
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="text-xs text-amber-400/70 uppercase tracking-wider mb-2">
              {canJoin ? "Ready!" : "Starts in"}
            </p>
            <p
              className={`font-serif text-4xl tracking-tight ${
                canJoin ? "text-green-400" : "text-amber-400"
              }`}
            >
              {timeLeft}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {canJoin ? (
            <Button
              onClick={() => router.refresh()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold"
            >
              Join Call Now
            </Button>
          ) : (
            <Link href="/appointments" className="w-full">
              <Button
                variant="outline"
                className="w-full border-white/10 text-stone-300 hover:border-amber-400/30 hover:text-amber-400"
              >
                <ArrowLeft size={14} className="mr-2" />
                Back to Appointments
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
