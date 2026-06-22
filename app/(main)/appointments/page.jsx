import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getIntervieweeAppointments } from "@/actions/appointments";
import { AppointmentCard } from "@/components/AppointmentCard";
import { db } from "@/lib/prisma";

import { Button } from "@/components/ui/button";
import { CalendarDays, AlertCircle } from "lucide-react";

export default async function MyAppointmentsPage() {
  let user;
  try {
    user = await currentUser();
  } catch {
    redirect("/");
  }
  if (!user) redirect("/");

  const dbUser = await db.user.findUnique({ where: { clerkUserId: user.id } });
  if (!dbUser) redirect("/onboarding");
  if (dbUser.role === "UNASSIGNED") redirect("/onboarding");
  if (dbUser.role === "INTERVIEWER") redirect("/dashboard");

  let appointments = [];
  let error = null;

  try {
    appointments = await getIntervieweeAppointments();
  } catch (err) {
    console.error("Appointments fetch error:", err);
    error = err?.message || "Failed to load appointments";
  }

  const now = new Date();
  const scheduled = appointments.filter(
    (a) => a.status === "SCHEDULED" && new Date(a.startTime) > now
  );
  const past = appointments.filter(
    (a) => a.status !== "SCHEDULED" || new Date(a.endTime) <= now
  );

  return (
    <main className="min-h-screen bg-black">
      {/* Page header */}
      <div className="max-w-6xl mx-auto px-8 lg:px-0 pt-8 pb-4">
        <div className="bg-[#0f0f11] border border-white/10 rounded-2xl p-8">
          <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-4">
            <CalendarDays size={18} className="text-amber-400" />
          </span>
          <h1 className="font-serif text-2xl tracking-tight text-stone-200">
            My Appointments
          </h1>
          <p className="text-xs text-stone-500 font-light mt-1">
            All your scheduled and past sessions.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 lg:px-0 py-8 flex flex-col gap-14">
        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex items-center gap-4">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <div>
              <p className="text-sm text-red-400 font-medium">Failed to load appointments</p>
              <p className="text-xs text-red-400/70 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <span className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-3xl">
              <CalendarDays size={28} className="text-amber-400" />
            </span>
            <div>
              <p className="text-base text-stone-400 font-light">
                No sessions booked yet.
              </p>
              <p className="text-sm text-stone-600 mt-1">
                Browse expert interviewers and book your first session.
              </p>
            </div>
            <Button variant="gold" asChild>
              <Link href="/explore">Browse interviewers →</Link>
            </Button>
          </div>
        )}

        {/* Upcoming */}
        {scheduled.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold text-stone-500 tracking-widest uppercase">
                Upcoming ({scheduled.length})
              </p>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {scheduled.map((b) => (
                <AppointmentCard key={b.id} booking={b} mode="interviewee" />
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <p className="text-xs font-semibold text-stone-500 tracking-widest uppercase">
                Past ({past.length})
              </p>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {past.map((b) => (
                <AppointmentCard
                  key={b.id}
                  booking={b}
                  mode="interviewee"
                  isPast={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}