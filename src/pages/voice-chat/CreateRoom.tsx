import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceChatService } from "@/services/VoiceChatService";
import { AuthService } from "@/services/AuthService";
import { showError, showSuccess } from "@/utils/toast";

const CreateRoom = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Create room</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Room name" value={name} onChange={e => setName(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
            Private room
          </label>
          <Button
            className="w-full"
            onClick={() => {
              const user = AuthService.getCurrentUser();
              if (!user) { showError("Please login first"); return; }
              if (!name.trim()) { showError("Room name is required"); return; }
              const room = VoiceChatService.createRoom(name.trim(), isPrivate, user.id);
              showSuccess("Room created");
              nav(`/voice/rooms/${room.id}`);
            }}
          >
            Create
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoom;