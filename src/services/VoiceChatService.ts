import { ChatRoom } from "@/models/ChatRoom";

const KEY = "voice:rooms";

function readRooms(): ChatRoom[] {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as ChatRoom[]) : [];
}

function writeRooms(rooms: ChatRoom[]) {
  localStorage.setItem(KEY, JSON.stringify(rooms));
}

export const VoiceChatService = {
  listRooms(): ChatRoom[] {
    return readRooms();
  },
  createRoom(name: string, isPrivate: boolean, hostId: string, description?: string): ChatRoom {
    const room: ChatRoom = {
      id: crypto.randomUUID(),
      name,
      isPrivate,
      hostId,
      participants: [hostId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      description,
    };
    const rooms = readRooms();
    rooms.push(room);
    writeRooms(rooms);
    return room;
  },
  getRoom(id: string): ChatRoom | undefined {
    return readRooms().find(r => r.id === id);
  },
  joinRoom(id: string, userId: string): ChatRoom {
    const rooms = readRooms();
    const idx = rooms.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Room not found");
    const room = rooms[idx];
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      room.updatedAt = new Date().toISOString();
      rooms[idx] = room;
      writeRooms(rooms);
    }
    return room;
  },
  leaveRoom(id: string, userId: string): ChatRoom {
    const rooms = readRooms();
    const idx = rooms.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Room not found");
    const room = rooms[idx];
    room.participants = room.participants.filter(p => p !== userId);
    room.updatedAt = new Date().toISOString();
    rooms[idx] = room;
    writeRooms(rooms);
    return room;
  },
  deleteRoom(id: string) {
    const rooms = readRooms().filter(r => r.id !== id);
    writeRooms(rooms);
  },
};