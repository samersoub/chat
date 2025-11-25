import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SeatGrid from "@/components/voice/SeatGrid";
import ChatOverlay from "@/components/voice/ChatOverlay";
import ControlBar from "@/components/voice/ControlBar";
import { showSuccess } from "@/utils/toast";

const VoiceChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(false);
  const seats = useMemo(
    () => [
      { id: "1", name: "Host", imageUrl: "/placeholder.svg", speaking: true, muted: false },
      { id: "2", name: "Maya", imageUrl: undefined, speaking: false, muted: false },
      { id: "3", name: "Omar", imageUrl: undefined, speaking: false, muted: true },
      { id: "4", name: "Liu", imageUrl: undefined, speaking: false, muted: false },
      { id: "5", name: "Sara", imageUrl: undefined, speaking: false, muted: false },
      { id: "6", name: "Ali", imageUrl: undefined, speaking: true, muted: false },
      { id: "7", name: "Jin", imageUrl: undefined, speaking: false, muted: false },
      { id: "8", name: "Nora", imageUrl: undefined, speaking: false, muted: false },
    ],
    []
  );

  const messages = useMemo(
    () => [
      { id: "m1", user: "Host", text: "Welcome to the room!" },
      { id: "m2", user: "Maya", text: "Hi everyone 👋" },
      { id: "m3", user: "Omar", text: "Muted for a sec." },
      { id: "m4", user: "Ali", text: "Love this song 🔥" },
    ],
    []
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated mystical purple gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2e026d] via-[#6d28d9] to-[#9333ea]" />
        <div className="absolute -top-20 -left-20 h-64 w-64 bg-fuchsia-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 h-80 w-80 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <div className="text-white">
          <div className="text-sm font-semibold">Room: {id ?? "—"}</div>
          <div className="text-xs text-white/80">ID: {id ?? "—"}</div>
        </div>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => navigate(-1)}
        >
          Leave
        </Button>
      </div>

      {/* Center seating grid */}
      <div className="flex items-center justify-center pt-20 pb-32 px-6">
        <div className="w-full max-w-4xl">
          <SeatGrid seats={seats} />
        </div>
      </div>

      {/* Bottom-left chat overlay */}
      <div className="absolute left-4 bottom-24">
        <ChatOverlay messages={messages} />
      </div>

      {/* Bottom control bar */}
      <ControlBar
        micOn={micOn}
        onToggleMic={() => {
          setMicOn((v) => !v);
          showSuccess(!micOn ? "Microphone On" : "Microphone Off");
        }}
        onOpenChat={() => showSuccess("Open chat")}
        onSendGift={() => showSuccess("Gift sent")}
        onEmoji={() => showSuccess("Emoji")}
      />
    </div>
  );
};

export default VoiceChat;