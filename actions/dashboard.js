"use server"

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper to check user auth
async function checkAuth() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// 1. Add Availability Slot
export async function addAvailability({ startTime, endTime }) {
  try {
    const user = await checkAuth();
    if (user.role !== "INTERVIEWER") {
      throw new Error("Only interviewers can add availability");
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new Error("Start time must be before end time");
    }

    const newSlot = await db.availability.create({
      data: {
        interviewerId: user.id,
        startTime: start,
        endTime: end,
        status: "AVAILABLE",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, slot: newSlot };
  } catch (error) {
    console.error("addAvailability error:", error);
    return { error: error.message || "Failed to add availability" };
  }
}

// 2. Delete Availability Slot
export async function deleteAvailability(slotId) {
  try {
    const user = await checkAuth();
    if (user.role !== "INTERVIEWER") {
      throw new Error("Only interviewers can delete availability");
    }

    const slot = await db.availability.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.interviewerId !== user.id) {
      throw new Error("Availability slot not found");
    }

    if (slot.status === "BOOKED") {
      throw new Error("Cannot delete a booked availability slot");
    }

    await db.availability.delete({
      where: { id: slotId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("deleteAvailability error:", error);
    return { error: error.message || "Failed to delete availability" };
  }
}

// 3. Update Credit Rate
export async function updateCreditRate(rate) {
  try {
    const user = await checkAuth();
    if (user.role !== "INTERVIEWER") {
      throw new Error("Only interviewers can update rate");
    }

    const parsedRate = parseInt(rate);
    if (isNaN(parsedRate) || parsedRate < 1) {
      throw new Error("Rate must be at least 1 credit");
    }

    await db.user.update({
      where: { id: user.id },
      data: { creditRate: parsedRate },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("updateCreditRate error:", error);
    return { error: error.message || "Failed to update credit rate" };
  }
}

// 4. Request Payout
export async function requestPayout({ credits, paymentMethod, paymentDetail }) {
  try {
    const user = await checkAuth();
    if (user.role !== "INTERVIEWER") {
      throw new Error("Only interviewers can request payouts");
    }

    const parsedCredits = parseInt(credits);
    if (isNaN(parsedCredits) || parsedCredits <= 0) {
      throw new Error("Please specify a valid amount of credits");
    }

    if (user.creditBalance < parsedCredits) {
      throw new Error(`Insufficient balance. You only have ${user.creditBalance} credits.`);
    }

    // Platform fee (e.g. 10%)
    const platformFee = parsedCredits * 0.1;
    const netAmount = (parsedCredits - platformFee) * 10; // e.g. 1 credit = $10 net

    await db.$transaction([
      // Deduct balance
      db.user.update({
        where: { id: user.id },
        data: {
          creditBalance: {
            decrement: parsedCredits,
          },
        },
      }),
      // Create payout record
      db.payout.create({
        data: {
          interviewerId: user.id,
          credits: parsedCredits,
          platformFee,
          netAmount,
          paymentMethod,
          paymentDetail,
          status: "PROCESSING",
        },
      }),
    ]);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("requestPayout error:", error);
    return { error: error.message || "Failed to submit payout request" };
  }
}
