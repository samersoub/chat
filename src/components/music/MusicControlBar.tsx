"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MusicService } from "@/services/MusicService";
import { MusicPermissionsService } from "@/services/MusicPermissionsService";
import { showError, showSuccess } from "@/utils/toast";

const MusicControlBar: React.FC<{ roomId: string; userId: string }> = ({ roomId, userId }) => {
  const st = MusicService.getRoomMusic(roomId);
  const canControl = MusicPermissionsService.canControl(roomId, userId);

  return (
    <Card className="w-[360px]">
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Now Playing</div>
          <div className="text-sm font-semibold">
            {st.currentTrack ? st.currentTrack.title : "—"}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!canControl) {
                showError("No permission");
                return;
              }
              const next = st.isPlaying ? MusicService.pause(roomId) : (st.currentTrack ? MusicService.play(roomId, st.currentTrack) : st);
              showSuccess(st.isPlaying ? "Paused" : "Playing");
            }}
          >
            {st.isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!canControl) {
                showError("No permission");
                return;
              }
              MusicService.skip(roomId);
              showSuccess("Skipped");
            }}
          >
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicControlBar;