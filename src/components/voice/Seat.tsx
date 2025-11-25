"use client";

import React from "react";
import { MicOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SeatProps = {
  name?: string;
  imageUrl?: string;
  speaking?: boolean;
  muted?: boolean;
};

const Seat: React.FC<SeatProps> = ({ name = "User", imageUrl, speaking = false, muted = false }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={cn(
          "rounded-full p-1 transition-all",
          speaking ? "ring-2 ring-emerald-400 animate-pulse" : muted ? "ring-2 ring-gray-400" : "ring-2 ring-transparent"
        )}
      >
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-white/20 shadow-lg">
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-purple-500/30 text-white">{name.slice(0, 1).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
      </div>
      {muted && (
        <div className="absolute -bottom-1 -right-1 bg-black/60 text-white rounded-full p-1">
          <MicOff className="h-4 w-4" />
        </div>
      )}
      <div className="mt-2 text-xs text-white/80 text-center w-20 truncate">{name}</div>
    </div>
  );
};

export default Seat;