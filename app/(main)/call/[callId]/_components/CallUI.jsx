"use client";

import { useEffect, useCallback, useState } from "react";

// Stream Video
import {
  StreamTheme,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  CallingState,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

// Stream Chat
import {
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  MessageComposerUI,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles, Loader2, X, PanelRightOpen } from "lucide-react";
import AIQuestionsPanel from "./AIQuestions";

// ─── Call UI (inside StreamCall context) ─────────────────────────────────────

export default function CallUI({
  callId,
  isInterviewer,
  booking,
  onLeave,
  apiKey,
  token,
  currentUser,
}) {
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const callingState = useCallCallingState();

  const [activeTab, setActiveTab] = useState("chat");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);

  // Auto-stop recording before leaving
  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;
        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }
        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  // ── Chat client — same token works for both Video + Chat SDKs ──
  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.imageUrl,
    },
  });

  const [chatChannel, setChatChannel] = useState(null);

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      name: "Interview Chat",
      members: [
        booking.interviewer.clerkUserId,
        booking.interviewee.clerkUserId,
      ],
    });

    channel
      .watch()
      .then(() => setChatChannel(channel))
      .catch(console.error);

    return () => {
      channel.stopWatching().catch(() => {});
    };
  }, [chatClient, callId, booking]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call…</p>
      </div>
    );
  }

  // ── Side panel content (shared between desktop & mobile) ──
  const sidePanel = (
    <>
      {/* Tab switcher */}
      <div className="flex border-b border-white/8 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
            activeTab === "chat"
              ? "text-amber-400 border-b-2 border-amber-400"
              : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <MessageSquare size={13} />
          Chat
        </button>

        {/* AI Questions tab — interviewer only */}
        {isInterviewer && (
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors ${
              activeTab === "ai"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <Sparkles size={13} />
            AI Questions
          </button>
        )}

        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={() => setSidePanelOpen(false)}
          className="lg:hidden flex items-center justify-center px-3 py-3 text-stone-500 hover:text-stone-300 transition-colors"
          aria-label="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "chat" ? (
          chatClient && chatChannel ? (
            <Chat client={chatClient} theme="str-chat__theme-dark">
              <Channel channel={chatChannel}>
                <Window>
                  <MessageList />
                  <MessageComposer>
                    <MessageComposerUI focus />
                  </MessageComposer>
                </Window>
              </Channel>
            </Chat>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={18} className="text-stone-600 animate-spin" />
            </div>
          )
        ) : (
          <div className="p-4 h-full overflow-y-scroll max-h-screen">
            <AIQuestionsPanel categories={booking.categories} />
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-[92vh] bg-[#0a0a0b] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Badge
            variant="outline"
            className="border-white/10 text-stone-500 text-[10px] sm:text-xs truncate max-w-[200px] sm:max-w-none"
          >
            <span className="truncate">{booking.interviewer.name}</span>
            <span className="text-stone-700 mx-1 sm:mx-1.5">×</span>
            <span className="truncate">{booking.interviewee.name}</span>
          </Badge>
          {isInterviewer && (
            <Badge
              variant="outline"
              className="border-amber-400/20 bg-amber-400/5 text-amber-400 text-[10px] sm:text-xs shrink-0"
            >
              Interviewer
            </Badge>
          )}
        </div>

        {/* Mobile panel toggle */}
        <button
          type="button"
          onClick={() => setSidePanelOpen(true)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20 transition-colors text-xs"
        >
          <PanelRightOpen size={14} />
          <span className="hidden sm:inline">Panel</span>
        </button>
      </div>

      {/* Body: video + side panel */}
      <div className="flex flex-1 min-h-0 relative">
        {/* ── LEFT: Video ── */}
        <div className="flex flex-col flex-1 min-w-0">
          <StreamTheme>
            <SpeakerLayout participantBarPosition="bottom" />
            <CallControls onLeave={handleLeave} />
          </StreamTheme>
        </div>

        {/* ── RIGHT: Desktop side panel (always visible on lg+) ── */}
        <div className="hidden lg:flex w-85 shrink-0 flex-col border-l border-white/8 bg-[#0a0a0b]">
          {sidePanel}
        </div>

        {/* ── MOBILE: Slide-over panel ── */}
        {sidePanelOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidePanelOpen(false)}
            />
            {/* Panel */}
            <div className="lg:hidden fixed inset-y-0 right-0 w-[85vw] max-w-[360px] z-50 flex flex-col bg-[#0a0a0b] border-l border-white/8 animate-in slide-in-from-right duration-200">
              {sidePanel}
            </div>
          </>
        )}
      </div>
    </div>
  );
}