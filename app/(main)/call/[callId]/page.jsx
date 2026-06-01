import { redirect, notFound } from "next/navigation";
import { getCallData } from "@/actions/call";
import CallRoom from "./_components/CallRoom";
import CallTimeGuard from "./_components/CallTimeGuard";

export default async function CallPage({ params }) {
  const { callId } = await params;

  const result = await getCallData(callId);

  if (result.error === "Unauthorized") {
    redirect("/");
  }
  if (result.error === "Call not found") {
    notFound();
  }
  if (result.error === "Forbidden") {
    redirect("/");
  }

  // Time-based access control
  if (result.error === "Too early") {
    return (
      <CallTimeGuard
        type="early"
        startTime={result.startTime}
        endTime={result.endTime}
        callId={callId}
      />
    );
  }
  if (result.error === "Call ended") {
    return (
      <CallTimeGuard
        type="ended"
        startTime={result.startTime}
        endTime={result.endTime}
      />
    );
  }

  const { token, isInterviewer, currentUser, booking } = result;

  return (
    <CallRoom
      callId={callId}
      token={token}
      apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
      currentUser={currentUser}
      booking={booking}
      isInterviewer={isInterviewer}
    />
  );
}