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

const Index = () => {
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);
  const { t } = useLocale();

  return (
    <ChatLayout title={t("Discover")}>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
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
        </div>
      </div>
      <BottomTab />
    </ChatLayout>
  );
};

export default Index;