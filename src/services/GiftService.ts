"use client";

import { EconomyService, Transaction } from "@/services/EconomyService";

export type GiftCategory = "popular" | "premium" | "animated" | "limited";
export type GiftDef = {
  id: "rose" | "car" | "dragon";
  name: string;
  price: number;
  rewardDiamonds: number;
  categories: GiftCategory[];
};

const GIFTS: GiftDef[] = [
  { id: "rose", name: "Rose", price: 10, rewardDiamonds: 1, categories: ["popular", "animated"] },
  { id: "car", name: "Luxury Car", price: 1000, rewardDiamonds: 120, categories: ["premium", "animated"] },
  { id: "dragon", name: "Golden Dragon", price: 5000, rewardDiamonds: 800, categories: ["limited", "animated", "premium"] },
];

export const GiftService = {
  getCategories(): { key: GiftCategory; label: string }[] {
    return [
      { key: "popular", label: "Popular" },
      { key: "premium", label: "Premium" },
      { key: "animated", label: "Animated" },
      { key: "limited", label: "Limited" },
    ];
  },
  getGiftsByCategory(category: GiftCategory): GiftDef[] {
    return GIFTS.filter(g => g.categories.includes(category));
  },
  getAll(): GiftDef[] {
    return GIFTS.slice();
  },
  // Leaderboard of receivers by total gift coins received
  getLeaderboard(limit = 5): { receiverUid: string; totalCoins: number; giftsCount: number }[] {
    const logs = EconomyService.getLogs().filter((tx: Transaction) => tx.type === "gift");
    const acc = new Map<string, { totalCoins: number; giftsCount: number }>();
    for (const tx of logs) {
      const receiver = tx.meta?.receiverUid as string | undefined;
      if (!receiver) continue;
      const prev = acc.get(receiver) || { totalCoins: 0, giftsCount: 0 };
      prev.totalCoins += tx.amount;
      prev.giftsCount += 1;
      acc.set(receiver, prev);
    }
    const result = Array.from(acc.entries())
      .map(([receiverUid, v]) => ({ receiverUid, totalCoins: v.totalCoins, giftsCount: v.giftsCount }))
      .sort((a, b) => b.totalCoins - a.totalCoins || b.giftsCount - a.giftsCount)
      .slice(0, limit);
    return result;
  },
};