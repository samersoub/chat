import { User } from "@/models/User";

const KEY = "auth:user";

export const AuthService = {
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
    },
  register(email: string, password: string, name?: string): User {
    // demo only: store a single user locally (no real password handling)
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify({ ...user, password }));
    return user;
  },
  login(email: string, password: string): User {
    const raw = localStorage.getItem(KEY);
    if (!raw) throw new Error("No account found. Please register first.");
    const stored = JSON.parse(raw) as User & { password?: string };
    if (stored.email !== email || stored.password !== password) {
      throw new Error("Invalid credentials");
    }
    localStorage.setItem(KEY, JSON.stringify(stored));
    return stored as User;
  },
  logout() {
    localStorage.removeItem(KEY);
  },
  verifyPhone(code: string): boolean {
    // demo code
    return code === "123456";
  },
};