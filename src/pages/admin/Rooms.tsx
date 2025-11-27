"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceChatService } from "@/services/VoiceChatService";
import { showSuccess, showError } from "@/utils/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { HostService } from "@/services/HostService";
import { RoomSettingsService, type RoomSettings, type RoomType } from "@/services/RoomSettingsService";

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState(VoiceChatService.listRooms());
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{ name: string; isPrivate: "public" | "private"; hostId: string; description?: string }>({ name: "", isPrivate: "public", hostId: "", description: "" });

  const [configOpen, setConfigOpen] = useState(false);
  const [configRoomId, setConfigRoomId] = useState<string>("");
  const [config, setConfig] = useState<RoomSettings | null>(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignRoomId, setAssignRoomId] = useState<string>("");
  const [assignHostId, setAssignHostId] = useState<string>("");

  const refresh = () => setRooms(VoiceChatService.listRooms());

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const openConfigure = (roomId: string) => {
    const s = RoomSettingsService.getSettings(roomId);
    setConfigRoomId(roomId);
    setConfig({ ...s });
    setConfigOpen(true);
  };

  return (
    <AdminLayout title="Rooms">
      <div className="flex justify-between mb-3">
        <Button variant="outline" size="sm" onClick={refresh}>Refresh</Button>
        <Button size="sm" onClick={() => setCreateOpen(true)}>New Room</Button>
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
                <Button size="sm" variant="outline" onClick={() => openConfigure(r.id)}>
                  Configure
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAssignRoomId(r.id); setAssignHostId(r.hostId || ""); setAssignOpen(true); }}>
                  Assign Host
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

      {/* Create Room */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Room</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Room name" value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Description" value={createForm.description} onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))} />
            <Select value={createForm.isPrivate} onValueChange={(v) => setCreateForm((f) => ({ ...f, isPrivate: v as "public" | "private" }))}>
              <SelectTrigger><SelectValue placeholder="Privacy" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
            <Select value={createForm.hostId} onValueChange={(v) => setCreateForm((f) => ({ ...f, hostId: v }))}>
              <SelectTrigger><SelectValue placeholder="Host" /></SelectTrigger>
              <SelectContent>
                {HostService.list().map((h) => <SelectItem key={h.id} value={h.id}>{h.name} ({h.id})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-3">
            <Button onClick={() => {
              if (!createForm.name || !createForm.hostId) {
                showError("Enter room name and host");
                return;
              }
              VoiceChatService.createRoom(createForm.name, createForm.isPrivate === "private", createForm.hostId, createForm.description);
              showSuccess("Room created");
              setCreateOpen(false);
              refresh();
            }}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Configure Room */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configure Room</DialogTitle></DialogHeader>
          {config && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Select value={config.type} onValueChange={(v) => setConfig((c) => c ? { ...c, type: v as RoomType } : c)}>
                <SelectTrigger><SelectValue placeholder="Room type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="vip-exclusive">VIP Exclusive</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" value={config.maxSpeakers} onChange={(e) => setConfig((c) => c ? { ...c, maxSpeakers: Math.max(1, Number(e.target.value) || 1) } : c)} />
              <Input type="number" value={config.maxListeners} onChange={(e) => setConfig((c) => c ? { ...c, maxListeners: Math.max(1, Number(e.target.value) || 1) } : c)} />
            </div>
          )}
          <DialogFooter className="mt-3">
            <Button onClick={() => {
              if (!config) return;
              RoomSettingsService.setRoomType(configRoomId, config.type);
              RoomSettingsService.configure(configRoomId, { maxSpeakers: config.maxSpeakers, maxListeners: config.maxListeners, moderatorsLimit: config.moderatorsLimit });
              showSuccess("Room settings saved");
              setConfigOpen(false);
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Host */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Host</DialogTitle></DialogHeader>
          <Select value={assignHostId} onValueChange={setAssignHostId}>
            <SelectTrigger><SelectValue placeholder="Select host" /></SelectTrigger>
            <SelectContent>
              {HostService.list().map((h) => <SelectItem key={h.id} value={h.id}>{h.name} ({h.id})</SelectItem>)}
            </SelectContent>
          </Select>
          <DialogFooter className="mt-3">
            <Button onClick={() => {
              if (!assignRoomId || !assignHostId) {
                showError("Select a host");
                return;
              }
              VoiceChatService.updateRoomHost(assignRoomId, assignHostId);
              showSuccess("Host assigned");
              setAssignOpen(false);
              refresh();
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Rooms;