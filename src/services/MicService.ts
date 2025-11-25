"use client";

export type SeatInfo = {
  index: number;
  userId?: string;
  name?: string;
  muted: boolean;
  locked: boolean;
  speaking: boolean;
};

function key(roomId: string) {
  return `voice:seats:${roomId}`;
}

function defaults(): SeatInfo[] {
  return Array.from({ length: 8 }, (_, i) => ({
    index: i,
    muted: false,
    locked: false,
    speaking: false,
  }));
}

function read(roomId: string): SeatInfo[] {
  const raw = localStorage.getItem(key(roomId));
  if (!raw) return defaults();
  try {
    const seats = JSON.parse(raw) as SeatInfo[];
    // ensure at least 8 seats
    const arr = [...seats];
    while (arr.length < 8) {
      arr.push({ index: arr.length, muted: false, locked: false, speaking: false });
    }
    return arr.slice(0, 8);
  } catch {
    return defaults();
  }
}

function write(roomId: string, seats: SeatInfo[]) {
  localStorage.setItem(key(roomId), JSON.stringify(seats.slice(0, 8)));
}

function findByUser(seats: SeatInfo[], userId: string) {
  return seats.find((s) => s.userId === userId);
}

export const MicService = {
  getSeats(roomId: string): SeatInfo[] {
    return read(roomId);
  },
  putOnMic(roomId: string, userId: string, name?: string, targetIndex?: number): SeatInfo[] {
    const seats = read(roomId);
    // If already on mic, just update name or move if targetIndex given
    const current = findByUser(seats, userId);
    if (current && typeof targetIndex === "number" && targetIndex >= 0 && targetIndex < seats.length) {
      const to = seats[targetIndex];
      if (to.locked || to.userId) throw new Error("Target seat unavailable");
      // clear current
      current.userId = undefined;
      current.name = undefined;
      current.speaking = false;
      current.muted = false;
      // move to target
      to.userId = userId;
      to.name = name ?? to.name ?? "Guest";
      write(roomId, seats);
      return seats;
    }
    // Choose first available seat if none specified
    const idx =
      typeof targetIndex === "number" && targetIndex >= 0 && targetIndex < seats.length
        ? targetIndex
        : seats.findIndex((s) => !s.locked && !s.userId);
    if (idx === -1) throw new Error("No available seats");
    const seat = seats[idx];
    if (seat.locked || seat.userId) throw new Error("Seat is not available");
    seat.userId = userId;
    seat.name = name ?? "Guest";
    seat.speaking = false;
    seat.muted = false;
    write(roomId, seats);
    return seats;
  },
  leaveMic(roomId: string, userId: string): SeatInfo[] {
    const seats = read(roomId);
    const seat = findByUser(seats, userId);
    if (!seat) throw new Error("You are not on the mic");
    seat.userId = undefined;
    seat.name = undefined;
    seat.speaking = false;
    seat.muted = false;
    write(roomId, seats);
    return seats;
  },
  kick(roomId: string, targetUserId: string): SeatInfo[] {
    const seats = read(roomId);
    const seat = findByUser(seats, targetUserId);
    if (!seat) throw new Error("User is not on the mic");
    seat.userId = undefined;
    seat.name = undefined;
    seat.speaking = false;
    seat.muted = false;
    write(roomId, seats);
    return seats;
  },
  mute(roomId: string, targetUserId: string, muted: boolean): SeatInfo[] {
    const seats = read(roomId);
    const seat = findByUser(seats, targetUserId);
    if (!seat) throw new Error("User is not on the mic");
    seat.muted = muted;
    if (muted) seat.speaking = false;
    write(roomId, seats);
    return seats;
  },
  lockSeat(roomId: string, index: number, locked: boolean): SeatInfo[] {
    const seats = read(roomId);
    const seat = seats[index];
    if (!seat) throw new Error("Seat not found");
    seat.locked = locked;
    if (locked) {
      seat.userId = undefined;
      seat.name = undefined;
      seat.speaking = false;
      seat.muted = false;
    }
    write(roomId, seats);
    return seats;
  },
  move(roomId: string, userId: string, toIndex: number): SeatInfo[] {
    const seats = read(roomId);
    if (toIndex < 0 || toIndex >= seats.length) throw new Error("Invalid target");
    const dest = seats[toIndex];
    if (dest.locked || dest.userId) throw new Error("Seat unavailable");
    const src = findByUser(seats, userId);
    if (!src) throw new Error("User not on the mic");
    dest.userId = src.userId;
    dest.name = src.name;
    dest.muted = src.muted;
    dest.speaking = src.speaking;
    src.userId = undefined;
    src.name = undefined;
    src.muted = false;
    src.speaking = false;
    write(roomId, seats);
    return seats;
  },
  setSpeaking(roomId: string, userId: string, speaking: boolean): SeatInfo[] {
    const seats = read(roomId);
    const seat = findByUser(seats, userId);
    if (!seat) throw new Error("User not on the mic");
    seat.speaking = speaking;
    write(roomId, seats);
    return seats;
  },
};