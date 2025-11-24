import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceChatService } from "@/services/VoiceChatService";
import { showError } from "@/utils/toast";

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const room = useMemo(() => (id ? VoiceChatService.getRoom(id) : undefined), [id]);

  if (!room) {
    return <div className="p-6">Room not found.</div>;
  }

  return (
    <div className="mx-auto max-w-xl p-4 space-y-4">
      <Card>
        <CardHeader><CardTitle>{room.name}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">ID: {room.id}</div>
          <div className="text-sm">Participants: {room.participants.length}</div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => nav(`/voice/rooms/${room.id}/join`)}>Join voice</Button>
            <Button variant="outline" onClick={() => { VoiceChatService.deleteRoom(room.id); nav("/voice/rooms"); }}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetails;