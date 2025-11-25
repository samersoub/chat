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

const Index = () => {
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);

  return (
    <ChatLayout title="Discover">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4">
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
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
      </div>
    </ChatLayout>
  );
};

export default Index;