"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquareText, Images, User2 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/moments", label: "Moments", icon: Images },
  { to: "/messages", label: "Messages", icon: MessageSquareText },
  { to: "/profile", label: "Profile", icon: User2 },
];

const BottomTab: React.FC = () => {
  const loc = useLocation();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-4xl bg-white/80 backdrop-blur border-t">
        <div className="grid grid-cols-4">
          {items.map(({ to, label, icon: Icon }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn("flex flex-col items-center justify-center py-2 text-xs", active ? "text-primary" : "text-muted-foreground")}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomTab;