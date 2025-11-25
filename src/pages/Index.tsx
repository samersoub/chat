"use client";

import React from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { VoiceChatService } from "@/services/VoiceChatService";
import DiscoverHeader from "@/components/discover/DiscoverHeader";
import LuxBannerCarousel from "@/components/discover/LuxBannerCarousel";
import ArabicQuickActions from "@/components/discover/ArabicQuickActions";
import FilterTagsBar from "@/components/discover/FilterTagsBar";
import LuxRoomsGrid from "@/components/discover/LuxRoomsGrid";
import BottomTab from "@/components/mobile/BottomTab";
import { useLocale } from "@/contexts";

const Index: React.FC = () => {
  const rooms = React.useMemo(() => VoiceChatService.listRooms(), []);
  const [activeTab, setActiveTab] = React.useState<"popular" | "following">("popular");
  const [selectedTag, setSelectedTag] = React.useState<string>("الجميع");

  const { setLocale } = useLocale();
  React.useEffect(() => {
    // Force Arabic + RTL for this design
    setLocale("ar");
  }, [setLocale]);

  return (
    <ChatLayout hideHeader>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-4" dir="rtl">
        {/* Top Navigation Header */}
        <DiscoverHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Promotional Banner Slider */}
        <LuxBannerCarousel />

        {/* Quick Action Buttons */}
        <ArabicQuickActions />

        {/* Filter Tags Bar */}
        <FilterTagsBar selected={selectedTag} onChange={setSelectedTag} />

        {/* Rooms Grid */}
        <LuxRoomsGrid rooms={rooms} filter={selectedTag} />
      </div>

      {/* Bottom Navigation */}
      <BottomTab />
    </ChatLayout>
  );
};

export default Index;