import React from "react";
import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import InterviewerDashboard from "@/components/InterviewerDashboard";
import IntervieweeDashboard from "@/components/IntervieweeDashboard";

export const metadata = {
  title: "Dashboard - PrepTron",
  description: "Manage your mock interviews, check schedules, earnings, and AI feedback.",
};

export default async function DashboardPage() {
  const user = await checkUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Redirect uncompleted onboarding users
  if (user.role === "UNASSIGNED") {
    redirect("/onboarding");
  }

  if (user.role === "INTERVIEWER") {
    // Load Interviewer Relational Data
    const bookings = await db.booking.findMany({
      where: { interviewerId: user.id },
      include: {
        interviewee: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
        feedback: true,
      },
      orderBy: { startTime: "desc" },
    });

    const availabilities = await db.availability.findMany({
      where: { interviewerId: user.id },
      orderBy: { startTime: "asc" },
    });

    const payouts = await db.payout.findMany({
      where: { interviewerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return (
      <div className="container mx-auto px-4 py-8">
        <InterviewerDashboard
          user={JSON.parse(JSON.stringify(user))}
          bookings={JSON.parse(JSON.stringify(bookings))}
          availabilities={JSON.parse(JSON.stringify(availabilities))}
          payouts={JSON.parse(JSON.stringify(payouts))}
        />
      </div>
    );
  }

  // INTERVIEWEE dashboard
  const bookings = await db.booking.findMany({
    where: { intervieweeId: user.id },
    include: {
      interviewer: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          title: true,
          company: true,
        },
      },
      feedback: true,
    },
    orderBy: { startTime: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <IntervieweeDashboard
        user={JSON.parse(JSON.stringify(user))}
        bookings={JSON.parse(JSON.stringify(bookings))}
      />
    </div>
  );
}
