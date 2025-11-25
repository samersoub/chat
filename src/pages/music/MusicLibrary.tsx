"use client";

import React, { useMemo, useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { MusicService } from "@/services/MusicService";
import { MusicPermissionsService } from "@/services/MusicPermissionsService";
import { VoiceChatService } from "@/services/VoiceChatService";
import { showSuccess, showError } from "@/utils/toast";
import { useLocale } from "@/contexts";

const MusicLibrary: React.FC = () => {
  const { t } = useLocale();
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);
  const [roomId, setRoomId] = useState<string>(rooms[0]?.id ?? "");
  const categories = MusicService.getCategories();
  const playlists = MusicService.getPlaylists();
  const [activeCat, setActiveCat] = useState<string>(categories[0]?.key ?? "pop");
  const spotify = MusicService.getSpotifyConfig();
  const [volume, setVolume] = useState<number>(MusicService.getRoomMusic(roomId || rooms[0]?.id || "demo").volume);

  const applySpotifyConfig = () => {
    const clientId = prompt("Spotify Client ID") || "";
    const clientSecret = prompt("Spotify Client Secret") || "";
    if (!clientId || !clientSecret) {
      showError("Spotify config not set");
      return;
    }
    MusicService.setSpotifyConfig({ clientId, clientSecret });
    showSuccess("Spotify configured");
  };

  const canControl = roomId ? MusicPermissionsService.canControl(roomId) : false;

  return (
    <ChatLayout title={t("Music Library")}>
      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{spotify ? "Spotify: Configured" : "Spotify: Not configured"}</Badge>
            <Button variant="outline" size="sm" onClick={applySpotifyConfig}>
              {spotify ? "Update Spotify" : "Setup Spotify"}
            </Button>
          </div>
          <div className="sm:ml-auto w-full sm:w-auto">
            <Select value={roomId} onValueChange={(v) => setRoomId(v)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select target room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.length === 0 ? (
                  <SelectItem value="">No rooms</SelectItem>
                ) : (
                  rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("Playlists")}</span>
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-xs text-muted-foreground">
                  {roomId ? `Room: ${roomId}` : "No room selected"}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Tabs value={activeCat} onValueChange={(v) => setActiveCat(v)}>
              <TabsList className="flex-wrap">
                {categories.map((c) => (
                  <TabsTrigger key={c.key} value={c.key} style={{ borderBottomColor: c.color }}>
                    {c.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {categories.map((c) => (
                <TabsContent key={c.key} value={c.key} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {playlists.map((pl) => (
                      <Card key={pl.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-base">{pl.name}</span>
                            {pl.vipOnly && <Badge>VIP</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Track</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pl.tracks.slice(0, 4).map((t) => (
                                <TableRow key={t.id}>
                                  <TableCell className="text-sm">{t.title}</TableCell>
                                  <TableCell className="space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        if (!roomId) {
                                          showError("Select a room first");
                                          return;
                                        }
                                        const next = MusicService.addRequest(roomId, t, "you", pl.vipOnly);
                                        showSuccess("Requested to room");
                                      }}
                                    >
                                      Request
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        if (!roomId) {
                                          showError("Select a room first");
                                          return;
                                        }
                                        if (!canControl) {
                                          showError("No permission to play");
                                          return;
                                        }
                                        MusicService.play(roomId, t);
                                        showSuccess("Playing in room");
                                      }}
                                    >
                                      Play
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>{t("Room Music Settings")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded border p-3">
              <div className="text-xs text-muted-foreground mb-2">Volume</div>
              <Slider
                value={[Math.round(volume * 100)]}
                onValueChange={(v) => {
                  const vol = (v[0] ?? 80) / 100;
                  setVolume(vol);
                  if (roomId) {
                    MusicService.setVolume(roomId, vol);
                    showSuccess(`Volume: ${Math.round(vol * 100)}%`);
                  }
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {canControl
                ? "You can control music in the selected room."
                : "You don't have control permissions in the selected room."}
            </div>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default MusicLibrary;