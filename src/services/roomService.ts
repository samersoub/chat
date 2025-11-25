"use client";

import { RoomData } from "@/models/RoomData";

const images = {
  batman: "https://images.unsplash.com/photo-1519682335074-1c3b3b66f2d4?q=80&w=1200&auto=format&fit=crop",
  falcon: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  sunset: "https://images.unsplash.com/photo-1519608425001-54df7bff3f63?q=80&w=1200&auto=format&fit=crop",
  city: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
};

let seed: RoomData[] = [
  {
    id: "r1",
    title: "وكالة (Batman)",
    coverImage: images.batman,
    hostName: "الوك emad",
    hostLevel: 9,
    listenerCount: 411,
    countryFlag: "TR", // Turkey
    tags: ["Popular", "Agency"],
  },
  {
    id: "r2",
    title: "وكالة أسود حلب",
    coverImage: images.falcon,
    hostName: "كفاح",
    hostLevel: 7,
    listenerCount: 45,
    countryFlag: "DE", // Germany
    tags: ["Popular", "Music"],
  },
  {
    id: "r3",
    title: "وكالة تعز الحالمة",
    coverImage: images.sunset,
    hostName: "الصقر",
    hostLevel: 6,
    listenerCount: 21,
    countryFlag: "YE", // Yemen
    tags: ["New"],
  },
  {
    id: "r4",
    title: "ليالي السمر",
    coverImage: images.city,
    hostName: "نايف",
    hostLevel: 8,
    listenerCount: 128,
    countryFlag: "SA",
    tags: ["Popular"],
  },
];

function randomDrift(n: number) {
  const drift = Math.floor((Math.random() - 0.5) * 10);
  const v = Math.max(0, n + drift);
  return v;
}

/**
 * Simulates fetching rooms from a backend.
 * Listener counts will slightly change on each call to mimic live updates.
 */
export async function fetchActiveRooms(): Promise<RoomData[]> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 300));
  seed = seed.map((r) => ({ ...r, listenerCount: randomDrift(r.listenerCount) }));
  return [...seed];
}