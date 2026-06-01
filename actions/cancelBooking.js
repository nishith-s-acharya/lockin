"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function cancelBooking(bookingId) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
  });
  if (!dbUser) return { error: "User not found" };

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: { interviewer: true, interviewee: true },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.status !== "SCHEDULED") return { error: "Booking is not active" };

  // Only the interviewer can cancel
  if (booking.interviewerId !== dbUser.id) {
    return { error: "Only the interviewer can cancel this booking" };
  }

  // Don't allow cancellation if the call already started (within the time window)
  const now = new Date();
  if (now >= booking.startTime) {
    return { error: "Cannot cancel a booking that has already started" };
  }

  // Transaction: cancel booking + refund credits to interviewee + free availability slot
  await db.$transaction(async (tx) => {
    // 1. Update booking status
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });

    // 2. Refund credits to interviewee
    await tx.user.update({
      where: { id: booking.intervieweeId },
      data: { credits: { increment: booking.creditsCharged } },
    });

    // 3. Remove the earning from interviewer's balance
    await tx.user.update({
      where: { id: booking.interviewerId },
      data: { creditBalance: { decrement: booking.creditsCharged } },
    });

    // 4. Log refund transaction
    await tx.creditTransaction.create({
      data: {
        userId: booking.intervieweeId,
        amount: booking.creditsCharged,
        type: "ADMIN_ADJUSTMENT",
        bookingId: booking.id,
      },
    });

    // 5. Free up the availability slot (find matching slot and set back to AVAILABLE)
    await tx.availability.updateMany({
      where: {
        interviewerId: booking.interviewerId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: "BOOKED",
      },
      data: { status: "AVAILABLE" },
    });
  });

  return { success: true };
}
