import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebRTCService } from "@/services/WebRTCService";
import { AudioManager } from "@/utils/AudioManager";
import { PermissionManager } from "@/utils/PermissionManager";
import { showError, showSuccess } from "@/utils/toast";

const VoiceChat = () => {
  const { id } = useParams<{ id: string }>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [active, setActive] = useState(false);
  const rtc = useRef(new WebRTCService()).current;

  useEffect(() => {
    return () => {
      rtc.stopMic();
    };
  }, [rtc]);

  const start = async () => {
    const ok = await PermissionManager.ensureMicPermission();
    if (!ok) { showError("Microphone permission denied"); return; }
    try {
      // Check if there is at least one audio input device available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMic = devices.some(d => d.kind === "audioinput");
      if (!hasMic) {
        showError("No microphone found. Connect a mic or select a valid input.");
        return;
      }

      const stream = await rtc.getMicStream();
      if (audioRef.current) {
        AudioManager.attachStream(audioRef.current, stream);
      }
      setActive(true);
      showSuccess("Microphone started");
    } catch (err: any) {
      let msg = "Could not start microphone";
      const text = String(err?.message || "");
      if (err?.name === "NotFoundError" || /Requested device not found/i.test(text)) {
        msg = "No microphone found. Connect a mic or select a valid input.";
      } else if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        msg = "Microphone access was blocked. Please allow microphone permission.";
      }
      showError(msg);
      // Cleanup if something partially started
      rtc.stopMic();
      if (audioRef.current) {
        AudioManager.detach(audioRef.current);
      }
      setActive(false);
    }
  };

  const stop = () => {
    rtc.stopMic();
    if (audioRef.current) {
      AudioManager.detach(audioRef.current);
    }
    setActive(false);
  };

  return (
    <div className="mx-auto max-w-xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Voice Chat {id ? `— Room ${id}` : ""}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            This demo starts your microphone locally. To enable real calls, we'll add signaling next.
          </div>
          <div className="flex gap-2">
            <Button onClick={start} disabled={active}>Start mic</Button>
            <Button variant="outline" onClick={stop} disabled={!active}>Stop mic</Button>
          </div>
          <audio ref={audioRef} autoPlay className="w-full mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChat;