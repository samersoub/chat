"use client";

import React from "react";
import { ChatRoom } from "@/models/ChatRoom";
import LuxRoomCard from "./LuxRoomCard";

const countries = ["الأردن", "سوريا", "مصر", "العراق", "السعودية", "المغرب", "الجزائر", "تونس", "ليبيا", "لبنان", "فلسطين"];

function mapCountry(id: string): string {
  const n = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return countries[n % countries.length];
}

const LuxRoomsGrid: React.FC<{ rooms: ChatRoom[]; filter: string }> = ({ rooms, filter }) => {
  const items = rooms.map((r) => ({ room: r, country: mapCountry(r.id) }))
    .filter((x) => (filter === "الجميع" ? true : x.country === filter));

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">لا توجد غرف حالياً.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4" dir="rtl">
      {items.map(({ room, country }) => (
        <LuxRoomCard key={room.id} room={room} country={country} />
      ))}
    </div>
  );
};

export default LuxRoomsGrid;