"use client";

import React, { useState } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EconomyService } from "@/services/EconomyService";
import { GiftService } from "@/services/GiftService";
import GiftAnimation from "@/components/gifts/GiftAnimation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { showSuccess, showError } from "@/utils/toast";
import AvatarWithFrame from "@/components/profile/AvatarWithFrame";

const frames = [
  { id: "vip-gold", name: "VIP Gold Frame", price: 500 },
  { id: "royal-purple", name: "Royal Purple Frame", price: 400 },
];

const bubbles = [
  { id: "bubble-neon", name: "Neon Chat Bubble", price: 300 },
  { id: "bubble-gold", name: "Gold Chat Bubble", price: 350 },
];

const entrances = [
  { id: "entrance-glow", name: "Glow Entrance", price: 600 },
  { id: "entrance-dragon", name: "Dragon Entrance", price: 1200 },
];

const Store: React.FC = () => {
  const [bal, setBal] = useState(EconomyService.getBalance());
  const inv = EconomyService.getInventory();
  const categories = GiftService.getCategories();
  const [activeCat, setActiveCat] = useState<string>("popular");
  const [previewId, setPreviewId] = useState<"rose" | "car" | "dragon" | null>(null);

  return (
    <ChatLayout title="Store">
      <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-6">
        <Card className="bg-gradient-to-r from-[#2E0249] to-[#570A57] text-white border-white/10">
          <CardHeader><CardTitle>Your Avatar</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-4">
            <AvatarWithFrame name="You" />
            <div>
              <div className="text-xs opacity-80">Coins</div>
              <div className="text-xl font-bold text-[#FFD700]">{bal.coins}</div>
            </div>
            <Button
              variant="outline"
              className="ml-auto bg-white/10 text-white border-white/20 hover:bg-white/20"
              onClick={() => {
                EconomyService.equipFrame(undefined);
                showSuccess("Removed frame");
              }}
            >
              Remove Frame
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Avatar Frames</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {frames.map(f => (
              <div key={f.id} className="rounded-lg border p-3">
                <div className="font-semibold">{f.name}</div>
                <div className="text-sm text-muted-foreground">{f.price} coins</div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      try {
                        EconomyService.purchaseItem("frame", f.id, f.price);
                        const b = EconomyService.getBalance();
                        setBal({ ...b });
                        showSuccess(`Purchased ${f.name}`);
                      } catch (e: any) {
                        showError(e.message || "Purchase failed");
                      }
                    }}
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() => {
                      if (!inv.frames.includes(f.id)) {
                        showError("Buy the frame first");
                        return;
                      }
                      EconomyService.equipFrame(f.id);
                      showSuccess(`Equipped ${f.name}`);
                    }}
                  >
                    Equip
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Chat Bubbles</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {bubbles.map(b => (
              <div key={b.id} className="rounded-lg border p-3">
                <div className="font-semibold">{b.name}</div>
                <div className="text-sm text-muted-foreground">{b.price} coins</div>
                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => {
                    try {
                      EconomyService.purchaseItem("bubble", b.id, b.price);
                      setBal({ ...EconomyService.getBalance() });
                      showSuccess(`Purchased ${b.name}`);
                    } catch (e: any) {
                      showError(e.message || "Purchase failed");
                    }
                  }}
                >
                  Buy
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Entrance Effects</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {entrances.map(e => (
              <div key={e.id} className="rounded-lg border p-3">
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-muted-foreground">{e.price} coins</div>
                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => {
                    try {
                      EconomyService.purchaseItem("entrance", e.id, e.price);
                      setBal({ ...EconomyService.getBalance() });
                      showSuccess(`Purchased ${e.name}`);
                    } catch (err: any) {
                      showError(err.message || "Purchase failed");
                    }
                  }}
                >
                  Buy
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Gift Store</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {previewId && (
              <div className="rounded-lg border p-3">
                <div className="text-sm font-semibold mb-2">Preview</div>
                <div className="h-48">
                  <GiftAnimation type={previewId} />
                </div>
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setPreviewId(null)}>Close Preview</Button>
                </div>
              </div>
            )}

            <Tabs value={activeCat} onValueChange={(v) => setActiveCat(v)}>
              <TabsList className="w-full justify-start flex-wrap">
                {categories.map(c => (
                  <TabsTrigger key={c.key} value={c.key}>{c.label}</TabsTrigger>
                ))}
              </TabsList>
              {categories.map(c => (
                <TabsContent key={c.key} value={c.key} className="mt-3">
                  <div className="grid grid-cols-2 gap-4">
                    {GiftService.getGiftsByCategory(c.key).map(g => (
                      <div key={g.id} className="rounded-lg border p-3">
                        <div className="font-semibold">{g.name}</div>
                        <div className="text-sm text-muted-foreground">{g.price} coins</div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            onClick={() => setPreviewId(g.id)}
                          >
                            Preview
                          </Button>
                          <Button
                            onClick={() => {
                              showError("Send gifts from inside a voice room.");
                            }}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default Store;