"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatMessage = {
  id: string;
  user: string;
  text: string;
};

const ChatOverlay: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="pointer-events-none">
      <div
        ref={ref}
        className="w-[92vw] sm:w-[380px] max-h-[30vh] overflow-y-auto bg-black/30 backdrop-blur rounded-lg p-3 border border-white/10"
      >
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className="text-xs sm:text-sm text-white/90">
                <span className="font-semibold">{m.user}: </span>
                <span className="text-white/80">{m.text}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatOverlay;