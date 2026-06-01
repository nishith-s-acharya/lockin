"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { StreamClient } from "@stream-io/node-sdk";

export const getCallData = async (callId) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const booking = await db.booking.findUnique({
    where: { streamCallId: callId },
    include: {
      interviewer: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
          categories: true,
        },
      },
      interviewee: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!booking) return { error: "Call not found" };

  const isInterviewer = booking.interviewer.clerkUserId === user.id;
  const isInterviewee = booking.interviewee.clerkUserId === user.id;
  if (!isInterviewer && !isInterviewee) return { error: "Forbidden" };

  // ── Time-based access control ──
  const now = new Date();
  const earlyJoinMinutes = 10; // can join 10 min early
  const lateBufferMinutes = 30; // call stays open 30 min after end
  const windowStart = new Date(booking.startTime.getTime() - earlyJoinMinutes * 60000);
  const windowEnd = new Date(booking.endTime.getTime() + lateBufferMinutes * 60000);

  if (now < windowStart) {
    return {
      error: "Too early",
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    };
  }
  if (now > windowEnd) {
    return {
      error: "Call ended",
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    };
  }

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_SECRET_KEY
  );

  const token = streamClient.generateUserToken({
    user_id: user.id,
    validity_in_seconds: 60 * 60,
  });

  return {
    token,
    isInterviewer,
    currentUser: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      imageUrl: user.imageUrl,
    },
    booking: {
      id: booking.id,
      interviewer: booking.interviewer,
      interviewee: booking.interviewee,
      categories: booking.interviewer.categories,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    },
  };
};