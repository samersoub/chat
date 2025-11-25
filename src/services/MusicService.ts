"use client";

import { NotificationHelper } from "@/utils/NotificationHelper";
import { EconomyService } from "@/services/EconomyService";

export type SpotifyConfig = {
  clientId: string;
  clientSecret?: string;
};

export type MusicCategory = {
  key: "pop" | "hiphop" | "electronic";
  label: string;
  color: string;
};

export type PermissionRole =
  | "owner"
  | "moderator"
  | "speaker"
  | "listener";

export type SongRequestStatus = "queued" | "playing" | "skipped" | "completed";

export type SongRequest = {
  id: string;
  title: string;
  requestedBy: string;
  vipPriority: boolean;
  votes: number;
  approved: boolean;
  status: SongRequestStatus;
  createdAt: number;
};

export type RoomMusicState = {
  volume: number; // 0..100
  currentRequestId?: string;
};

const SPOTIFY_KEY = "music:spotify";
const QUEUE_PREFIX = "music:queue:";
const STATE_PREFIX = "music:state:";

// Config
function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
function qKey(roomId: string) {
  return `${QUEUE_PREFIX}${roomId}`;
}
function sKey(roomId: string) {
  return `${STATE_PREFIX}${roomId}`;
}
function rid(prefix = "req") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const CATEGORIES: MusicCategory[] = [
  { key: "pop", label: "Pop", color: "#FF6B6B" },
  { key: "hiphop", label: "Hip-Hop", color: "#4ECDC4" },
  { key: "electronic", label: "Electronic", color: "#45B7D1" },
];

// Permissions map
const PERMISSIONS: Record<PermissionRole, string[]> = {
  owner: ["full_control"],
  moderator: ["playback", "queue", "volume", "approve"],
  speaker: ["request", "suggest"],
  listener: ["request", "vote"],
};

// Song request settings
const VOTE_THRESHOLD = 5; // auto-play threshold
const PRIORITY_COST = 10; // coins

export const MusicService = {
  // Spotify
  configureSpotify(cfg: SpotifyConfig) {
    write(SPOTIFY_KEY, cfg);
  },
  getSpotifyConfig(): SpotifyConfig | undefined {
    return read<SpotifyConfig | undefined>(SPOTIFY_KEY, undefined);
  },

  // Categories and permissions
  getCategories(): MusicCategory[] {
    return CATEGORIES.slice();
  },
  getPermissions(): Record<PermissionRole, string[]> {
    return { ...PERMISSIONS };
  },

  // State and queue
  getRoomState(roomId: string): RoomMusicState {
    return read<RoomMusicState>(sKey(roomId), { volume: 50 });
  },
  setVolume(roomId: string, vol: number) {
    const v = Math.max(0, Math.min(100, Math.round(vol)));
    const st = this.getRoomState(roomId);
    st.volume = v;
    write(sKey(roomId), st);
  },
  clearQueue(roomId: string) {
    write<SongRequest[]>(qKey(roomId), []);
    const st = this.getRoomState(roomId);
    delete st.currentRequestId;
    write(sKey(roomId), st);
  },
  getQueue(roomId: string): SongRequest[] {
    return read<SongRequest[]>(qKey(roomId), []);
  },
  privateSaveQueue(roomId: string, queue: SongRequest[]) {
    write<SongRequest[]>(qKey(roomId), queue);
  },

  submitRequest(roomId: string, title: string, requestedBy: string, vipPriority = false) {
    if (!title.trim()) throw new Error("Song title is required");
    // Charge priority cost if VIP-first priority
    if (vipPriority) {
      EconomyService.transferCoinsToUser("music", "system", PRIORITY_COST);
    }
    const req: SongRequest = {
      id: rid(),
      title: title.trim(),
      requestedBy,
      vipPriority,
      votes: 0,
      approved: false,
      status: "queued",
      createdAt: Date.now(),
    };
    const queue = this.getQueue(roomId);
    // Insert based on VIP priority (front of queue)
    const nextQueue = vipPriority ? [req, ...queue] : [...queue, req];
    this.privateSaveQueue(roomId, nextQueue);
    NotificationHelper.notify("Song Requested", `${requestedBy} requested "${req.title}"`);
    // Attempt auto-play if threshold already met (unlikely at submit)
    this.maybeAutoplay(roomId);
    return req;
  },

  voteRequest(roomId: string, requestId: string, voterUid: string) {
    const queue = this.getQueue(roomId);
    const idx = queue.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    // Simple vote increment; real impl should avoid duplicate votes per user
    queue[idx].votes += 1;
    this.privateSaveQueue(roomId, queue);
    NotificationHelper.notify("Vote Recorded", `${voterUid} voted for "${queue[idx].title}"`);
    // Auto-play if threshold reached
    if (queue[idx].votes >= VOTE_THRESHOLD) {
      queue[idx].approved = true;
      this.privateSaveQueue(roomId, queue);
      this.maybeAutoplay(roomId);
    }
    return queue[idx];
  },

  approveRequest(roomId: string, requestId: string, approverUid: string) {
    const queue = this.getQueue(roomId);
    const idx = queue.findIndex((r) => r.id === requestId);
    if (idx === -1) throw new Error("Request not found");
    queue[idx].approved = true;
    this.privateSaveQueue(roomId, queue);
    NotificationHelper.notify("Request Approved", `${approverUid} approved "${queue[idx].title}"`);
    this.maybeAutoplay(roomId);
    return queue[idx];
  },

  skipCurrent(roomId: string, skipperUid: string) {
    const st = this.getRoomState(roomId);
    const queue = this.getQueue(roomId);
    if (!st.currentRequestId) return;
    const idx = queue.findIndex((r) => r.id === st.currentRequestId);
    if (idx !== -1) {
      queue[idx].status = "skipped";
      this.privateSaveQueue(roomId, queue);
    }
    delete st.currentRequestId;
    write(sKey(roomId), st);
    NotificationHelper.notify("Track Skipped", `${skipperUid} skipped the current track`);
    this.playNext(roomId);
  },

  // Internal autoplay/next
  maybeAutoplay(roomId: string) {
    const st = this.getRoomState(roomId);
    if (st.currentRequestId) return; // already playing
    this.playNext(roomId);
  },
  playNext(roomId: string) {
    const queue = this.getQueue(roomId);
    // Choose next: approved first, then highest votes, then VIP, then FIFO
    const next = queue
      .filter((r) => r.status === "queued")
      .sort((a, b) => {
        if (a.approved !== b.approved) return a.approved ? -1 : 1;
        if (b.votes !== a.votes) return b.votes - a.votes;
        if (a.vipPriority !== b.vipPriority) return a.vipPriority ? -1 : 1;
        return a.createdAt - b.createdAt;
      })[0];
    if (!next) return;
    next.status = "playing";
    this.privateSaveQueue(roomId, queue.map((r) => (r.id === next.id ? next : r)));
    const st = this.getRoomState(roomId);
    st.currentRequestId = next.id;
    write(sKey(roomId), st);
    NotificationHelper.notify("Playing", `Now playing: "${next.title}"`);
  },
};