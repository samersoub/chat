"use client";

import React from "react";
import ChatLayout from "@/components/chat/ChatLayout";

const Messages: React.FC = () => {
  return (
    <ChatLayout title="Messages">
      <div className="p-6 text-sm text-muted-foreground">Messages will appear here.</div>
    </ChatLayout>
  );
};

export default Messages;