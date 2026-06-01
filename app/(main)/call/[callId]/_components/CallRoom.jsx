"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Stream Video
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

import { Loader2, Phone, PhoneOff } from "lucide-react";
import CallUI from "./CallUI";
import Image from "next/image";

// ─── Ringtone generator using Web Audio API ──────────────────────────────────
function createRingtone() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let isPlaying = false;
  let timeoutId = null;

  function playTone(frequency, duration) {
    if (!isPlaying) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  function ring() {
    if (!isPlaying) return;
    // Double beep pattern like a phone ring
    playTone(440, 0.15);
    setTimeout(() => playTone(480, 0.15), 200);
    // Repeat every 2 seconds
    timeoutId = setTimeout(ring, 2000);
  }

  return {
    start() {
      if (isPlaying) return;
      isPlaying = true;
      if (ctx.state === "suspended") ctx.resume();
      ring();
    },
    stop() {
      isPlaying = false;
      if (timeoutId) clearTimeout(timeoutId);
      ctx.close().catch(() => {});
    },
  };
}

// ─── Ringing Lobby Screen ────────────────────────────────────────────────────
function RingingLobby({ booking, isInterviewer, onAnswer, onDecline }) {
  const ringtoneRef = useRef(null);
  const caller = isInterviewer ? booking.interviewee : booking.interviewer;

  useEffect(() => {
    // Only play ringtone for interviewee
    if (!isInterviewer) {
      ringtoneRef.current = createRingtone();
      ringtoneRef.current.start();
    }
    return () => {
      ringtoneRef.current?.stop();
    };
  }, [isInterviewer]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 max-w-sm text-center">
        {/* Pulsing avatar */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-amber-400/10 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400/30">
            {caller.imageUrl ? (
              <Image
                src={caller.imageUrl}
                alt={caller.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-amber-400/10 flex items-center justify-center text-amber-400 text-2xl font-bold">
                {caller.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Caller info */}
        <div>
          <h2 className="font-serif text-2xl text-stone-100 tracking-tight">
            {caller.name}
          </h2>
          <p className="text-sm text-stone-500 mt-1 animate-pulse">
            {isInterviewer
              ? "Waiting for interviewee to join…"
              : "Incoming interview call…"}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-6 mt-4">
          <button
            onClick={onDecline}
            className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 hover:border-red-500/50 transition-all duration-200 cursor-pointer"
            aria-label="Decline"
          >
            <PhoneOff size={24} />
          </button>
          <button
            onClick={onAnswer}
            className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/25 hover:border-green-500/50 transition-all duration-200 animate-bounce cursor-pointer"
            aria-label="Answer"
          >
            <Phone size={28} />
          </button>
        </div>

        <p className="text-xs text-stone-700 mt-2">
          {isInterviewer
            ? "The interviewee will see a ringing screen"
            : "Tap the green button to answer"}
        </p>
      </div>
    </div>
  );
}

// ─── Main CallRoom ───────────────────────────────────────────────────────────
export default function CallRoom({
  callId,
  token,
  apiKey,
  currentUser,
  booking,
  isInterviewer,
}) {
  const router = useRouter();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [answered, setAnswered] = useState(isInterviewer); // Interviewer auto-answers
  const clientRef = useRef(null);
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!answered) return; // Don't connect until answered
    if (joinedRef.current) return;
    joinedRef.current = true;

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.imageUrl,
      },
      token,
    });

    const callInstance = client.call("default", callId);

    callInstance
      .join({ create: false })
      .then(() => {
        clientRef.current = client;
        setVideoClient(client);
        setCall(callInstance);
      })
      .catch(console.error);

    return () => {
      callInstance.leave().catch(() => {});
      client.disconnectUser().catch(() => {});
      clientRef.current = null;
      joinedRef.current = false;
    };
  }, [
    answered,
    apiKey,
    callId,
    currentUser.id,
    currentUser.imageUrl,
    currentUser.name,
    token,
  ]);

  const handleLeave = useCallback(() => {
    router.push(isInterviewer ? "/dashboard" : "/appointments");
  }, [isInterviewer, router]);

  const handleDecline = useCallback(() => {
    router.push(isInterviewer ? "/dashboard" : "/appointments");
  }, [isInterviewer, router]);

  // Show ringing lobby for interviewee (before answering)
  if (!answered) {
    return (
      <RingingLobby
        booking={booking}
        isInterviewer={isInterviewer}
        onAnswer={() => setAnswered(true)}
        onDecline={handleDecline}
      />
    );
  }

  if (!videoClient || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-amber-400 animate-spin" />
        <p className="text-stone-500 text-sm font-light">Connecting to call…</p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <CallUI
          callId={callId}
          isInterviewer={isInterviewer}
          booking={booking}
          onLeave={handleLeave}
          apiKey={apiKey}
          token={token}
          currentUser={currentUser}
        />
      </StreamCall>
    </StreamVideo>
  );
}