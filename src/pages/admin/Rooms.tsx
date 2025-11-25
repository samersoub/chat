"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceChatService } from "@/services/VoiceChatService";
import { showSuccess } from "@/utils/toast";

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState(VoiceChatService.listRooms());

  const refresh = () => setRooms(VoiceChatService.listRooms());

  useEffect(() => {
    // Optional: refresh when page becomes visible
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <AdminLayout title="Rooms">
      <div className="flex justify-end mb-3">
        <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
      </div>
      <div className="grid gap-3">
        {rooms.length === 0 && <div className="text-muted-foreground">No active rooms.</div>}
        {rooms.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base">{r.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Host: {r.hostId || "—"} • Participants: {r.participants?.length ?? 0}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => showSuccess(`Monitoring ${r.name}`)}>
                  Monitor
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    VoiceChatService.deleteRoom(r.id);
                    showSuccess(`Closed room ${r.name}`);
                    refresh();
                  }}
                >
                  Close Room
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default Rooms;