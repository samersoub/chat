"use client";

export interface RoomData {
  id: string;
  title: string;
  coverImage: string;
  hostName: string;
  hostLevel: number;
  listenerCount: number;
  countryFlag: string; // ISO code like "JO", "SY", "TR"
  tags: string[];
}