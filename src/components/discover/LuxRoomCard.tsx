"use client";

import React from "react";
import { Crown, Headphones, Flag, User } from "lucide-react";
import { ChatRoom } from "@/models/ChatRoom";
import { cn } from "@/lib/utils";

const images = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-5dc8a1b7b874?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519608425001-54df7bff3f63?q=80&w=1200&auto=format&fit=crop",
];

function pickImage(id: string) {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return images[n % images.length];
}

type Props = {
  room: ChatRoom;
  country: string;
};

const LuxRoomCard: React.FC<Props> = ({ room, country }) => {
  const img = pickImage(room.id);
  const listeners = room.participants.length;
  const isMale = room.hostId ? room.hostId.charCodeAt(0) % 2 === 0 : true;

  return (
    <div
      className="relative rounded-xl overflow-hidden group aspect-[4/5] sm:aspect-[3/4] shadow"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top left: listeners */}
      <div className="absolute top-2 left-2">
        <div className="px-2 py-1 rounded-full bg-black/50 text-white text-xs flex items-center gap-1">
          <Headphones className="h-4 w-4" />
          <span>{listeners}</span>
        </div>
      </div>

      {/* Top right: agency/rank */}
      <div className="absolute top-2 right-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 border border-amber-300 shadow flex items-center justify-center">
          <Crown className="h-4 w-4 text-white drop-shadow" />
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-2 right-2 left-2 text-white" dir="rtl">
          <div className="text-base sm:text-lg font-bold truncate">{room.name}</div>
          <div className="mt-1 flex items-center gap-2 text-white/85">
            <Flag className="h-4 w-4" />
            <span className="text-xs sm:text-sm">{country}</span>
            <span className="text-xs sm:text-sm text-white/70">•</span>
            <span className="text-xs sm:text-sm text-white/80 truncate">المضيف: {room.hostId?.slice(0, 6) || "مضيف"}</span>
            {isMale ? (
              <User className="h-4 w-4 text-blue-300" />
            ) : (
              <User className="h-4 w-4 text-pink-300" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuxRoomCard;