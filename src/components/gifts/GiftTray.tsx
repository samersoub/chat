"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { EconomyService } from "@/services/EconomyService";
import { showSuccess, showError } from "@/utils/toast";

export type GiftItem = { id: "rose" | "car" | "dragon"; name: string; price: number; rewardDiamonds: number };

const gifts: GiftItem[] = [
  { id: "rose", name: "Rose", price: 10, rewardDiamonds: 1 },
  { id: "car", name: "Luxury Car", price: 1000, rewardDiamonds: 120 },
  { id: "dragon", name: "Golden Dragon", price: 5000, rewardDiamonds: 800 },
];

const GiftTray: React.FC<{ senderUid: string; receiverUid: string; onSent?: (gift: GiftItem) => void }> = ({ senderUid, receiverUid, onSent }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {gifts.map(g => (
        <div key={g.id} className="rounded-lg border p-3 bg-white">
          <div className="text-sm font-semibold">{g.name}</div>
          <div className="text-xs text-muted-foreground">{g.price} coins</div>
          <Button
            className="mt-2 w-full"
            onClick={() => {
              try {
                const b = EconomyService.sendGift(senderUid, receiverUid, g.id, g.price, g.rewardDiamonds);
                showSuccess(`Sent ${g.name}. Coins: ${b.coins}, Diamonds: ${b.diamonds}`);
                onSent?.(g);
              } catch (e: any) {
                showError(e.message || "Failed to send gift");
              }
            }}
          >
            Send
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GiftTray;