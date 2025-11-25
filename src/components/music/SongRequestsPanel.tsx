"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { MusicService, type SongRequest } from "@/services/MusicService";
import { showSuccess, showError } from "@/utils/toast";

type Props = {
  roomId: string;
  currentUid: string;
  isModerator?: boolean;
};

const statusColor = (s: string) =>
  s === "playing" ? "bg-green-600"
  : s === "queued" ? "bg-blue-600"
  : s === "skipped" ? "bg-yellow-600"
  : "bg-gray-600";

const SongRequestsPanel: React.FC<Props> = ({ roomId, currentUid, isModerator = false }) => {
  const [title, setTitle] = useState("");
  const [queue, setQueue] = useState<SongRequest[]>([]);
  const [volume, setVolume] = useState(MusicService.getRoomState(roomId).volume);

  const refresh = () => setQueue(MusicService.getQueue(roomId));

  useEffect(() => {
    refresh();
  }, [roomId]);

  const submit = (priority: boolean) => {
    try {
      MusicService.submitRequest(roomId, title, currentUid, priority);
      setTitle("");
      refresh();
      showSuccess(priority ? "Priority request submitted (-10 coins)" : "Request submitted");
    } catch (e: any) {
      showError(e.message || "Failed to submit request");
    }
  };

  const vote = (id: string) => {
    try {
      MusicService.voteRequest(roomId, id, currentUid);
      refresh();
      showSuccess("Voted");
    } catch (e: any) {
      showError(e.message || "Vote failed");
    }
  };

  const approve = (id: string) => {
    try {
      MusicService.approveRequest(roomId, id, currentUid);
      refresh();
      showSuccess("Approved");
    } catch (e: any) {
      showError(e.message || "Approve failed");
    }
  };

  const skip = () => {
    MusicService.skipCurrent(roomId, currentUid);
    refresh();
    showSuccess("Skipped current");
  };

  return (
    <Card className="w-80 bg-white/90 backdrop-blur border border-white/20">
      <CardHeader>
        <CardTitle className="text-sm">Song Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title or URL"
            className="h-9"
          />
          <Button onClick={() => submit(false)} className="h-9">Request</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => submit(true)} className="h-9">
            Priority (-10)
          </Button>
          {isModerator && (
            <Button variant="outline" onClick={skip} className="h-9">
              Skip
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-48 overflow-auto">
          {queue.length === 0 ? (
            <div className="text-xs text-muted-foreground">No requests yet.</div>
          ) : (
            queue.map((r) => (
              <div key={r.id} className="rounded border p-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium line-clamp-1">{r.title}</div>
                  <Badge className={`${statusColor(r.status)} text-white`}>{r.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">by {r.requestedBy} • {r.votes} votes {r.vipPriority ? "• VIP" : ""} {r.approved ? "• Approved" : ""}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => vote(r.id)}>Vote</Button>
                  {isModerator && r.status === "queued" && (
                    <Button size="sm" onClick={() => approve(r.id)}>Approve</Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-1">
          <div className="text-xs font-medium">Room Volume: {volume}%</div>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => {
              const val = v[0] ?? 50;
              setVolume(val);
              MusicService.setVolume(roomId, val);
            }}
          />
        </div>

        <div className="text-[11px] text-muted-foreground">
          Roles: Owner (full), Moderator (approve/playback/volume), Speaker (request), Listener (vote/request).
        </div>
      </CardContent>
    </Card>
  );
};

export default SongRequestsPanel;