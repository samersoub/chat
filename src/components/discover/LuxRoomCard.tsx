"use client";

import React from "react";
import { Crown, Headphones, Flag, Flame, User } from "lucide-react";
import { RoomData } from "@/models/RoomData";
import { cn } from "@/lib/utils";

type Props = {
  room: RoomData;
};

function codeToFlagEmoji(code: string): string {
  // Convert ISO country code to emoji flag
  const cc = code.trim().toUpperCase();
  if (cc.length !== 2) return "🏳️";
  const base = 127397;
  return String.fromCodePoint(cc.charCodeAt(0) + base) + String.fromCodePoint(cc.charCodeAt(1) + base);
}

const LuxRoomCard: React.FC<Props> = ({ room }) => {
  const listeners = room.listenerCount;
  const hot = listeners > 100;

  return (
    <div
      className="relative rounded-xl overflow-hidden group aspect-[4/5] sm:aspect-[3/4] shadow"
      style={{
        backgroundImage: `url(${room.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top left: listeners */}
      <div className="absolute top-2 left-2">
        <div className="px-2 py-1 rounded-full bg-black/50 text-white text-xs flex items-center gap-1">
          <Headphones className="h-4 w-4" />
          <span>{listeners}</span>
          {hot && <Flame className="h-4 w-4 text-amber-400" />}
        </div>
      </div>

      {/* Top right: agency/rank */}
      <div className="absolute top-2 right-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 border border-amber-300 shadow flex items-center justify-center">
          <Crown className="h-4 w-4 text-white drop-shadow" />
        </div>
      </div>

      {/* Bottom-right: country flag emoji badge */}
      <div className="absolute bottom-2 right-2">
        <div className="h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center text-lg">
          {codeToFlagEmoji(room.countryFlag)}
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-2 right-2 left-2 text-white" dir="rtl">
          <div className="text-base sm:text-lg font-bold truncate">{room.title}</div>
          <div className="mt-1 flex items-center gap-2 text-white/85">
            <Flag className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{room.countryFlag}</span>
            <span className="text-xs sm:text-sm text-white/70">•</span>
            <span className="text-xs sm:text-sm text-white/80 truncate">المضيف: {room.hostName}</span>
            <User className="h-4 w-4 text-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxRoomCard;