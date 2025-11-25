// Update this page (the content is just a fallback if you fail to update the page)

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ChatLayout from "@/components/chat/ChatLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BannerCarousel from "@/components/discover/BannerCarousel";
import ActionButtons from "@/components/discover/ActionButtons";
import RoomsGrid from "@/components/discover/RoomsGrid";
import { VoiceChatService } from "@/services/VoiceChatService";
import BottomTab from "@/components/mobile/BottomTab";
import { useLocale } from "@/contexts";
import GiftLeaderboard from "@/components/gifts/GiftLeaderboard";
import MusicControlBar from "@/components/music/MusicControlBar";
import MusicQueue from "@/components/music/MusicQueue";
import SongRequestPanel from "@/components/music/SongRequestPanel";

const Index = () => {
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);
  const { t } = useLocale();

  return (
    <ChatLayout title={t("Discover")}>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        {/* NEW: Room Music quick section */}
        <div className="grid grid-cols-1 gap-3">
          {rooms.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Room Music</div>
                <div className="text-xs text-muted-foreground">Manage now playing and requests</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Control bar */}
                <MusicControlBar roomId={rooms[0].id} userId={"guest"} />
                {/* Request panel */}
                <div className="flex-1">
                  <SongRequestPanel roomId={rooms[0].id} userId={"guest"} />
                </div>
              </div>
              {/* Queue */}
              <MusicQueue roomId={rooms[0].id} userId={"guest"} />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No rooms available yet. Create a room to start playing music and accepting song requests.
            </div>
          )}
        </div>

        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="popular">{t("Popular")}</TabsTrigger>
            <TabsTrigger value="following">{t("Following")}</TabsTrigger>
            <TabsTrigger value="new">{t("New")}</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-4">
            <BannerCarousel />
            <ActionButtons />
            <RoomsGrid rooms={rooms} />
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <BannerCarousel />
            <ActionButtons />
            <RoomsGrid rooms={rooms} />
          </TabsContent>

          <TabsContent value="new" className="space-y-4">
            <BannerCarousel />
            <ActionButtons />
            <RoomsGrid rooms={rooms} />
          </TabsContent>
        </Tabs>

        {/* Gift Leaderboard */}
        <GiftLeaderboard />

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Smart Matching</div>
                <div className="text-sm text-muted-foreground">Find compatible users and start private calls</div>
              </div>
              <Button asChild><Link to="/matching">Open</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Earnings</div>
                <div className="text-sm text-muted-foreground">Claim daily bonus, watch ads, and more</div>
              </div>
              <Button asChild variant="outline"><Link to="/earnings">Open</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Purchase Coins</div>
                <div className="text-sm text-muted-foreground">Buy starter, premium, or elite coin packs</div>
              </div>
              <Button asChild variant="outline"><Link to="/coins">Open</Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Music Library</div>
                <div className="text-sm text-muted-foreground">Browse playlists and play/request tracks</div>
              </div>
              <Button asChild variant="outline"><Link to="/music">Open</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <BottomTab />
    </ChatLayout>
  );
};

export default Index;