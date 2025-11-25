"use client";

import { AuthService } from "@/services/AuthService";
import { VoiceChatService } from "@/services/VoiceChatService";

export type MusicRole = "owner" | "moderator" | "speaker" | "listener";

// Simple in-memory moderators map (demo)
const MODS = new Map<string, Set<string>>(); // roomId -> moderator userIds

export const MusicPermissionsService = {
  addModerator(roomId: string, userId: string) {
    const s = MODS.get(roomId) || new Set<string>();
    s.add(userId);
    MODS.set(roomId, s);
  },
  removeModerator(roomId: string, userId: string) {
    const s = MODS.get(roomId);
    if (s) {
      s.delete(userId);
      MODS.set(roomId, s);
    }
  },
  getRole(roomId: string, userId?: string): MusicRole {
    const uid = userId ?? AuthService.getCurrentUser()?.id;
    const room = roomId ? VoiceChatService.getRoom(roomId) : undefined;
    if (uid && room && room.hostId === uid) return "owner";
    if (uid && MODS.get(roomId)?.has(uid)) return "moderator";
    // Simplified: treat participants as speakers; others as listeners
    if (uid && room?.participants?.includes(uid)) return "speaker";
    return "listener";
  },
  canControl(roomId: string, userId?: string): boolean {
    const r = this.getRole(roomId, userId);
    return r === "owner" || r === "moderator";
  },
  canApprove(roomId: string, userId?: string): boolean {
    const r = this.getRole(roomId, userId);
    return r === "owner" || r === "moderator";
  },
  canRequest(roomId: string, userId?: string): boolean {
    const r = this.getRole(roomId, userId);
    return r === "owner" || r === "moderator" || r === "speaker" || r === "listener";
  },
  canVote(roomId: string, userId?: string): boolean {
    return this.canRequest(roomId, userId);
  },
};