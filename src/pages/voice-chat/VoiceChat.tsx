import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SeatGrid from "@/components/voice/SeatGrid";
import ChatOverlay from "@/components/voice/ChatOverlay";
import ControlBar from "@/components/voice/ControlBar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GiftTray, { GiftItem } from "@/components/gifts/GiftTray";
import GiftAnimation from "@/components/gifts/GiftAnimation";
import { showError, showSuccess } from "@/utils/toast";
import { WebRTCService } from "@/services/WebRTCService";
import { AudioManager } from "@/utils/AudioManager";
import { MicService } from "@/services/MicService";
import { RecordingService } from "@/services/RecordingService";
import { AuthService } from "@/services/AuthService";
import { VoiceChatService } from "@/services/VoiceChatService";
import MicManager from "@/components/voice/MicManager";
import SongRequestsPanel from "@/components/music/SongRequestsPanel";

const VoiceChat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [micOn, setMicOn] = useState(false);
  const [wallpaper, setWallpaper] = useState<"royal" | "nebula" | "galaxy">("royal");
  const [giftOpen, setGiftOpen] = useState(false);
  const [activeGift, setActiveGift] = useState<GiftItem | null>(null);
  const [subscribeMode, setSubscribeMode] = useState<"auto" | "manual">("auto");

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const rtcRef = React.useRef<WebRTCService | null>(null);

  const user = AuthService.getCurrentUser();
  const roomSeats = React.useMemo(() => (id ? MicService.getSeats(id) : []), [id]);
  const [seatsState, setSeatsState] = useState(roomSeats);
  const isHost = !!(id && user && VoiceChatService.getRoom(id)?.hostId === user.id);

  // Join on mount, leave on unmount, destroy when empty
  React.useEffect(() => {
    if (!id || !user?.id) return;
    try {
      VoiceChatService.joinRoom(id, user.id);
    } catch {}
    return () => {
      try {
        const updatedRoom = VoiceChatService.leaveRoom(id, user.id);
        if (updatedRoom.participants.length === 0) {
          VoiceChatService.deleteRoom(id);
        }
      } catch {}
    };
  }, [id, user?.id]);

  // Client-side ghost mic detection: if mic is on but user not on seat, stop mic
  React.useEffect(() => {
    if (!id || !user?.id) return;
    const onSeat = seatsState.some((s) => s.userId === user.id);
    if (micOn && !onSeat) {
      const rtc = (rtcRef.current ||= new WebRTCService());
      rtc.stopMic();
      if (audioRef.current) {
        AudioManager.detach(audioRef.current);
      }
      setMicOn(false);
      try {
        const updated = MicService.setSpeaking(id, user.id, false);
        setSeatsState([...updated]);
      } catch {}
      showError("Detected ghost mic. Mic muted until you take a seat.");
    }
  }, [micOn, seatsState, id, user?.id]);

  const seats = React.useMemo(
    () =>
      (seatsState.length ? seatsState : Array.from({ length: 8 }, (_, i) => ({ index: i, locked: false, muted: false, speaking: false } as any))).map(
        (s, i) => ({
          id: `${i}`,
          name: s.userId ? s.name || "User" : s.locked ? "Locked" : "Empty",
          imageUrl: undefined,
          speaking: !!s.speaking,
          muted: !!s.muted,
          locked: !!s.locked,
        })
      ),
    [seatsState]
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
          onClick={() => {
            if (id && user?.id) {
              try {
                const updatedRoom = VoiceChatService.leaveRoom(id, user.id);
                if (updatedRoom.participants.length === 0) {
                  VoiceChatService.deleteRoom(id);
                }
              } catch {}
            }
            const rtc = (rtcRef.current ||= new WebRTCService());
            rtc.stopMic();
            if (audioRef.current) {
              AudioManager.detach(audioRef.current);
            }
            setMicOn(false);
            navigate(-1);
          }}
        >
          Exit Room
        </Button>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => {
            try {
              if (!id) return;
              const updated = MicService.putOnMic(id, user?.id || "you", user?.name || "You");
              setSeatsState([...updated]);
              showSuccess("You took a mic");
            } catch (e: any) {
              showSuccess(e.message || "Unable to take mic");
            }
          }}
        >
          Take Mic
        </Button>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => {
            try {
              if (!id) return;
              const updated = MicService.leaveMic(id, user?.id || "you");
              setSeatsState([...updated]);
              setMicOn(false);
              showSuccess("Left mic");
            } catch (e: any) {
              showSuccess(e.message || "Unable to leave mic");
            }
          }}
        >
          Leave Mic
        </Button>
      </div>

      {/* Wallpaper switcher + recording controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => setWallpaper(wallpaper === "royal" ? "nebula" : wallpaper === "nebula" ? "galaxy" : "royal")}
        >
          Wallpaper
        </Button>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => {
            if (!id) return;
            const status = RecordingService.status(id);
            if (!status.active) {
              RecordingService.start(id, "companion");
              showSuccess("Recording started (companion)");
            } else {
              RecordingService.stop(id);
              showSuccess("Recording stopped");
            }
          }}
        >
          Toggle Recording
        </Button>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => {
            if (!id) return;
            RecordingService.submitForReview(id);
            showSuccess("Submitted for review");
          }}
        >
          Submit Review
        </Button>
        <Button
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          onClick={() => {
            setSubscribeMode((m) => (m === "auto" ? "manual" : "auto"));
            showSuccess(`Subscription mode: ${subscribeMode === "auto" ? "manual" : "auto"}`);
          }}
        >
          Subscribe: {subscribeMode === "auto" ? "Auto" : "Manual"}
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
            // Require user to be on mic
            const onSeat = seatsState.some((s) => s.userId === (user?.id || "you"));
            if (!onSeat) {
              showSuccess("Take a mic first");
              return;
            }
            const stream = await rtc.getMicStream();
            if (audioRef.current) {
              AudioManager.attachStream(audioRef.current, stream);
            }
            setMicOn(true);
            if (id) {
              const updated = MicService.setSpeaking(id, user?.id || "you", true);
              setSeatsState([...updated]);
            }
            showSuccess("Microphone On");
          } else {
            rtc.stopMic();
            if (audioRef.current) {
              AudioManager.detach(audioRef.current);
            }
            setMicOn(false);
            if (id) {
              const updated = MicService.setSpeaking(id, user?.id || "you", false);
              setSeatsState([...updated]);
            }
            showSuccess("Microphone Off");
          }
        }}
        onOpenChat={() => showSuccess("Open chat")}
        onSendGift={() => setGiftOpen(true)}
        onEmoji={() => showSuccess("Emoji")}
      />

      {/* Host microphone management panel + music requests */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3">
        <SongRequestsPanel roomId={id || "demo"} currentUid={user?.id || "you"} isModerator={isHost} />
        {isHost && (
          <MicManager
            roomId={id || "demo"}
            seats={seatsState}
            onSeatsChange={(s) => setSeatsState([...s])}
          />
        )}
      </div>

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