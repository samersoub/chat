"use client";

import React, { useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceChatService } from "@/services/VoiceChatService";
import { showSuccess } from "@/utils/toast";

const Rooms: React.FC = () => {
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);

  return (
    <AdminLayout title="Rooms">
      <div className="grid gap-3">
        {rooms.length === 0 && <div className="text-muted-foreground">No active rooms.</div>}
        {rooms.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="text-base">{r.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Participants: {r.participants?.length ?? 0}
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