"use client";

import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageSquare, Plus, Search, User } from "lucide-react";
import { VoiceChatService } from "@/services/VoiceChatService";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ChatLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const ChatLayout: React.FC<ChatLayoutProps> = ({ children, title = "Lama Chat" }) => {
  const location = useLocation();
  const rooms = useMemo(() => VoiceChatService.listRooms(), []);

  return (
    <SidebarProvider className="bg-background">
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold">Lama Chat</span>
            </div>
            <Button asChild size="sm" variant="outline" className="h-7 px-2">
              <Link to="/voice/create">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Link>
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Conversations</SidebarGroupLabel>
            <div className="px-2 pb-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8 h-8" placeholder="Search…" />
              </div>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {rooms.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    No conversations yet.
                  </div>
                )}
                {rooms.map((r) => {
                  const href = `/voice/rooms/${r.id}`;
                  const isActive = location.pathname.startsWith(`/voice/rooms/${r.id}`);
                  return (
                    <SidebarMenuItem key={r.id}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={r.name}>
                        <Link to={href} className="flex items-center gap-2">
                          <MessageSquare className="shrink-0" />
                          <span>{r.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Quick links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/voice/rooms"}>
                    <Link to="/voice/rooms">All Rooms</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/contacts"}>
                    <Link to="/contacts">Contacts</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/profile"}>
                    <Link to="/profile">Profile</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/settings"}>
                    <Link to="/settings">Settings</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="mt-auto">
          <div className="px-3 py-2 flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-xs">
              <div className="font-medium">You</div>
              <div className="text-muted-foreground">Online</div>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header
          className={cn(
            "sticky top-0 z-10",
            "border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          )}
        >
          <div className="flex items-center h-12 px-3 gap-2">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="h-8">
                <Link to="/voice/create">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChatLayout;