import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SeatGrid from "@/components/voice/SeatGrid";
import ChatOverlay from "@/components/voice/ChatOverlay";
import ControlBar from "@/components/voice/ControlBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GiftTray, { GiftItem } from "@/components/gifts/GiftTray";
import GiftAnimation from "@/components/gifts/GiftAnimation";
import { showSuccess } from "@/utils/toast";
import { WebRTCService } from "@/services/WebRTCService";
import { AudioManager } from "@/utils/AudioManager";

const VoiceChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(false);
  const [wallpaper, setWallpaper] = useState<"royal" | "nebula" | "galaxy">("royal");
  const [giftOpen, setGiftOpen] = useState(false);
  const [activeGift, setActiveGift] = useState<GiftItem | null>(null);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const rtcRef = React.useRef<WebRTCService | null>(null);

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
      {/* Hidden audio element for local mic preview */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Animated mystical purple gradient background */}
      <div className="absolute inset-0 -z-10">
        {wallpaper === "royal" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#2E0249] via-[#570A57] to-[#9333ea]" />
            <div className="absolute -top-20 -left-20 h-64 w-64 bg-fuchsia-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-0 h-80 w-80 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
          </>
        )}
        {wallpaper === "nebula" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b0764] via-[#6d28d9] to-[#db2777]" />
            <div className="absolute -top-16 left-1/3 h-72 w-72 bg-pink-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="absolute -bottom-16 right-1/4 h-64 w-64 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
          </>
        )}
        {wallpaper === "galaxy" && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#7c3aed]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_50%)]" />
          </>
        )}
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

      {/* Wallpaper switcher */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => setWallpaper(wallpaper === "royal" ? "nebula" : wallpaper === "nebula" ? "galaxy" : "royal")}
        >
          Wallpaper
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
        onToggleMic={async () => {
          const rtc = (rtcRef.current ||= new WebRTCService());
          if (!micOn) {
            const stream = await rtc.getMicStream();
            if (audioRef.current) {
              AudioManager.attachStream(audioRef.current, stream);
            }
            setMicOn(true);
            showSuccess("Microphone On");
          } else {
            rtc.stopMic();
            if (audioRef.current) {
              AudioManager.detach(audioRef.current);
            }
            setMicOn(false);
            showSuccess("Microphone Off");
          }
        }}
        onOpenChat={() => showSuccess("Open chat")}
        onSendGift={() => setGiftOpen(true)}
        onEmoji={() => showSuccess("Emoji")}
      />

      {/* Gift dialog */}
      <Dialog open={giftOpen} onOpenChange={setGiftOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Send a Gift</DialogTitle></DialogHeader>
          <GiftTray
            senderUid="you"
            receiverUid={id || "host"}
            onSent={(g) => {
              setActiveGift(g);
              setGiftOpen(false);
              setTimeout(() => setActiveGift(null), 3000);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Gift overlay animation */}
      {activeGift && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
          <GiftAnimation type={activeGift.id} />
        </div>
      )}
    </div>
  );
};

export default VoiceChat;