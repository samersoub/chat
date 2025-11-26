import { User } from "@/models/User";
import { supabase, isSupabaseReady, safe } from "@/services/db/supabaseClient";
import { ProfileService, type Profile } from "@/services/ProfileService";

const KEY = "auth:user";

export const AuthService = {
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  },

  // Existing demo register (local only) remains for fallback
  register(email: string, password: string, name?: string): User {
    // demo only: store a single user locally (no real password handling)
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify({ ...user, password }));
    // Initialize local profile with coins=100 if not using Supabase
    const p: Profile = {
      id: user.id,
      username: (name || email.split("@")[0]).toLowerCase(),
      email,
      phone: "",
      profile_image: null,
      coins: 100,
      is_active: true,
      is_verified: false,
      role: "user",
      created_at: new Date().toISOString(),
      last_login: null,
    };
    void ProfileService.upsertProfile(p);
    return user;
  },

  // Unified login (email or username) using Supabase if available, otherwise local
  async loginUnified(login: string, password: string): Promise<User> {
    if (isSupabaseReady && supabase) {
      const email = login.includes("@")
        ? login
        : (await ProfileService.getByUsername(login))?.email || login; // if username not found, attempt as email
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) throw new Error(error?.message || "Invalid credentials");
      const u = data.user;
      const prof = (await ProfileService.getByUserId(u.id)) || {
        id: u.id,
        username: (u.user_metadata?.username as string) || email.split("@")[0],
        email,
        phone: (u.user_metadata?.phone as string) || "",
        profile_image: null,
        coins: 100,
        is_active: true,
        is_verified: !!u.email_confirmed_at,
        role: "user",
        created_at: new Date().toISOString(),
        last_login: null,
      };
      await ProfileService.upsertProfile({ ...prof, last_login: new Date().toISOString() });
      const user: User = {
        id: u.id,
        email,
        name: prof.username,
        phone: prof.phone,
        avatarUrl: prof.profile_image || undefined,
        createdAt: prof.created_at,
      };
      localStorage.setItem(KEY, JSON.stringify(user));
      return user;
    }
    // Fallback to local demo
    return this.login(login, password);
  },

  // Extended register to meet requirements (username, phone, optional image)
  async registerExtended(username: string, email: string, password: string, phone: string, imageFile?: File): Promise<User> {
    username = username.trim().toLowerCase();
    if (isSupabaseReady && supabase) {
      // Uniqueness checks
      const existingUser = await ProfileService.getByUsername(username);
      if (existingUser) throw new Error("Username already exists");
      const { data: byEmail } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle?.() as any;
      if (byEmail) throw new Error("Email already exists");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, phone } },
      });
      if (error || !data.user) throw new Error(error?.message || "Failed to register");
      const u = data.user;
      const created: Profile = {
        id: u.id,
        username,
        email,
        phone,
        profile_image: null,
        coins: 100,
        is_active: true,
        is_verified: !!u.email_confirmed_at,
        role: "user",
        created_at: new Date().toISOString(),
        last_login: null,
      };
      await ProfileService.upsertProfile(created);
      // Optional image upload
      if (imageFile) {
        await ProfileService.uploadProfileImage(u.id, imageFile);
      }
      const user: User = {
        id: u.id,
        email,
        name: username,
        phone,
        avatarUrl: undefined,
        createdAt: created.created_at,
      };
      localStorage.setItem(KEY, JSON.stringify(user));
      return user;
    }
    // Local fallback: create local user & profile
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: username,
      phone,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify({ ...user, password }));
    const p: Profile = {
      id: user.id,
      username,
      email,
      phone,
      profile_image: null,
      coins: 100,
      is_active: true,
      is_verified: false,
      role: "user",
      created_at: user.createdAt,
      last_login: null,
    };
    await ProfileService.upsertProfile(p);
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
    // Supabase sign out (fire-and-forget)
    if (isSupabaseReady && supabase) {
      void safe(supabase.auth.signOut());
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!(isSupabaseReady && supabase)) {
      throw new Error("Password change requires server auth");
    }
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) throw new Error(userErr?.message || "Not authenticated");
    const email = userData.user.email!;
    const reauth = await supabase.auth.signInWithPassword({ email, password: currentPassword });
    if (reauth.error) throw new Error("Current password is incorrect");
    const upd = await supabase.auth.updateUser({ password: newPassword });
    if (upd.error) throw new Error(upd.error.message);
  },

  verifyPhone(code: string): boolean {
    // demo code
    return code === "123456";
  },
};