"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EconomyService } from "@/services/EconomyService";
import { cn } from "@/lib/utils";

const AvatarWithFrame: React.FC<{ name?: string; imageUrl?: string; size?: number }> = ({ name = "User", imageUrl, size = 96 }) => {
  const inv = EconomyService.getInventory();
  const hasFrame = !!inv.equippedFrame;
  const borderClass = hasFrame ? "ring-2 ring-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.6)]" : "ring-2 ring-white/20";

  return (
    <div className="inline-flex flex-col items-center">
      <div className={cn("rounded-full p-1", borderClass)} style={{ width: size + 8, height: size + 8 }}>
        <Avatar style={{ width: size, height: size }}>
          {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : <AvatarFallback className="bg-purple-500/30 text-white">{name.slice(0, 1).toUpperCase()}</AvatarFallback>}
        </Avatar>
      </div>
      {hasFrame && <div className="mt-1 text-[10px] text-[#FFD700]">VIP Frame</div>}
    </div>
  );
};

export default AvatarWithFrame;