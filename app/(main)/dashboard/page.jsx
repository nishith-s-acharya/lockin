import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/reuseables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAvailability,
  getInterviewerAppointments,
  getInterviewerStats,
  getWithdrawalHistory,
} from "@/actions/dashboard";
import { getInterviewerProfile2 } from "@/actions/profile";
import AvailabilitySection from "./_components/AvailabilitySection";
import AppointmentsSection from "./_components/AppointmentsSection";
import EarningsSection from "./_components/EarningsSection";
import EditProfileDialog from "./_components/EditProfileDialog";
import { ClipboardList, Clock, Wallet, ArrowRight, Search } from "lucide-react";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InterviewerDashboardPage() {
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
  if (dbUser.role !== "INTERVIEWER") redirect("/appointments");

  const [availability, appointments, stats, withdrawalHistory, profile] =
    await Promise.all([
      getAvailability(),
      getInterviewerAppointments(),
      getInterviewerStats(),
      getWithdrawalHistory(),
      getInterviewerProfile2(),
    ]);

  return (
    <main className="min-h-screen bg-black">
      {/* Page header */}
      <PageHeader
        label="Interviewer dashboard"
        gray="Welcome back,"
        gold={dbUser.name?.split(" ")[0] ?? "Interviewer"}
        description={
          dbUser.title && dbUser.company
            ? `${dbUser.title} · ${dbUser.company}`
            : undefined
        }
        right={
          <div className="flex items-center gap-5">
            <EditProfileDialog profile={profile} />
            <div>
              <p className="text-xs text-stone-600">Credit balance</p>
              <p className="font-serif text-3xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-right">
                {stats?.creditBalance ?? 0}
              </p>
            </div>
          </div>
        }
      />

      {/* Tabbed content */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <Tabs defaultValue="earnings">
          <TabsList className="bg-[#0f0f11] border border-white/10 mb-8 w-full">
            <TabsTrigger value="earnings" className="p-5">
              <Wallet size={16} className="text-amber-400" /> Earnings
            </TabsTrigger>
            <TabsTrigger value="appointments" className="p-5">
              <ClipboardList size={18} className="text-amber-400" />{" "}
              Appointments
            </TabsTrigger>
            <TabsTrigger value="availability" className="p-5">
              <Clock size={18} className="text-amber-400" /> Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsSection appointments={appointments} />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySection initial={availability} />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsSection stats={stats} history={withdrawalHistory} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer CTA */}
      <footer className="relative border-t border-white/8 overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 -translate-x-1/2 -top-32 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-8 py-16 flex flex-col items-center text-center gap-6">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 tracking-[0.14em] uppercase">
            <span className="w-4 h-px bg-amber-400" />
            Quick actions
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl tracking-tight">
            <span className="bg-linear-to-br from-stone-100 via-stone-300 to-stone-500 bg-clip-text text-transparent">
              Ready to&nbsp;
            </span>
            <span className="bg-linear-to-br from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              take the next step?
            </span>
          </h2>

          <p className="text-sm text-stone-500 max-w-md leading-relaxed">
            Start a new interview session or explore available interviewers to
            book your next practice round.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link href="/explore">
              <Button variant="gold" size="hero">
                Get Started
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Link href="/interviewers">
              <Button variant="outline" size="hero">
                <Search size={16} className="mr-1" />
                Browse Interviewers
              </Button>
            </Link>
          </div>

          <p className="text-xs text-stone-700 mt-6">
            © {new Date().getFullYear()} LockIn. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}