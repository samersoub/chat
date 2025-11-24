import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebRTCService } from "@/services/WebRTCService";
import { AudioManager } from "@/utils/AudioManager";
import { PermissionManager } from "@/utils/PermissionManager";
import { showError, showSuccess } from "@/utils/toast";
import ChatLayout from "@/components/chat/ChatLayout";

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
    const stream = await rtc.getMicStream();
    if (audioRef.current) {
      AudioManager.attachStream(audioRef.current, stream);
      setActive(true);
      showSuccess("Microphone started");
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
    <ChatLayout title={id ? `Room ${id}` : "Voice Chat"}>
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
    </ChatLayout>
  );
};

export default VoiceChat;